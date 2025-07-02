const {instance} = require("../config/razorpay");
const Event = require("../models/event");
const User = require("../models/user");
const {sendmail} = require("../utils/mailsender");
const Ticket = require("../models/ticket");
const generateTicketQRCode = require("../utils/qrcode");

let ticketid;

exports.createOrder = async (req, res) =>{
    try{
        const {eventid} = req.body;

        const userid = req.decoded.userid;

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

        if(event.seatsAvl <= 0){
            return res.status(200).json({
                success: false,
                message:"No seats available"
            })
        }

        const user = await User.findById(userid);

            if(!user){
                return res.status(401).json({
                    success: false,
                    message:"No user found"
                })         
            }

            const seatno = event.seatsAvl;

            const ticketData =JSON.stringify({
                Name: user.firstName,
                Event: event.name,
                Seat: seatno,
                Venue: event.venue
            });

            qr = await generateTicketQRCode(ticketData);

            if(qr == null){
                return res.status(401).json({
                    success: false,
                    message:"Error creating qr"
                })
            }

        const ticket = await Ticket.create({
            user: userid,
            price: event.price,
            event: eventid,
            seatNo: seatno,
            QR: qr
        })

        if(!ticket){
            return res.status(500).json({
                success: false,
                message:"No ticket created"
            })
        }

        ticketid= ticket._id;

        const options = {
            amount: event.price,
            currency: "INR",
            receipt: "testpayment",

            notes:{
                userid: userid,
                eventid: eventid
            }
        }

        const order =  await instance.orders.create(options);

        res.status(200).json({
            success: true,
            message:"Order created",
            order
        })

    } catch(err){
        res.status(500).json({
            success: false,
            message:"Internal error in creating order "+err
        })
    }
}


exports.verifypayment = async (req, res) =>{
    try{
        const signature = req.headers["x-razorpay-signature"];

        //verify
        const expectedSignature = crypto.createHmac("sha256", process.env.RZ_WEBHOOK)
        .update(JSON.stringify(req.body))
        .digest("hex");

        if(expectedSignature === signature){
            console.log("Payment is Verfied !");

            try{
                const {userid, eventid} = req.body.payload.payment.entity.notes;

                if(!userid || !eventid){
                    return res.status(401).json({
                        success: false,
                        message:"Userid or eventid is not provided"
                    })
                }

                const event = await Event.findById(eventid);

                if(!event){
                    return res.status(401).json({
                        success: false,
                        message:"No event found"
                    })         
                }
                
                const user = await User.findById(userid);

                if(!user){
                    return res.status(401).json({
                        success: false,
                        message:"No user found"
                    })         
                }

                const ticket = await Ticket.findByIdAndUpdate({ticketid}, {$set:{noExpiry:true},
                $set: {seatNo:event.seatsAvl}}, {new: true});

                await event.updateOne({
                    $push:{attendees: userid},
                    $set: seatsAvl = seatno-1
                });

                await user.updateOne({$push:{eventsEnrolled: eventid}});

                const mailbody=`You have successfully enrolled in ${event.name} scheduled on ${event.date}, here is your ticket ${ticket.QR}`;

                await sendmail(user.email, "Payment Successfull", mailbody);

            } catch(err){
                res.status(500).json({
                    success:false,
                    message:"Internal error after payment verifcation "+err
                })
            }
        }else{
            return res.status(401).json({
                success: false,
                message:"Payment is Not verified"
            })
        }


        res.status(200).json({
            success: true,
            message:"Payment Verified and user enrolled successfully"
        })
    } catch(err){
        res.status(500).json({
            success: false,
            message:"Interanl error in payment verification "+err
        })
    }
}
