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

    // try{
    //     await user.save()
    //     res.send("User saved successfully")
    // }
    // catch(error){
    //     res.send(400).send("Error saving the user: ", error.message)
    // }
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

