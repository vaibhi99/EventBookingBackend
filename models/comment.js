const mongoose=  require("mongoose");
const user = require("./user");

const commentSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    firstName:{
        type:String,
        default:"Anonymous"
    },

    comment:{
        type: String,
        required: true,
        trim: true
    },

    event:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event"
    },

    time:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Comment", commentSchema);