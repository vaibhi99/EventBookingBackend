const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type: String, 
        required: true,
        trim:true
    },

    lastName:{
        type: String,
        required: true,
        trim:true
    },

    email:{
        type: String,
        required:true,
        trim:true
    },

    password:{
        type:String,
        required: true
    },

    eventsEnrolled:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Event"
    }],

    role:{
        type:String, 
        required: true,
        enum:["Attendee","Organiser"]
    }
})

module.exports= mongoose.model("User",userSchema);