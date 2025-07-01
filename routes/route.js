const express = require("express");
const route = express.Router();

const {AuthN, isAttendee, isOrganiser, isAdmin} = require("../middlewares/Auth");
const {checkBlocked} = require("../middlewares/checkBlocked");

//Auth
const {generateOTP, signup, login} = require("../controllers/Auth");
route.post("/generateotp", generateOTP);
route.post("/signup", signup);
route.post("/login", login);


//Events
const {createEvent, allEvents, nearbyEvents, categoryEvents, topSellingEvents, organiserEventsDashboard, userEventsDashboard, getEventById, allUpcomingEvents} = require("../controllers/events");
route.post("/event/create", AuthN, isOrganiser, checkBlocked, createEvent);
route.get("/event", allEvents);
route.post("/event/nearby", nearbyEvents);
route.post("/event/category", categoryEvents);
route.get("/event/topselling", topSellingEvents);
route.get("/event/organiserDashboard", AuthN, isOrganiser, organiserEventsDashboard);
route.get("/event/attendeeDashboard", AuthN, isAttendee, userEventsDashboard);
route.post("/eventById", getEventById);
route.get("/event/upcoming", allUpcomingEvents);

//Category
const {createCategory, getAllCategories} = require("../controllers/category");
route.post("/category/create", AuthN, isAdmin, createCategory);
route.get("/category", getAllCategories);


//user
const {getUser, getAttendees, getOrganisers, blockUser, unblockUser, editProfile} = require("../controllers/user");
route.get("/user",AuthN, getUser);
route.get("/user/attendee", AuthN, isAdmin, getAttendees);
route.get("/user/organiser", AuthN, isAdmin, getOrganisers);
route.post("/user/block", AuthN, isAdmin, blockUser);
route.post("/user/unblock", AuthN, isAdmin, unblockUser);
route.post("/user/updateProfile", AuthN, editProfile);



//rating & review
const {createRR, getEventRatings} = require("../controllers/rating_review");
route.post("/rating/create", AuthN, isAttendee, checkBlocked, createRR);
route.get("/eventRating", getEventRatings);


//reset password 
const {resetPasswordLink, resetPassword} =  require("../controllers/resetpassword");
route.post("/resetpassword", resetPasswordLink);
route.post("/resetpassword/:token", resetPassword);


//Comments
const {getEventComments, deleteComment} = require("../controllers/comment");
route.post("/eventComment", getEventComments);
route.post("/comment/delete", AuthN, isAttendee, deleteComment);


//Payments
const {createOrder, verifypayment} = require("../controllers/payment");
route.post("/payment",AuthN, createOrder);
route.post("/payment/verify", verifypayment);

//Ticket
const{getTicket} = require("../controllers/ticket");
route.post("/ticket", AuthN, getTicket);

module.exports = route;