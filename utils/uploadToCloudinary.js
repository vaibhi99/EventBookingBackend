const cloudinary = require("cloudinary").v2;

async function uploadImage(file, Folder){
    return await cloudinary.uploader.upload(file.tempFilePath, {resource_type:"auto", folder: Folder});
}

module.exports = uploadImage;