const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    
    organiser:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    attendees:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],

    date:{
        type: Date,
        required: true
    },


    
})

module.exports= mongoose.model("Event", eventSchema);