const express = require('express')  //  reference to the express that is in node_modules folder

const app = express()   // create instance of express
                        //  create a new express server

const {connectDB} = require("./config/database")
const User = require("./models/users")


app.use(express.json()) //  its a middleware. We get response as JSON object. To read we need to parse through JSON. 
                        //  It is provided by express itself
                        // similar to app.use("/") => when we dont give any endpoint, its applied to all routes

app.post("/signup", async(req, res) => {

    const user = new User(req.body)
    console.log(req.body)
    try{
        const savedUser = await user.save()
        console.log(savedUser)
        if(!savedUser){
            res.status(404).send("Unable to save user")
        }
        res.send("User saved successfully")
    }
    catch(error){
        res.status(400).send("Error saving the user:" + error)
    }
})

app.get("/user", async(req, res) => {
    try{
        const user = await User.find({email: req.body.email})
        if(!user){
           res.status(404).send("User not found")
        }
        res.send(user)
    }
    catch(error){
        res.status(400).json("Some error", error)
    }
})

//  Get all users
app.get("/feed", async(req, res) => {
    try{
        const users= await User.find()
        if(!users){
            res.status(404).send("No users found")
        }
        res.send(users)
    }
    catch(error){
        res.status(400).send("Some error")
    }
})

//  Get user by id
app.get("/user/:userId", async(req, res) => {
    try{
        const user = await User.findById(req.params.userId)
        if(!user){
            res.status(404).send("user not found.")
        }
        res.send(user)
    }
    catch(error){
        res.status(400).send("Something went wrong")
    }
})

//Delete API for user
app.delete("/user", async(req, res) => {
    try{
        const deletedUser = await User.findByIdAndDelete(req.body)
        if(!deletedUser){
            res.status(404).send("User not found")
        }
        res.send(deletedUser)
    }
    catch(error){
        res.status(400).send("Something went wrong")
    }
})

//Update user
app.patch("/user/:userId", async(req, res) => {
    try{
        console.log(req.params.userId, req.body)
        const ALLOWED_UPDATES = ["firstName", "lastName", "password", "age", "gender", "bio", "photoUrl", "skills"]
        const isUpdateAllowed = Object.keys(req.body).every((k) => 
            ALLOWED_UPDATES.includes(k)
        )
        console.log(isUpdateAllowed)
        if(!isUpdateAllowed){
            throw new Error("Update not allowed")
        }
        if(req.body?.skills.length > 20) throw new Error("Skills cannot ne more than 20")
        const updatedUser = await User.findByIdAndUpdate(
            {_id: req.params.userId},
            req.body, 
            {returnDocument:"after",runValidators: true }
        )
        console.log(updatedUser)
        if(!updatedUser){
            res.status(404).send("User not found")
        }
        res.send(updatedUser)
    }
    catch(error){
        res.status(400).send("USER UPDATE FAILED:" + error)
    }
})

connectDB()
    .then(() => {
        console.log("Connected to database successfully")
        app.listen(3000, () => {
            console.log("Server is successfully listening on port 3000")
        })
    })
    .catch((err) => {
        console.log("Error connecting to database", err)
    })

