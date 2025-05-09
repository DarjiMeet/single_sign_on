import { response } from "express"
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
import {mailtrapClient, sender} from "./mailtrap.config.js"

export const sendVerificationEmail = async (email,verificationToken) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
            category: "Email Verification"
        })

        console.log("Email send successfully");
        
    } catch (error) {
        console.log(`Error sending verification email ${error}`)
        throw new Error(`Error sending verification email ${error}`)
    }
}

export const sendWelcomeEmail = async(email,name) => {
    const recipient = [{email}]

    try {
        
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid:"79a57f8b-633b-41d1-9ef3-bc63e486a5c8",
            template_variables:{
                company_info_name: "Auth Company",
                name:name
            }
        })

        console.log("Welcome Email sent successfully",response)
    } catch (error) {
        console.log("Error sending welcome email")
        throw new Error(`Error sending welcome email ${error}`)   
    }
}

export const sendPasswordResetEmail =  async(email,reseturl)=>{
    const recipient = [{email}]
    
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject:"Reset Your Passowrd",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",reseturl),
            category:"Password Reset"
        })
    } catch (error) {
        console.log("Error sending reset password link")
        throw new Error(`Error sending reset password link: ${error}`)   
    }
}

export const sendResetSuccessEmail = async (email) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject:"Password Reset Successfull",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category:"Password Reset"
        })

        console.log("password reset success email sent successfully",response)
    } catch (error) {
        console.log("Error sending password reset success email")
        throw new Error(`Error sending password reset success email: ${error}`)   
    }
}