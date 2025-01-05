import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

import { connectDB } from "./db/connectDB.js"

import authRoutes from "./routes/auth.route.js"

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5001',
    'http://localhost:3000',
    'https://your-production-domain.com' // Add other allowed origins here
];

app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            // Allow requests with valid origin or no origin (like for mobile apps)
            callback(null, origin);
        } else {
            // Block requests with unauthorized origins
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Required for cookies or credentials
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRoutes)


app.listen(port,()=>{
    connectDB()
    console.log("server is running on: ",port);
    
})



