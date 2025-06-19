// const Comment = require("../models/comment");
// const Event = require("../models/event")

// //create Comment
// exports.createComment = async (req, res) => {
//     try{
//         const {comment, eventId} = req.body;

//         const user_id = req.decoded.userid;

//         if(!comment || !eventId){
//             return res.status(401).json({
//                 success: false,
//                 message:"Reqiured fields are missing"
//             })
//         }

//         if(!user_id){
//             return res.status(401).json({
//                 success: false,
//                 message:"No userid in token"
//             })
//         }

//         const event = await Event.findById(eventId);

//         if(!event){
//             return res.status(401).json({
//                 success: false,
//                 message:"Event doesn't exists"
//             })
//         }

//         const response = await Comment.create({
//             user: user_id,
//             comment: comment,
//             event: eventId
//         })

//         await event.updateOne({$push: {comments: response._id}},{new:true});

//         res.status(200).json({
//             success: true,
//             message:"Comment created",
//             response 
//         })
//     } catch(err){
//         res.status(500).json({
//             success: false,
//             message:"Internal error while creating comment "+ err
//         })
//     }
// }


// //get all comments of an event
// exports.getEventComments = async (req, res) =>{
//     try{
//         const {eventId} = req.body;

//         if(!eventId){
//             return res.status(401).json({
//                 success: false,
//                 message:"Reqiured fields are missing"
//             })
//         }

//         const event = await Event.findById(eventId);

//         if(!event){
//             return res.status(401).json({
//                 success: false,
//                 message:"Event doesn't exists"
//             })
//         }

//         const response = event.comments;

//         res.status(200).json({
//             success: true,
//             message:"Comments Fetched",
//             response 
//         })
//     } catch(err){
//         res.status(500).json({
//             success: false,
//             message:"Internal error while fetching comments of an event "+ err
//         })
//     }
// }