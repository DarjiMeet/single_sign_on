import express from "express";
import { login, logout, signup, verifyEmail, forgotPassword, resetPassword, checkAuth, resendCode, userLogin, generateAccessToken, grantProfile, showDetails } from "../controller/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import serverValidator from "../middleware/serverValidator.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth)

router.post("/signup",signup)

router.post("/login",login)

router.post("/logout",logout)

router.post("/verify-email", verifyEmail)

router.post("/resend-code",resendCode)

router.post("/forgot-password", forgotPassword)

router.post("/reset-password/:token", resetPassword)

router.post("/userlogin",userLogin)

router.post("/accessToken",serverValidator,generateAccessToken)

router.post("/grantProfile",grantProfile)

router.get("/showdetails",verifyToken,showDetails)

export default router