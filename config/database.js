const mongoose = require("mongoose");

require("dotenv").config();

exports.dbconnect = async () =>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log("Database Connected Successfully !");
    }).catch((err) => {
        console.log("Error occured while connecting to Database");
        console.error(err);
        process.exit(1);
    })
}