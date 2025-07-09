const express = require('express')  //  reference to the express that is in node_modules folder

const app = express()   // create instance of express
                        //  create a new express server



app.use("/hello", (req, res) => {
    res.send("Hello from Dashboard")
})

app.use("/", (req, res) => {
    res.send("Hello from DevTinder Server!")
})

app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000")
})
