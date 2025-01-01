import mongoose from "mongoose"


export const connectDB = async (params) => {
    try {

        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Monogodb connected ${conn.connection.host}`);
        
    } catch (error) {
        
        console.log("Error connection: ",error.message);
        process.exit(1)
        
    }
}