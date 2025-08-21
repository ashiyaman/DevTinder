const express = require("express")
const {userAuth} = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/users")

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


//interested or ignore request
requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req, res) => {
  try{
    const fromUserId = req.user._id
    const toUser = await User.findById(req.params.toUserId)
    const status = req.params.status

    if(fromUserId === toUser._id){
      res.status(400).json({message: "Cannot send invite to yourself"})
    }

    const ALLOWED_STATUS = ["ignored", "interested"]
    if(!ALLOWED_STATUS.includes(status)){
      return res.status(400).json({message: "Status not allowed: " + status})
    }

    if(!toUser){
      return res.status(400).json({message: "User not found"})
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        {fromUserId, toUserId: toUser._id},
        {fromUserId: toUser._id, toUserId: fromUserId}
      ]
    })

    if(existingConnectionRequest){
      return res.status(400).json({message: "Invite has already been sent"})
    }

    const connection = new ConnectionRequest({fromUserId: fromUserId, toUserId: toUser._id, status: status})
    await connection.save()

    res.status(200).json({message: req.user.firstName + " is " + status + " in " + toUser.firstName})
  }
 catch(error){
  res.status(400).send("ERROR: " + error.message)
 }
})

//accept or reject request
requestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res) => {
  try{
    const status = req.params.status
    const loggedInUser = req.user

    const ALLOWED_STATUS = ["accepted", "rejected"]
    if(!ALLOWED_STATUS.includes(status)){
      return res.status(400).json({message: "Status not allowed: " + status})
    }

    const connection = await ConnectionRequest.findOne({
      _id: req.params.requestId,
      toUserId: loggedInUser._id,
      status: "interested"
    })    
    if(!connection){
      return res.status(400).json({message: "Connection Request not found"})
    }

    connection.status = status
    const reviewedConnection = await connection.save()
    res.status(200).json({message: "Connection request " + status, reviewedConnection})
  }
  catch(error){
    res.status(400).send("ERROR: " + error.message)
  }
})

module.exports = {requestRouter}