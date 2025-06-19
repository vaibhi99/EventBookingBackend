const Rating_Review = require("../models/rating_review");
const Event = require("../models/event");

exports.createRR = async (req, res) =>{
    try{
        const {eventId, rating, review="" } = req.body;

        const user_id = req.decoded.userid;

        if(!eventId || !rating){
            return res.status(401).json({
                success: false,
                message:"Specify all the fields"
            })
        }

        const event = await Event.findById(eventId);

        if(!event){
            return res.status(401).json({
                success: false,
                message:"No event exists with such id"
            })
        }

        if(event.date > Date.now()){
            return res.status(401).json({
                success: false,
                message: "Can't rate upcoming events"
            });
        }

        const user = await User.findById(user_id);

        if(!user.eventsEnrolled.includes(eventId)){
            return res.status(401).json({
                success: false,
                message:"User is not enrolled in this event"
            })
        }

        const response = await Rating_Review.create({
            user: user_id,
            event: eventId,
            rating: rating,
            review: review
        })

        //update in event also 
        await event.updateOne({$push: {rating_review: response._id}},{new: true}).populate("rating_review");

        res.status(200).json({
            success: true,
            message:"Rating and Review added successfully",
            response
        })

    } catch(err){
        res.status(500).json({
            success: false,
            message:"Internal error occured while Rating"
        })
    }
}



//get all rating of an event
exports.getEventRatings = async (req, res) => {
    try{
        const {eventId} =req.body;

        if(!eventId){
            return res.status(401).json({
                success: false,
                message:"Please provide eventId"
            })
        }

        const event = await Event.findById(eventId);

        if(!event){
            return res.status(401).json({
                success: false,
                message:"Couldn't find Event"
            })
        }

        const response = event.rating_review;

        res.status(200).json({
            success: true,
            message:"Rating fetched",
            response
        })
    } catch(err){
        res.status(500).json({
            success: false,
            message:"Internal error occured"
        })
    }
}