const { response } = require("express");
const Comment = require("../models/comment");
const event = require("../models/event");
const Event = require("../models/event");

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


async function saveComment(data){
    try{
        const {eventId, comment} = data;

        if(!eventId || !comment){
            throw new error("All required fields are not provied");
        }

        const user_id = req.decoded.userid;

        if(!user_id){
            throw new error("User Id not found in token");
        }

        const event = await Event.findById(eventId);

        if(!event){
            throw new error("No event found");
        }

        const savedComment = await Comment.create({
            user:user_id,
            comment: comment,
            event: eventId
        });

        await event.updateOne({$push: {comments: savedComment._id}});
    } catch(err){
        console.log("Error in saving the comment ");
        console.error(err);
    }
}


// get all Comments of an event (newest -> oldest)
const getEventComments = async (req, res) =>{
    try{
        const {eventId} = req.body;

        if(!eventId){
            return res.status(401).json({
                success: false,
                message:"Provide an eventId"
            })
        }

        const event = await Event.findById(eventId).populate({
            path:"comments",
            options:{
                sort: {date:-1}
            }
        });

        const response = event.comments;

        res.status(200).json({
            success: true,
            message:"Comment fetched",
            response
        })
    } catch(err){
        res.status(500).json({
            success: false,
            message:"Internal error in fetching comments"
        })
    }
}


//delete a comment
const deleteComment = async (req, res) =>{
    try{
        const {commentId, eventId} = req.body;
        const user_id = req.decoded.userid;

        //validation
        if(!commentId || !eventId){
            return res.status(401).json({
                success: false,
                message:"provide a comment Id and eventId"
            })
        }

        if(!user_id){
            return res.status(401).json({
                success: false,
                message:"No user id found in token"
            })
        }

        const comment = await Comment.findById;
        
        if(comment.user.toString() !== user_id){
            return res.status(401).json({
                success:false,
                message:"You can't delete other's comment"
            })
        }

        const event = await Event.findByIdAndUpdate({eventId},{$pull :{comments: commentId}},{new:true});

        if(!event){
            return res.status(401).json({
                success: false,
                message:"No event found with such id"
            })
        }

        const response = await Comment.findByIdAndDelete(commentId);

        res.status(200).json({
            success: true,
            message:"Comment Deleted !"
        })

    } catch(err) {
        res.status(500).json({
            success: false,
            message:"There was some Internal error while deleting the comment"
        })
    }
}

module.exports = {saveComment, getEventComments, deleteComment};