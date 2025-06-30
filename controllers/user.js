const { response } = require("express");
const User =require("../models/user");

//get all users
exports.getUser = async (req, res) =>{
    try{
        const user_id = req.decoded?.userid;

        if(!user_id){
            return res.status(401).json({
                success: false,
                message:"No user id not found in token"
            })
        }

        const user = await User.findById(user_id);

        if(!user){
            return res.status(401).json({
                success: true,
                message:"User not found"
            })
        }

        console.log(user);

        res.status(200).json({
            success: true,
            message:"User Fetched ",
            user
        })
    } catch(err){
        res.status(500).json({
            success: false,
            message:"Internal error in fetching user " +err
        })
    }
}


//get all Attendees
exports.getAttendees = async (req, res) =>{
    try{
        const response = await User.find({role: "Attendee"})

        res.status(200).json({
            success: true,
            message:"Attendees fetched"
        })
    } catch(err) {
        res.status(500).json({
            success: false,
            message:"Interanl error occured in fetching attendees",
            response
        })
    }
}


//get all Organisers
exports.getOrganisers = async (req, res) =>{
    try{
        const response = await User.find({role: "Organiser"})

        res.status(200).json({
            success: true,
            message:"Organisers fetched"
        })
    } catch(err) {
        res.status(500).json({
            success: false,
            message:"Interanl error occured in fetching organiser",
            response
        })
    }
}


//Block users
exports.blockUser = async (req, res) =>{
    try{
        const {userId} = req.body;

        if(!userId){
            return res.status(401).json({
                success: false,
                message:"Provide a user id "
            })
        }

        const user = await User.findById(userId);

        if(!user){
            return res.status(401).json({
                success: false,
                message:"User doesn't exist"
            })
        }

        await user.updateOne({$set:{blocked: true}});

        res.status(200).json({
            success: true, 
            message:"User blocked successfully"
        })

    } catch(err){
        res.status(500).json({
            success: false,
            message:"Internal error occured while blocking user"
        })
    }
}


// unblock user 
exports.unblockUser = async (req, res) =>{
    try{
        const {userId} = req.body;

        if(!userId){
            return res.status(401).json({
                success: false,
                message:"Provide a user id "
            })
        }

        const user = await User.findById(userId);

        if(!user){
            return res.status(401).json({
                success: false,
                message:"User doesn't exist"
            })
        }

        await user.updateOne({$set:{blocked: false}});

        res.status(200).json({
            success: true, 
            message:"User Unblocked successfully"
        })

    } catch(err){
        res.status(500).json({
            success: false,
            message:"Internal error occured while Unblocking user"
        })
    }
}

exports.editProfile = async (req, res) =>{
    try{
        const {firstName, lastName, email} = req.body;

        const userid = req.decoded.userid;

        if(!userid){
            return res.status(401).json({
                success: false,
                message:'No user id in token'
            })
        }

        const user = await User.findById(userid);

        if(!user){
            return res.status(401).json({
                success: false,
                message:'No user found'
            })            
        }

        const response = await user.updateOne({firstName: firstName, lastName: lastName, email: email}, {new: true});

        res.status(200).json({
            success: true,
            message:"Profile changed",
            response
        })
    } catch(err){
        res.status(500).json({
            success: false,
            message:"Internal error occured while updating profile " + err
        })
    }
}