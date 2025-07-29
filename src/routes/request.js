const express = require("express")
const {userAuth} = require("../middlewares/auth")

const requestRouter = express.Router()

//Send connection request
requestRouter.post("/sendConnectionRequest", userAuth, async(req, res) => {
  try{
    const user = req.user
    res.send(user.firstName + " has sent a connection request.")
  }
  catch(error){
    res.status(400).json("ËRROR: " + error.message)
  }
})

module.exports = {requestRouter}