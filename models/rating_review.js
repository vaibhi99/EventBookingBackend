const mongoose = require("mongoose");

const rrSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    event:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Event"
    },

    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },

    review:{
        type: String,
        trim: true
    }
})

module.exports = mongoose.model("Rating_Review", rrSchema);