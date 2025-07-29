const validator = require("validator")

const validateSignUp = (firstName, lastName, email, password) => {
    if(!firstName || !lastName || !email || !password){
        throw new Error("Please enter all the details")
    }
    else if(!validator.isEmail(email)){
        throw new Error("Please enter a valid email")
    }
    else if(!validator.isStrongPassword(password)){
        throw Error("Please enter a strong password")
    }
}

const validateEditProfileData = (req) => {
    const ALLOWED_EDITS = ["firstName", "lastName", "age", "bio", "gender", "photoUrl", "skills"]
    const isEditable = Object.keys(req.body).every(k => ALLOWED_EDITS.includes(k))
    return isEditable
}

module.exports = {validateSignUp, validateEditProfileData}