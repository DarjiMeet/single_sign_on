const serverValidator = async (req,res,next) => {
    const token = req.body.token
    console.log("Received token:", token); 
    if(token === process.env.IDP_SERVER_AUTH){
        res.locals.decode = req.body
        next()
    }else{
        console.log("gandu token")
        return res.status(401).json({success:false,message:"Unauthoried access"})
    }
  
}
 
export default serverValidator;