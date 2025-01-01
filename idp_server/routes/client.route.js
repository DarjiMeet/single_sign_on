import express from "express"
import { AccessToken, Addaccess, AuthorizationCodeGrant, CheckAuth, checkClient, forgotPassword, Login, Logout, RedirectURIs, Register, ResetPassword, showDetails } from "../controller/client.controller.js"
import verifyClientToken from "../middleware/verifyClientToken.js"
import checkRequestToResourceServer from "../middleware/checkRequestToResourceServer.js"
import checkClientWithSecret from "../middleware/checkClientWithSecret.js"

const router = express.Router()

router.post("/register",Register)

router.post("/login",Login)

router.post("/logout",Logout)

router.post("/forget-password",forgotPassword)

router.post("/reset-password/:token",ResetPassword)

router.get("/check-client",verifyClientToken,CheckAuth)

router.get("/showdetails",verifyClientToken,showDetails)

router.post("/Addaccess",verifyClientToken,Addaccess)

router.post("/redirectedURL",verifyClientToken,RedirectURIs)

router.get('/Authorizationcode', checkClient);

router.post('/credential',checkRequestToResourceServer,AuthorizationCodeGrant)

router.post('/token',checkClientWithSecret,AccessToken)

export default router