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

const saveComment = async (data) => {
  const { comment, time, firstName, email, senderId, eventId } = data;

  const newComment = await Comment.create({
    comment,
    time,
    firstName,
    email,
    senderId,
    event: eventId
  });

  // Push comment to Event model
  await Event.findByIdAndUpdate(eventId, {
    $push: { comments: newComment._id }
  });

  return newComment;
};


// Get all comments for an event (newest first)
const getEventComments = async (req, res) => {
    try {
        const { eventId } = req.body;

        if (!eventId) {
            return res.status(400).json({
                success: false,
                message: "Provide an eventId",
            });
        }

        const event = await Event.findById(eventId).populate({
            path: "comments",
            options: {
                sort: { time: -1 } 
            }
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Comments fetched",
            response: event.comments,
        });
    } catch (err) {
        console.error("Error fetching comments:", err.message);
        return res.status(500).json({
            success: false,
            message: "Internal error in fetching comments"
        });
    }
};

// Delete a comment
const deleteComment = async (req, res) => {
    try {
        const { commentId, eventId } = req.body;
        const user_id = req.decoded.userid;

        // Validation
        if (!commentId || !eventId) {
            return res.status(400).json({
                success: false,
                message: "Provide a commentId and eventId"
            });
        }

        if (!user_id) {
            return res.status(401).json({
                success: false,
                message: "No user ID found in token"
            });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        if (comment.user.toString() !== user_id) {
            return res.status(403).json({
                success: false,
                message: "You can't delete someone else's comment"
            });
        }

        const event = await Event.findByIdAndUpdate(
            eventId,
            { $pull: { comments: commentId } },
            { new: true }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "No event found with such ID"
            });
        }

        await Comment.findByIdAndDelete(commentId);

        return res.status(200).json({
            success: true,
            message: "Comment deleted!"
        });

    } catch (err) {
        console.error("Delete comment error:", err.message);
        return res.status(500).json({
            success: false,
            message: "There was an internal error while deleting the comment"
        });
    }
};

module.exports = { saveComment, getEventComments, deleteComment };
