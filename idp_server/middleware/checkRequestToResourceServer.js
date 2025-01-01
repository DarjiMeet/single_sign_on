import axios from "axios"

const checkRequestToResourceServer = async (req,res,next) => {
    const email = req.body.email
    const password = req.body.password

    const serverUrl = `${process.env.RESOURCE_SERVER}/api/auth/userlogin`
    const data = {
        Email:email,
        Password:password
    }
    try {
        
        const response = await axios.post(serverUrl,data)
       
        const result = response.data
        if(!result.token){
           return res.status(400).json({success:false,message:"Wrong Credentials"})
        }

        next()
        

    } catch (error) {
        console.log("error in checkRequestToResourceServer", error);
        res.send(500).json({success:false,message:"Server error"})
    }

}

export default checkRequestToResourceServer