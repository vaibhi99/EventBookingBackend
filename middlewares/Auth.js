const jwt = require("jsonwebtoken");


exports.AuthN = async (req, res, next) =>{
    try{
        const token = req.body.token || req.cookie.token || req.header.authorization.replace("Bearer ","");

        if(!token){
            return res.status(401).json({
                success: false,
                message:"No jwt token found"
            })
        }

        //verify the token
        const result = jwt.verify(token, process.env.SERCRET_KEY);

        //invalid token
        if(!result){
            return res.status(401).json({
                success: false,
                message:"Invalid token"
            })
        }

        req.decoded =result;

        next();

    } catch(err){
        res.status(500).json({
            success: false,
            message:"Something went wrong while verifying the token"
        })
    }
}

exports.isAttendee = async (req, res, next) => {
    try{
        const role = req.decoded.role;

        if(role !== "Attendee"){
            return res.status(401).json({
                success: false,
                message:"You are not Permitted Attendee Section!!"
            })
        }

        next();

    } catch(err){
        res.status(500).json({
            success: false,
            message:"Something went wrong while authorizing Attendee"
        })
    }
}

exports.isOrganiser = async (req, res, next) => {
    try{
        const role = req.decoded.role;

        if(role !== "Organiser"){
            return res.status(401).json({
                success: false,
                message:"You are not Permitted Organiser Section !!"
            })
        }

        next();

    } catch(err){
        res.status(500).json({
            success: false,
            message:"Something went wrong while authorizing Organiser"
        })
    }
}


exports.isAmidn = async (req, res, next) => {
    try{
        const role = req.decoded.role;

        if(role!=="Admin" ){
            return res.status(401).json({
                success: false,
                message:"You are not Permitted Admin Section !!"
            })
        }

        next();

    } catch(err){
        res.status(500).json({
            success: false,
            message:"Something went wrong while authorizing Admin"
        })
    }
}