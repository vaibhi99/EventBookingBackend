const cloudinary = require("cloudinary").v2;

require("dotenv").config();

const cloudinaryConnect = async() =>{
    try{
        cloudinary.config(process.env.CLOUDINARY_URL);
    } catch(err){
        console.error(err);
    }
}

module.exports = cloudinaryConnect;