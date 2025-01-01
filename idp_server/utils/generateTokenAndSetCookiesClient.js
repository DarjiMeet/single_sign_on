import jwt from "jsonwebtoken"

export const generateTokenAndSetCookiesClient = async(res,clientId) =>{

    try {

        const token = jwt.sign({clientId},process.env.JWT_SECRET_CLIENT,{
            expiresIn:"7d", 
        })
    
        res.cookie("clienttoken",token,{
            httpOnly : true,
            secure:process.env.NODE_ENV === "production",
            sameSite : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
    
        return token  
        
    } catch (error) {
        console.log("error generate ans set cookies: ",error.message)
    }
    
}