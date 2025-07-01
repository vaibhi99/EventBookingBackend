const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    
    price:{
        type:Number,
        required: true
    },

    event:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event"
    },

    seatNo:{
        type: Number,
        required: true
    },

    createdAt:{
        type:Date,
        default: Date.now(),
        expiry:15*60
    },

    QR:{
        type: String,
    }
})

module.exports = mongoose.model("Ticket", ticketSchema);