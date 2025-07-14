const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://neoGStudent:ashiya@neog.b6txi.mongodb.net/devTinder")
}

module.exports = {connectDB}