const mongoose = require("mongoose");
const event = require("./event");

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
    },

    resetPasswordToken:{
        type:String
    },

    resetPasswordExpiry:{
        type: Date
    },

    blocked:{
        type:Boolean,
        default:false
    }
})

userSchema.index({role:1});

module.exports= mongoose.model("User",userSchema);