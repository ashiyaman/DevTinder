const jwt = require("jsonwebtoken")
const User = require("../models/users")
require("dotenv").config()

const SECRET_JWT = process.env.SECRET_JWT

const userAuth = async(req, res, next) => {
    try{
        //get token        
        const {token} = req.cookies
        if(!token){
            return res.status(401).send({message: "Please Login!!"})
        }
        //validate token
        const decodedObj = jwt.verify(token, SECRET_JWT)
        const {_id} = decodedObj
        //Get user from DB
        const loggedInUser = await User.findById(_id)
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