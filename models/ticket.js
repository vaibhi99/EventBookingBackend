const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
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

    QR:{
        type: String,
    }
})

module.exports = mongoose.model("Ticket", ticketSchema);