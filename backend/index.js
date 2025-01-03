import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

import { connectDB } from "./db/connectDB.js"

import authRoutes from "./routes/auth.route.js"

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors({
    origin:'http://localhost:5173',
    methods:'GET,POST,PUT,DELETE',
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRoutes)


app.listen(port,()=>{
    connectDB()
    console.log("server is running on: ",port);
    
})



