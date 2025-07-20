const jwt = require("jsonwebtoken")
const User = require("../models/users")
require("dotenv").config()

const SECRET_JWT = process.env.SECRET_JWT

const userAuth = async(req, res, next) => {
    try{
        //get token
        console.log("cookies....", req.cookies)
        const {token} = req.cookies
        console.log(token)
        if(!token){
            console.log("Token not ")
            throw new Error("Token not valid.")
        }
        //validate token
        console.log("....secret..............", SECRET_JWT)
        const decodedObj = jwt.verify(token, SECRET_JWT)
        const {_id} = decodedObj
        console.log(_id)
        //Get user from DB
        const loggedInUser = await User.findById(_id)
        console.log("User.....", loggedInUser)
        if(!loggedInUser){
            throw new Error("User not found")
        }
        req.user = loggedInUser
        next()
    }
    catch(error){
        res.status(400).send("ERROR: " + error.message)
    }
}

module.exports = {userAuth}