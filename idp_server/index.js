import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

import { connectDB } from "./db/connectDB.js"

import clientRoutes from "./routes/client.route.js"

dotenv.config()

const app = express()
const port =  5001

app.use(cors({
    origin:'http://localhost:5173',
    methods:'GET,POST,PUT,DELETE',
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())


app.use("/api/client",clientRoutes)

app.listen(port,()=>{
    connectDB()
    console.log("server is running on: ",port);
    
})
