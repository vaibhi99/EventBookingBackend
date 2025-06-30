
const jwt = require("jsonwebtoken");
// Authentication Middleware

exports.AuthN = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.replace("Bearer ", "");
      
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No JWT token found",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.decoded = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

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


exports.isAdmin = async (req, res, next) => {
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