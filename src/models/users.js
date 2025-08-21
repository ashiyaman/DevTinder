const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
require("dotenv").config()
const { default: mongoose } = require("mongoose")

const SECRET_JWT = process.env.SECRET_JWT

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 60
    },
    lastName: {
        type: String,
        required: true,
        minLength: 2,  
        maxLength: 60
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^(?!\d)[\w.-]+@[\w.-]+\.\w+/, "Please enter valid Email."]
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        trim: true
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "others"]
        },
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Gender data is not valid")
            }
        }
    },
    bio: {
        type: String,
        default: "Currently in a relationship with my code editor."
    },
    photoUrl: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/thumbnails/024/983/914/small_2x/simple-user-default-icon-free-png.png"
    },
    skills: {
        type: [String],
        maxLength: 20
    }
},
{timestamps: true})

userSchema.methods.getJWT = function(){
    const user = this
    const token = jwt.sign({_id: user._id}, SECRET_JWT, {expiresIn: "7d"})

    return token
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this
    const passwordHash = user.password
    console.log(passwordInputByUser)
    console.log(passwordHash)
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash)
    console.log(isPasswordValid)
    return isPasswordValid
}

module.exports = mongoose.model("User", userSchema)