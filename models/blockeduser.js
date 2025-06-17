const mongoose = require("mongoose");

const rrSchema = new mongoose.Schema({
    user:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]
})

module.exports = mongoose.model("BlockedUsers", blockedSchema);