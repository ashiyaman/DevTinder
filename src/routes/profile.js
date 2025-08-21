const express = require("express")

const { userAuth } = require("../middlewares/auth");
const User = require("../models/users");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router()

profileRouter.get("/profile/view", userAuth , async(req, res) => {
  try {
    const user = req.user
    if (!user) {
      res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR: ", + error);
  }
});

profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Update not allowed!")
        }
        const updatedUser = await User.findOneAndUpdate({_id: req.user._id}, req.body, {new: true, runValidators: true})
        res.status(200).json({
            message:`${updatedUser.firstName}, your profile is updated successfully`,
            data: updatedUser
            })
    }
    catch(error){
        res.status(400).send("ERROR: " + error)
    }    
})

profileRouter.patch("/profile/password", userAuth, async(req, res) => {
    try{
        const user = req.user

    }
    catch(error){
        res.status(400).send("ERROR: " + error.message)
    }
})

module.exports = {profileRouter}