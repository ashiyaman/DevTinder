const express = require('express')  //  reference to the express that is in node_modules folder

const app = express()   // create instance of express
                        //  create a new express server

const {connectDB} = require("./config/database")
const User = require("./models/users")


app.use(express.json()) //  its a middleware. We get response as JSON object. To read we need to parse through JSON. 
                        //  It is provided by express itself
                        // similar to app.use("/") => when we dont give any endpoint, its applied to all routes

app.post("/signup", async(req, res) => {

    console.log(req.body)
    // const user = new User({
    //     firstName: "Ashiya",
    //     lastName: "Amanulla",
    //     email: "ashiya1005@gmail.com",
    //     password: "ashiya",
    //     age: 32,
    //     gender: "Female"
    // })
    const user = new User(req.body)
    try{
        await user.save()
        res.send("User saved successfully")
    }
    catch(error){
        res.send(400).send("Error saving the user: ", error.message)
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

