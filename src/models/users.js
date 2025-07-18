const express = require("express")
const { default: mongoose } = require("mongoose")

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

module.exports = mongoose.model("User", userSchema)