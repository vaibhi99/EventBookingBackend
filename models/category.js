const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    category:{
        type: String,
        required: true
    },

    events:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Event"
    }]
})

module.exports = mongoose.model("Category", categorySchema);