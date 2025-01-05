import bcryptjs from "bcryptjs"
import crypto from 'crypto'

import {User} from "../models/user.model.js"
import { generateTokenAndSetCookies } from "../utils/generateTokenAndSetCookies.js"
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js"
import jwt from "jsonwebtoken"




export const signup = async (req,res) => {
    
    const{firstname,lastname,mobile,email,password,confirmpassword} = req.body
    
    try {
        
        if(!email || !password || !firstname || !lastname || !mobile || !confirmpassword ){
            console.log(firstname,lastname,mobile,email,password,confirmpassword)
            throw new Error("All field are required")
        }

        const userAlreadyExists = await User.findOne({email})
        const usermobileAlreadyExists = await User.findOne({mobile})

        if(userAlreadyExists){
            return res.status(400).json({succes:false,message:"User already exists"})
        }

        if(usermobileAlreadyExists){
            return res.status(400).json({succes:false,message:"This mobile number already exists"})
        }

        if(password !== confirmpassword){
            return res.status(400).json({success:false,message:"Comfirm password doesn't match password"})
        }

        const hashedPassword = await bcryptjs.hash(password,12);

        const verificationToken = Math.floor(100000 + Math.random()*900000).toString()

        const user = new User({
            firstname,
            lastname,
            mobile,
            email,
            password:hashedPassword,
            verificationToken:verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        })

        await user.save()

        // jwt

        generateTokenAndSetCookies(res,user._id);

        await sendVerificationEmail(user.email,verificationToken)

        res.status(201).json({

            success:true,
            message:"User created successfully",
            user:{
                ...user._doc,
                password: undefined,
                mobile: undefined
            }
  
        })

    } catch (error) {
        console.log("error in signup", error);
        res.send(500).json({success:false,message:"Server error"})
    }
}

export const verifyEmail = async (req,res) => {
    
    const {combineCode} = req.body
    
    try {
        const user = await User.findOne({
            verificationToken: combineCode,
            verificationTokenExpiresAt: {$gt: Date.now()}
        })

        if(!user){
            return res.status(400).json({success:false,message:"Invalid code"})
        }

        user.isVerfied = true
        user.verificationToken = undefined
        user.verificationTokenExpiresAt = undefined
        await user.save()

        await sendWelcomeEmail(user.email,user.firstname+" "+user.lastname)

        res.status(200).json({

            success:true,
            message:"Email send successfully",
            user:{
                ...user._doc,
                mobile:undefined,
                password: undefined
            }
  
        })

    } catch (error) {
        console.log("error in verify email", error);
        res.send(500).json({success:false,message:"Server error"})
    }
}

export const login = async (req,res) => {
    const {email,password} = req.body

    try {
        
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({success:false,message:"Invalid credentials"})
        }

        const isPasswordValid = await bcryptjs.compare(password,user.password)
        if(!isPasswordValid){
            return res.status(400).json({success:false,message:"Invalid credentials"})
        }
        if(!user.isVerfied){
            return res.status(400).json({success:false,message:"User is not verified"})
        }

        await generateTokenAndSetCookies(res,user._id)

        user.lastLogin = new Date()
        await user.save()

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user:{
                ...user._doc,
                password:undefined,
                mobile:undefined, 
            }
        })

    } catch (error) {
        console.log("Error in login function")
        return res.status(400).json({success:false,message: error.message})
    }
}

export const logout = async (req,res) => {
    res.clearCookie("token")
    res.status(200).json({success: true, message:"Logged out successfully"})
}

export const forgotPassword = async(req,res) => {
    const {email} = req.body
    try{
        const user = await User.findOne({email})

        if(!user){
            res.status(400).json({success:false, message:'User not found'})
        }

        // generate reset token

        const resetToken = crypto.randomBytes(20).toString("hex")
        const resetTokenExpiresAt = Date.now() + 1*60*60*1000 

        user.resetPasswordToken = resetToken
        user.resetPasswordExpiresAt = resetTokenExpiresAt

        await user.save()

        await sendPasswordResetEmail(user.email,`${process.env.CLENT_URL}/reset-password/${resetToken}`)
        res.status(200).json({success: true, message:"password link sent to your email"})
    }
    catch(error){
        console.log("Error in forgot password",error)
        res.status(400).json({success:false, message:error.message})
    }
}

