import bcryptjs from "bcryptjs"
import crypto from 'crypto'
import CryptoJS from 'crypto-js'
import jwt from "jsonwebtoken"
import axios from "axios"

import Client from "../models/client.model.js"
import { generateClientId, generateClientSecret } from "../utils/generateClietIdAndSecret.js"
import { generateTokenAndSetCookiesClient } from "../utils/generateTokenAndSetCookiesClient.js"
import { sendPasswordResetEmail, sendResetSuccessEmail } from "../../backend/mailtrap/emails.js"


export const Register = async(req,res)=>{
    const {clientName, email, password} = req.body

    if(!clientName || !email || !password){
        return res.status(400).json({success:false, message:"Invalid credentials"})
    }
    
    try {

        const clientExists = await Client.findOne({email})

        if(clientExists){
            return res.status(400).json({success:false, message:"Client already exist"})
        }

        const clientId = await generateClientId()
        const clientSecret = await generateClientSecret()

    

        const hashedPassword = await bcryptjs.hash(password,12)

        const client = new Client({
            clientName,
            email,
            password:hashedPassword,
            clientId:clientId,
            clientSecret:clientSecret
        })

        await client.save()

        res.status(201).json({

            success:true,
            message:"Client created successfully",
            client:{
                ...client._doc,
                password: undefined,
                clientId: undefined,
                clientSecret : undefined
            }
  
        })

        
    } catch (error) {
        console.log("error in client register", error);
        res.send(500).json({success:false,message:"Server error"})
    }

    

}

export const Login = async (req,res) => {
    
    const {email, password} = req.body
    
    if(!email || !password){
        return res.status(400).json({success:false, message:"Incomplete credentials"})
    }
    
    try {

        const client = await Client.findOne({email})

        if(!client){
            res.status(400).json({success:false, message:"Client does not exists"})
        }

        const isPassword = await bcryptjs.compare(password, client.password)
        if(!isPassword){
            return res.status(400).json({success:false,message:"Invalid credentials"})
        }

        await generateTokenAndSetCookiesClient(res,client._id)

        client.lastLogin = new Date()
        await client.save() 

        res.status(200).json({

            success:true,
            message:"logged in successfully",
            client:{
                ...client._doc,
                password: undefined,
                clientId: undefined,
                clientSecret : undefined
            }
  
        })
        
    } catch (error) {

        console.log("error in client login", error);
        res.send(500).json({success:false,message:"Server error"})
        
    }

    
}

export const Logout = async(req,res)=>{
    res.clearCookie("clienttoken")
    res.status(200).json({success: true, message:"Logged out successfully"})
}

export const forgotPassword = async(req,res) => {
    const {email} = req.body
    try{
        const client = await Client.findOne({email})

        if(!client){
            res.status(400).json({success:false, message:'client not found'})
        }

        // generate reset token

        const resetToken = crypto.randomBytes(20).toString("hex")
        const resetTokenExpiresAt = Date.now() + 1*60*60*1000 

        client.resetPasswordToken = resetToken
        client.resetPasswordExpiresAt = resetTokenExpiresAt

        await client.save()

        await sendPasswordResetEmail(client.email,`${process.env.CLENT_URL}/client/reset-password/${resetToken}`)
        res.status(200).json({success: true, message:"password link sent to your email"})
    }
    catch(error){
        console.log("Error in forgot password",error)
        res.status(400).json({success:false, message:error.message})
    }
}

export const ResetPassword = async (req,res) => {
    const {password} = req.body
    const {token} = req.params
    if(!password || !token){
        return res.status(400).json({success:false,message:"Can't get token or password"})
    }

    try {

        const client = await Client.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt : {$gt: Date.now()}
        })

        if(!client){
            return res.status(400).json({success:false, message:"Invalid or expired reset token"})
        }

        const hashedPassword = await bcryptjs.hash(password,12)

        client.password = hashedPassword
        client.resetPasswordToken = undefined
        client.resetPasswordExpiresAt = undefined

        await client.save()

        await sendResetSuccessEmail(client.email)

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

export const CheckAuth = async(req,res) =>{
    try {
        const client = await Client.findById(req.clientId)
        if(!client){
            return res.status(400).json({success:false, message:"User not found"})
        }
        res.status(200).json({success:true,client:{
            clientId:client._id,
            clientName: client.clientName,

        }})
    } catch (error) {
        console.log("Error in checkAuth",error);
        res.status(400).json({success:false,message:error.message})
        
    }
}

