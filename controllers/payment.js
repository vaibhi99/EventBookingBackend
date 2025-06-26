const {instance} = require("../config/razorpay");
const Event = require("../models/event");
const User = require("../models/user");
const Payment = require("../models/payment");

const createOrder = async (req, res) =>{
    try{
        const {eventid} = req.body;

        const userid = req.decoded.user_id;

        if(!eventid){
            return res.status(401).json({
                success: false,
                message:"No event ID found"
            })
        }

        if(!userid){
            return res.status(401).json({
                success: false,
                message:"No user ID found in token"
            })
        }


        const event = await Event.findById(eventid);

   
        if(!event){
            return res.status(401).json({
                success: false,
                message:"Couldn't find the event !"
            })
        }

        // check if the user is already enrolled 
        if(event.attendees.includes(userid)){
            return res.status(200).json({
                success: false,
                message:"User is already enrolled in the event !"
            })
        }

        const options = {
            amount: 50000,
            currency: "INR",
            receipt: "testpayment",

            notes:{
                userid: userid,
                eventid: eventid
            }
        }

        const response =  await instance.orders.create(options);
        console.log(response);

        res.status(200).json({
            success: true,
            message:"Order created"
        })

    } catch(err){
        res.status(500).json({
            success: false,
            message:"Internal error in creating order"
        })
    }
}


exports.verifypayment = async (req, res) =>{
    try{
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;

        const {userid, eventid} = req.body.payload.payment.entity.notes;

        if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature){
            return res.status(401).json({
                success: false,
                message:"Enter all the details"
            })
        }


        const payment = await Payment.find({orderid: razorpay_order_id, user: userid});

        if(!payment){
            res.status(401).json({
                success: false,
                message:"Invalid order"
            })
        }

        //verify
        const expectedSignature = crypto.createHmac("sha256", RAZORPAY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

        if(expectedSignature === razorpay_signature){

        }else{

        }
    } catch(err){

    }
}