export const resetPassword = async(req,res) =>{
    try {
        const {token} = req.params
        const {password} = req.body

        const user = await User.findOne({
            resetPasswordToken : token,
            resetPasswordExpiresAt: {$gt: Date.now()}
        })

        if(!user){
            return res.status(400).json({
                success:false,
                message: "Invalid or expired reset token"
            })
        }

        // update password
        const hashedPassword = await bcryptjs.hash(password,10)
        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpiresAt = undefined

        await user.save()

        await sendResetSuccessEmail(user.email)

        res.status(200).json({
            success:true,
            message:"Password reset successfully"
        })
    } catch (error) {
        console.log("Error in reset password",error);
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

export const resendCode =async(req,res)=>{
    const {email} = req.body
    try {
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({success:false,message:"User not found"})
        }
        if(user.isVerfied){
            return res.status(400).json({success:false,message:"User is already verified"})
        }

        const verificationToken2 = Math.floor(100000 + Math.random()*900000).toString()

        user.verificationToken = verificationToken2
        user.verificationTokenExpiresAt= Date.now() + 24 * 60 * 60 * 1000

        await user.save()

        await sendVerificationEmail(user.email,verificationToken2)

        res.status(200).json({

            success:true,
            message:"Code resend successfully",
            user:{
                ...user._doc,
                mobile:undefined,
                password: undefined
            }
  
        })

    } catch (error) {
        console.log("Error in resend code",error);
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

export const checkAuth = async(req,res) =>{
    try {
        const user = await User.findById(req.userId)
        if(!user){
            return res.status(400).json({success:false, message:"User not found"})
        }
        res.status(200).json({success:true,user:{
            ...user._doc,
            password:undefined
        }})
    } catch (error) {
        console.log("Error in checkAuth",error);
        res.status(400).json({success:false,message:error.message})
        
    }
}

export const generateAccessToken = async (req,res) => {
    try {
        const decode = res.locals.decode
        const requirement = decode.requirements

        const expirationMinutes = 5
        const expirationTimeStamp = Math.floor(Date.now()/1000)+(expirationMinutes*60)
        const payload = {
            fields:requirement
        }

        const jwtToken = jwt.sign(payload,process.env.IDP_SERVER_JWT_SECRET,{expiresIn:expirationTimeStamp})
        return res.status(200).send({
            token : jwtToken
        })
    } catch (error) {
        console.log("Error in generateAccessToken",error);
        res.status(400).json({success:false,message:error.message})
    }
}

export const grantProfile = async (req,res) => {
    const token = req.body.token
    const email = req.body.email

    
    try {
        const payload = jwt.verify(token,process.env.IDP_SERVER_JWT_SECRET)
        if(!payload){
            return res.status(400).json({success:false,message:"Invalid token"})
        }

        const requirements = payload.fields

        const details = await User.findOne({email:email})
        if(!details){
            return res.status(400).json({success:false, message:"User not found"})
        }

        const grantedDetails = {}
        for(let key of requirements){
            grantedDetails[key] = details[key] 
        }

        console.log(grantedDetails)
        return res.status(200).json({
            success:true,
            data:grantedDetails
        })
    } catch (error) {
        console.log("Error in grantProfile",error);
        res.status(400).json({success:false,message:error.message})
    }
}

export const userLogin = async (req,res) => {
    const email = req.body.Email
    const password = req.body.Password

    try {
        const user = await User.findOne({email:email})

        if(!user){
            return res.status(400).json({success:false , message:"User not found"})
        }

        const isPasswordValid = await bcryptjs.compare(password,user.password)
        if(!isPasswordValid){
            return res.status(400).json({success:false,message:"Invalid credentials"})
        }
        if(!user.isVerfied){
            return res.status(400).json({success:false,message:"User is not verified"})
        }

        const userId = user._id
        const jwtToken = jwt.sign({userId},process.env.JWT_SECRET,{
            expiresIn:"1d",
        })

        return res.status(200).send({
            success:true,
            message : "Login Successfully...",
            token : jwtToken,
        })


    } catch (error) {
        console.log("Error in userLogin",error);
        res.status(400).json({success:false,message:error.message})
    }
}