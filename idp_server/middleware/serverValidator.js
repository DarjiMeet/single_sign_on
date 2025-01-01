const serverValidator = async (req,res,next) => {
    const token = req.body.token

    if(token === process.env.IDP_SERVER_AUTH){
        res.locals.decode = req.body
    }else{
        return res.status(401).json({success:false,message:"Unauthoried access"})
    }
    next()
}
 
export default serverValidator;