const express = require("express"); //  reference to the express that is in node_modules folder
const {userAuth} = require("./middlewares/auth")

const app = express(); // create instance of express
//  create a new express server

const { connectDB } = require("./config/database");
const User = require("./models/users");
const { validateSignUp } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")

app.use(express.json()); //  its a middleware. We get response as JSON object. To read we need to parse through JSON.
//  It is provided by express itself
// similar to app.use("/") => when we dont give any endpoint, its applied to all routes

app.use(cookieParser())

const SECRET_JWT = process.env.SECRET_JWT

//User register
app.post("/signup", async (req, res) => {
  try {
    const {firstName, lastName, email, password} = req.body

    //Validate user
    validateSignUp(firstName, lastName, email, password);

    //Hash password
    const passwordHash = await bcrypt.hash(password, 16)

    //Save to db
    const user = new User({
        firstName,
        lastName,
        email,
        password: passwordHash
    });
    
    const savedUser = await user.save();
    console.log(savedUser);
    if (!savedUser) {
      res.status(404).send("Unable to save user");
    }
    res.send("User saved successfully");
  } catch (error) {
    res.status(400).send("Error saving the user:" + error);
  }
});

//User Login

app.post("/login", async(req, res) => {
    console.log("login")
    try{
        const {email, password} = req.body
        const user = await User.findOne({email: email})
        if(!user){
            throw new Error("INVALID CREDENTIALS")
        }
        //Check if pwd is correct
        const isPasswordMatched = await bcrypt.compare(password, user.password)
        if(isPasswordMatched){
            //create JWT token
            
            const token = jwt.sign({_id: user._id}, SECRET_JWT, {expiresIn: "7d"})

            //pass the token in a cookie
            res.cookie("token", token)

            res.status(200).send("Welcome to DevTinder")
        }
        else{
            throw new Error("INVALID CREDENTIALS")
        }
    }
    catch (error) {
        res.status(400).send("INVALID CREDENTIALS");
    }
})

//Get user profile
app.get("/profile", userAuth, async(req, res) => {
  try{
    const user = req.user
    res.status(200).json(user)
  }
  catch (error) {
    res.status(400).json("Some error", error);
  }
})

//Send connection request
app.post("/sendConnectionRequest", userAuth, async(req, res) => {
  try{
    const user = req.user
    res.send(user.firstName + " has sent a connection request.")
  }
  catch(error){
    res.status(400).json("ËRROR: " + error.message)
  }
})

app.get("/user", async (req, res) => {
  try {
    const user = await User.find({ email: req.body.email });
    if (!user) {
      res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    res.status(400).json("Some error", error);
  }
});

//  Get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      res.status(404).send("No users found");
    }
    res.send(users);
  } catch (error) {
    res.status(400).send("Some error");
  }
});

//  Get user by id
app.get("/user/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404).send("user not found.");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

//Delete API for user
app.delete("/user", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.body);
    if (!deletedUser) {
      res.status(404).send("User not found");
    }
    res.send(deletedUser);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

//Update user
app.patch("/user/:userId", async (req, res) => {
  try {
    console.log(req.params.userId, req.body);
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "password",
      "age",
      "gender",
      "bio",
      "photoUrl",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(req.body).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    console.log(isUpdateAllowed);
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (req.body?.skills.length > 20)
      throw new Error("Skills cannot ne more than 20");
    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.params.userId },
      req.body,
      { returnDocument: "after", runValidators: true }
    );
    console.log(updatedUser);
    if (!updatedUser) {
      res.status(404).send("User not found");
    }
    res.send(updatedUser);
  } catch (error) {
    res.status(400).send("USER UPDATE FAILED:" + error);
  }
});

connectDB()
  .then(() => {
    console.log("Connected to database successfully");
    app.listen(4000, () => {
      console.log("Server is successfully listening on port 4000");
    });
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  });
