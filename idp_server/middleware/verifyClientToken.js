import jwt from "jsonwebtoken"

export const verifyClientToken = (req,res,next) => {
    const clientToken = req.cookies.clienttoken
    if(!clientToken){
        res.status(401).json({success:false, message:"Unauthorized - no token provided"})
    }

     try {
            const decoded = jwt.verify(clientToken, process.env.JWT_SECRET_CLIENT)
    
            if(!decoded) res.status(401).json({success:false, message:"Unauthorized - invalid token"})
    
            req.clientId = decoded.clientId
            next()
        } catch (error) {
            console.log("Error in verify token", error);
            return res.status(500).json({success: false, message:"Server error"})
            
        }
}
 
export default verifyClientToken;