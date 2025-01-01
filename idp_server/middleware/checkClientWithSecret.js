import Client from "../models/client.model.js"


const checkClientWithSecret = async (req,res) => {
    const ClientID = req.body.ClientID
    const ClientSecret = req.body.ClientSecret  
    const RedirectURI = req.body.RedirectURI

    try {
        const client = await Client.findOne({clientId:ClientID})
        if(!client){
            return res.status(400).json({success:false, message:'User not exist'})
        }
        if (client.RedirectURIs.includes(RedirectURI)&&client.clientSecret===ClientSecret)
            {
                next()
            }
        else {
                console.log("Invalie Request");
                res.status(400).json({success:false,message:"Invalid Request"})
            }
    } catch (error) {
        console.log("Error in checkClientWithSecret",error);
        res.status(400).json({success:false,message:error.message})
    }
}

export default checkClientWithSecret