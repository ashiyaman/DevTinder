const express = require("express")
const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequests")
const User = require("../models/users")

const userRouter = express.Router()

const USER_POPULATE_DATA = "firstName age gender bio photoUrl skills"

userRouter.get("/user/request/received", userAuth, async(req, res) => {
    try{
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
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"}
            ]
        })
        .populate("fromUserId", USER_POPULATE_DATA)

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

userRouter.get("/feed", userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user

        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        limit = limit > 50 ? 50 : limit
        const skip = (page - 1) * limit

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        })
        .select("fromUserId toUserId")        

        const hideUsers = new Set()
        connectionRequests.forEach(req => {
            hideUsers.add(req.fromUserId.toString())
            hideUsers.add(req.toUserId.toString())
        })

        const feedConnections = await User.find({
            $and: [
                {_id: {$nin: Array.from(hideUsers)}},
                {_id: {$ne: loggedInUser._id}}
            ]
        })
        .select(USER_POPULATE_DATA)
        .skip(skip)
        .limit(limit)

        res.status(200).send(feedConnections)
    }
    catch(error){
        res.status(500).send("ERROR: " + error.message)
    }
})

module.exports = {userRouter}