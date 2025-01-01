import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    clientName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    clientSecret:{
        type:String,
        required:true
    },
    clientId:{
        type:String,
        required:true
    },
    lastLogin:{
        type: Date,
        default:Date.now
    },
    protocol: {
        type: String,
    },
    RedirectURIs: {
        type: [String],
    },
    AuthorizationCode: {
        type: String,
    },
    access: {
        type: [String],
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt:Date,
},{timestamps:true}) 

const Client = mongoose.model('Client',clientSchema)

export default Client

