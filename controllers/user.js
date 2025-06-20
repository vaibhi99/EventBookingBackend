const User =require("../models/user");

//get all users
exports.getUser = async (req, res) =>{
    try{
        const user_id = req.decoded.userid;

        if(!user_id){
            return res.status(401).json({
                success: false,
                message:"No user id not found in token"
            })
        }

        const response = await User.findById(user_id);

        if(!user){
            return res.status(401).json({
                success: true,
                message:"User not found"
            })
        }

        res.status(200).json({
            success: true,
            message:"User Fetched ",
            response
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
            message:"Interanl error occured in fetching attendees"
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
            message:"Interanl error occured in fetching organiser"
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