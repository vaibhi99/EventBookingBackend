const User = require("../models/user");
const OTP = require("../models/otp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator =require("otp-generator");

require("dotenv").config();

//generate otp
exports.generateOTP = async (req, res) => {
    try{
        const {email} = req.body;

        //validation
        if(!email){
            return res.status(401).json({
                success: false,
                message: "Enter the email address"
            })
        }

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })

        const result = await OTP.create({
            otp: otp,
            email: email
        })

        res.status(200).json({
            success:true,
            message:"OTP sent successfully"
        })
    } catch(err){
        res.status(500).json({
            success: false,
            message:"Error occured while generating otp"
        })
    }
}


//Signup
exports.signup = async (req, res) =>{
    try{
        const {firstName, lastName, email,password, confirmPassword, role, otp} = req.body;

        //validation
        if(!firstName || !lastName || !email || !password || !confirmPassword ||!role || !otp){
            return res.status(401).json({
                success: false,
                message:"Enter all the required fields"
            })
        }

        //check if password entered is same 
        if(password !== confirmPassword){
            return res.status(401).json({
                success: false,
                message:"Passwords do not match"
            })
        }

        //find otp
        const actualOTP = await OTP.find({email}).sort({created:-1}).limit(1);

        if(!actualOTP[0].otp){
            return res.status(401).json({
                success: false,
                message:"No otp found for this email"
            })
        }

        if(actualOTP[0].otp !== otp){
            return res.status(401).json({
                success: false,
                message:"Wrong OTP"
            })
        }

        //hash password
        const hashedpassword = await bcrypt.hash(password, 10);

        //create user
        const response = await User.create({
            firstName:firstName, 
            lastName:lastName,
            email:email,
            password: hashedpassword,
            role:role});

        response.password = undefined;

        //Create token and log in the user 
        const payload={
            role: user.role,
            userid: user._id,
            email: email
        }

        const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn:"2h"
        })

        res.status(200).cookie("token", token, 
            {
                expires: new Date(Date.now() + 24*60*60*1000),
                httpOnly: true
            }
        ).json({
            success: true,
            message:"User Created Successfully ",
            response
        })
    } catch(err){
        res.status(500).json({
            success: false,
            message:"Some internal error occured while registering"
        })
    }
}


//Login
exports.login = async (req, res) =>{
    try{
        const {email, password, role} = req.body;

        //validation 
        if(!email || !password || !role){
            return res.status(401).json({
                success: false,
                message:"Enter all the fields"
            })
        }

        const user = await User.findOne({email:email});
        
        if(!user){
            return res.status (401).json({
                success: false,
                message:"User doesn't exists"
            })
        }

        //check if the role is same
        if(user.role !== role){
            return res.status(401).json({
                success: false,
                message:"Select correct role"
            })
        }

        const result = await bcrypt.compare(password, user.password);

        if(!result){
            return res.status(401).json({
                success:false,
                message:"Wrong Password"
            })
        }

        const payload={
            role: user.role,
            userid: user._id,
            email: email
        }

        const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn:"2h"
        })

        const response = user;

        res.status(200).cookie("token", token, 
            {
                expires: new Date(Date.now() + 60*60*1000),
                httpOnly: true
            }
        ).json({
            success: true,
            message:"User Logged In successfully",
            response
        })
    } catch(err){
        res.status(500).json({
            success:false,
            message:"Internal error occured while Logging in"
        })
    }
}