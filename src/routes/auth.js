const express = require("express")
const bcrypt =  require("bcrypt")
const { validateSignUp } = require("../utils/validation");
const User = require("../models/users");

const authRouter = express.Router()

//authRouter.use("/") // same as app.use(""/")

//User register
authRouter.post("/signup", async (req, res) => {
  try {
    console.log(req.body)
    const {firstName, lastName, email, password} = req.body

    //Validate user
    validateSignUp(firstName, lastName, email, password);

    //Hash password
    const passwordHash = await bcrypt.hash(password, 16)

    //Save to db
    const user = new User({
        firstName,
        lastName,
        email,
        password: passwordHash
    });
    
    const savedUser = await user.save();
    console.log(savedUser);
    if (!savedUser) {
      res.status(404).send("Unable to save user");
    }
    res.send("User saved successfully");
  } catch (error) {
    res.status(400).send("Error saving the user:" + error);
  }
});

//User Login

authRouter.post("/login", async(req, res) => {
    console.log("login")
    try{
        const {email, password} = req.body
        const user = await User.findOne({email: email})
        if(!user){
            throw new Error("INVALID CREDENTIALS")
        }
        //Check if pwd is correct
        const isPasswordMatched = user.validatePassword(password)
        if(isPasswordMatched){
            //create JWT token
            
            const token = user.getJWT()
            console.log(token)

            //pass the token in a cookie
            res.cookie("token", token)

            res.status(200).send("Welcome to DevTinder")
        }
        else{
            throw new Error("INVALID CREDENTIALS")
        }
    }
    catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})

//Logout
authRouter.post("/logout", async(req, res) => {
  res.cookie("token", null, {expiresIn: new Date(Date.now())})
  res.send("You have logged out successfully")
})

module.exports = {authRouter}