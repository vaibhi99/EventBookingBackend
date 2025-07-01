const Ticket = require("../models/ticket");

exports.getTicket = async (req, res) =>{
    try{
        const {eventid} = req.body;

        const userid = req.decoded.userid;

        if(!eventid){
            return res.status(401).json({
                success: false,
                message:"No event id passed"
            })
        }

        if(!userid){
            return res.status(401).json({
                success: false,
                message:"Token doesn't contain userid"
            })
        }

        const ticket = await Ticket.find({user: userid, event: eventid});

        if(!ticket){
            return res.status(401).json({
                success: false,
                message:"No ticket found"
            })
        }

        res.status(200).json({
            success: true,
            message:"Ticket found",
            ticket
        })
    } catch(err){
        res.status(500).json({
            success: false,
            message:"Internal error in fetching ticket "+err
        })
    }
}