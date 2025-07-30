const express = require("express")
const {userAuth} = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequests");

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


//accept or ignore request
requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req, res) => {
  try{
    console.log("send req")
    const fromUserId = req.user._id
    const toUserId = req.params.toUserId
    const status = req.params.status

    const ALLOWED_STATUS = ["ignored", "interested"]
    if(!ALLOWED_STATUS.includes(status)){
      res.status(400).json({message: "Invalid status type: " + status})
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        {fromUserId, toUserId},
        {fromUserId: toUserId, toUserId: fromUserId}
      ]
    })

    if(existingConnectionRequest){
      res.status(400).json({message: "Invite has already been sent"})
    }

    const connection = new ConnectionRequest({fromUserId: fromUserId, toUserId: toUserId, status: status})
    await connection.save()

    res.status(200).json({message: `Connect Request Sent`})
  }
 catch(error){
  res.status(400).send("ERROR: " + error.message)
 }
})

module.exports = {requestRouter}