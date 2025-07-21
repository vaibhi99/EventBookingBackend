const {instance} = require("../config/razorpay");
const Event = require("../models/event");
const User = require("../models/user");
const {sendmail} = require("../utils/mailsender");
const Ticket = require("../models/ticket");
const generateTicketQRCode = require("../utils/qrcode");
const crypto = require("crypto");

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

        const options = {
            amount: event.price,
            currency: "INR",
            receipt: "testpayment",

            notes:{
                userid: userid,
                eventid: eventid, 
                ticketid: ticket._id.toString()
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


exports.verifypayment = async (req, res) => {
    try {
        const signature = req.headers["x-razorpay-signature"];
        const expectedSignature = crypto.createHmac("sha256", process.env.RZ_WEBHOOK)
            .update(JSON.stringify(req.body))
            .digest("hex");

        if (signature !== expectedSignature) {
            return res.status(401).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        console.log(" Payment verified");

        const { userid, eventid, ticketid } = req.body.payload.payment.entity.notes;

        if (!userid || !eventid || !ticketid) {
            return res.status(400).json({
                success: false,
                message: "Missing required info from Razorpay notes"
            });
        }

        const event = await Event.findById(eventid);
        const user = await User.findById(userid);

        if (!event || !user) {
            return res.status(404).json({
                success: false,
                message: "User or Event not found"
            });
        }

        const ticket = await Ticket.findByIdAndUpdate(
            ticketid,
            {
                $set: {
                    noExpiry: true,
                    seatNo: event.seatsAvl
                }
            },
            { new: true }
        );

        await event.updateOne({
            $push: { attendees: userid }
        });

        await user.updateOne({
            $push: { eventsEnrolled: eventid }
        });

        const mailBody = ` You have successfully enrolled in *${event.name}* scheduled on *${event.date}*.\n\n🪪 Your ticket QR: ${ticket.QR}`;

        await sendmail(user.email, "Payment Successful - Event Ticket", mailBody);

        return res.status(200).json({
            success: true,
            message: "Payment verified and user enrolled successfully"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal error during payment verification: " + err.message
        });
    }
};
