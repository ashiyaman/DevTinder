const express = require("express")
const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequests")

const userRouter = express.Router()

const USER_POPULATE_DATA = "firstName age gender bio photoUrl skills"

userRouter.get("/user/request/received", userAuth, async(req, res) => {
    try{
        console.log(req.user)
        const loggedInUser = req.user
        if(!loggedInUser){
            return res.status(400).json({message: "User not found"})
        }

        const userConnections = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        })
        .populate(
            "fromUserId",
            USER_POPULATE_DATA
        )
        console.log(userConnections)
        if(!userConnections){
            return res.status(200).json({message: "No connection request"})
        }

        res.status(200).json({
            message: "Connections fetched successfully",
            data: userConnections
        })
    }
    catch(error){
        res.status(400).send("ERROR: " + error.message)
    }
})

userRouter.get("/user/connections", userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user
        console.log(loggedInUser.firstName)
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"}
            ]
        })
        .populate("fromUserId", USER_POPULATE_DATA)

        console.log(connectionRequests)

        if(!connectionRequests){
            return res.status(200).json({message: "No connections yet!"})
        }

        const data = connectionRequests.map((row) => {
            if(row.toUserId.toString() === loggedInUser._id.toString()){
                return row.fromUserId
            } 
            return row.toUserId
        })

        res.status(200).json({
            message: "All Connections fetched successfully",
            data: data
        })
    }
    catch(error){
        res.status(400).send("ERROR: " + error.message)
    }
})


module.exports = {userRouter}