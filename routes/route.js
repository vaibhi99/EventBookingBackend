const express = require("express");

const route = express.Router();

//otp,signup,login
const {generateOTP, signup, login} = require("../controllers/Auth");

route.post("/generateotp", generateOTP);
route.post("/signup", signup);
route.get("/login", login);


module.exports = route;