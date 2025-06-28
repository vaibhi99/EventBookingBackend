const User = require("../models/user");

exports.checkBlocked = async (req, res,next) =>{
    try{
        const user_id = req.decoded.userid;

        if(!user_id){
            return res.status(401).json({
                success: false,
                message:"No userid in token"
            })
        }

        const user = await User.findById(user_id);

        if(!user){
            return res.status(401).json({
                success: false,
                message:"No user found"
            })
        }

        if(user.blocked){
            return res.status(401).json({
                success: false,
                message:"User is Banned !"
            })
        }
        next();

    } catch(err){
        res.status(500).json({
            success: false,
            message:"Internal error in checking user blocked status "+err
        })
    }
} 