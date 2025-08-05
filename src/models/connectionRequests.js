const {mongoose} = require("mongoose")

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['accepted', 'ignored', 'rejected', 'interested'],
            message: `{VALUE} is incorrect status type.`
        }
    }
},
{ timestamps: true })

connectionRequestSchema.pre("save", function(){
    const ConnectionRequest = this

    if(ConnectionRequest.fromUserId.equals(ConnectionRequest.toUserId)){
        throw new Error("You cannot send request to yourself")
    }
})

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema)

module.exports = ConnectionRequest