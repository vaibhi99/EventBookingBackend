const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },

    orderid:{
        type: String,
        required: true
    },

    paymentid:{
        type: String
    },

    amount:{
        type: Number,
        required: true
    },

    status:{
        type:String,
        enum:["created", "attempted", "paid"]
    },

    createdAt:{
        type: Date,
        defaullt: Date.now()
    }
})

module.exports = mongoose.model("Payment", paymentSchema);