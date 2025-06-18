const express = require("express");

const route = express.Router();

//otp,signup,login
const {generateOTP, signup, login} = require("../controllers/Auth");

route.post("/generateotp", generateOTP);
route.post("/signup", signup);
route.get("/login", login);


//Events
const {createEvent, nearbyEvents} = require("../controllers/events");
route.post("/createEvent", createEvent);
route.get("/nearbyEvent", nearbyEvents);

//Category
const {createCategory} = require("../controllers/category");
route.post("/createCategory", createCategory);

module.exports = route;