import express from "express"
import axios from "axios"
import jwt from "jsonwebtoken"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.set('view engine','ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())

app.get('/', async(req, res) => {

    const token = req.cookies.JWTtoken
    console.log(token)
    if (token)
    {
        try {
            const obj = await jwt.verify(token, 'IDPTESTER');
            const email = obj.email
            const username = obj.username
            res.render('home',{email,username})
            
        }
        catch (err) {
            res.render('signup')
        }
    }
    else {
        res.render('signup')
    }

})

app.get("/callback",async(req,res)=>{
    const serverUrl = "http://localhost:5001/api/client/token"
    const code = req.query.code
    const body={
        "ClientID":"aXAOuV4vE",
        "ClientSecret":"52e467c6-59a9-4c4c-a764-afac3a1d62a6",
        "code":code,
        "RedirectURI": "http://localhost:3000/callback"
    }

    try {
        const response = await axios.post(serverUrl,body)
        
        const bodies = response.data
        
        const url = 'http://localhost:5000/api/auth/grantProfile'

        try {
            const details = await axios.post(url,bodies)

            const result = details.data

            if(result){
                const email = result.data.email
                const firstName = result.data.firstname
                const lastName = result.data.lastname
                const mobile = result.data.mobile

                const username = firstName+' '+lastName
                const obj = {
                    username,
                    email
                }

                console.log('username',username)
                console.log('email',email)
                const token = await jwt.sign(obj,'IDPTESTER',{expiresIn:'1d'})
                res.cookie('JWTtoken',token)
                res.redirect('/')

            }
            else {
                res.send("Some Error Occured");
            }

        } catch (error) {
            console.error(error)
        }
    } catch (error) {
        console.error(error)
        
    }
})

app.get("/login",(req,res)=>{
    res.redirect("http://localhost:5001/api/client/Authorizationcode?ClientID=aXAOuV4vE&&RedirectURI=http://localhost:3000/callback")
})

app.post("/register",async (req,res) => {
    const { username, email, mobile, password } = req.body

    if(!username || !email || !password || !mobile){
        return res.status(400).json({success:false, message:"All fields are required"})
    }
    
    res.render('home',{email,username})

})

app.post("/logout",(req,res)=>{
    res.clearCookie('JWTtoken'); // Assuming you are storing the token in a cookie
    return res.redirect('/'); 
})
app.listen(3000,()=>{
    console.log("client server is running on 3000"); 
})