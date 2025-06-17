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

    venue:{
        type:String,
        required: true
    },

    zip:{
        type:Number,
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
        type:String,
        required: true,
        enum:["Sports","Concerts","Workshops","Conferences"]
    }
})

eventSchema.index({ location: '2dsphere' });

module.exports= mongoose.model("Event", eventSchema);