export const showDetails = async (req,res) => {
    try {
        const client = await Client.findById(req.clientId)
        if(!client){
            return res.status(400).json({success:false, message:"User not found"})
        }
        res.status(200).json({success:true,client:{
            clientId:client._id,
            clientName: client.clientName,
            clientSecret:client.clientSecret,
            clientEmail:client.email,
            accessRequired:client.access,
            redirectedUrl:client.RedirectURIs

        }})
    } catch (error) {
        console.log("Error in showdetails",error);
        res.status(400).json({success:false,message:error.message})
        
    }
}

export const Addaccess = async(req,res)=>{
    const {access} = req.body
    console.log(access)

    try {
        const client = await Client.findById(req.clientId)
        if(!client){
            return res.status(400).json({success:false, message:"User not found"})
        }

        client.access = access
        await client.save()
        res.status(200).json({success:true, message:"Access required updated"})
    } catch (error) {
        console.log("Error in Addaccess",error);
        res.status(400).json({success:false,message:error.message})
        
    }
}

export const RedirectURIs = async (req,res) => {
    const {redirectedUrl} = req.body
    console.log(redirectedUrl)
    if(!redirectedUrl){
        return res.status(400).json({success:false,message:"Can't add access value"})
    }

    try {
        const client = await Client.findById(req.clientId)
        if(!client){
            return res.status(400).json({success:false, message:"User not found"})
        }

        client.RedirectURIs = redirectedUrl
        await client.save()
        res.status(200).json({success:true,message:"Redirected URL added"})

    } catch (error) {
        console.log("Error in Redirected URI",error);
        res.status(400).json({success:false,message:error.message})
        
    }
}

export const checkClient = async (req,res) => {
    const ClientID = req.query.ClientID
    const RedirectURI = req.query.RedirectURI

    try {
        const client = await Client.findOne({clientId:ClientID})
        if(!client){
           return res.status(400).json({success:false, message:'User not exist'})
        }
        if(!client.RedirectURIs.includes(RedirectURI)){
            return res.status(400).json({success:false, message:'Wrong redirectUri'})
        }

        const ClientName = client.clientName
        const accessArr = client.access
        let access = ""
        accessArr.forEach(ele=>{
            access+=ele
        })

        res.render('login',{ClientID,RedirectURI,ClientName,access})
    } catch (error) {
        console.log("Error in check client",error);
        res.status(400).json({success:false,message:error.message})
    }
}

export const AuthorizationCodeGrant = async (req,res) => {
    const ClientID = req.body.ClientID
    const RedirectURI = req.body.RedirectURI

    const credential = {
        "email":req.body.email,
        "password":req.body.password
    }

    try {
        const data={
            ClientID,
            credential
        }

        const str = JSON.stringify(data)
        const encrypted = CryptoJS.AES.encrypt(str,process.env.ENCRYPTION_KEY).toString()
        
        const code = jwt.sign({ encrypted }, process.env.JWT_SECRET, { algorithm: "HS256", expiresIn: 5 * 60 })
        const RedirectURl = `${RedirectURI}?code=${code}`
        res.redirect(RedirectURl)
    } catch (error) {
        console.log("Error in AuthorizationCodeGrant",error);
        res.status(400).json({success:false,message:error.message})
    }
}

export const AccessToken = async (req,res) => {
    const code = req.body.code
    try {
        const isValid = jwt.verify(code,process.env.JWT_SECRET)
        if(isValid){
            const encrypted = isValid.encrypted
            const decrypted = CryptoJS.AES.decrypt(encrypted,process.env.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)
            const decryptedObject = JSON.parse(decrypted)
            const email = decryptedObject.credential.email
            const ClientID = decryptedObject.ClientID

            const client = await Client.findOne({clientId:ClientID})
            
            const requirements = client.access

            const body = {
                'Email': email,
                'token': process.env.IDP_SERVER_AUTH,
                requirements
            }
            const serverUrl = `${process.env.RESOURCE_SERVER}/api/auth/accessToken`

            try {
                const response = await axios.post(serverUrl,body)
                const token = response.data.token
                res.status(200).json({token,email})
            } catch (error) {
                console.log("Error sending token and email from IDP AccessToken",error)
                res.status(400).json({success:false,message:error.message})
            }
            
        }else{
            res.status(400).json({success:true,message:'Code is not valid'})
        }
    } catch (error) {
        console.log("Error in AccessToken",error);
        res.status(400).json({success:false,message:error.message})
    }
}