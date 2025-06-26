const mongoose = require("mongoose");
const category = require("./category");

const eventSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    
    organiser:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },

    attendees:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],

    date:{
        type: Date,
        required: true
    },

    venue:{
        type:String,
        required: true
    },

    location: {
        type: {
        type: String,
        enum: ['Point']
        },
        coordinates: {
        type: [Number]
        }
    },

    price:{
        type:Number, 
        requierd:true
    },

    description:{
        type: String,
    },

    rating_review:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Rating_Review"
    }],

    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }],

    image:{
        type: String
    },

    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    
    attendeesCount:{
        type:Number,
        default:0
    },
})

eventSchema.index({ location: '2dsphere' , attendessCount:-1, category:1, date:1});


module.exports= mongoose.model("Event", eventSchema);