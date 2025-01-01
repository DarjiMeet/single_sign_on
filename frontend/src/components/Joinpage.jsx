import { useState } from "react";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const Joinpage = () => {
    const navigate = useNavigate()
    const [showLogin,setShowLogin] = useState(false)
    const [showRegistration,setShowRegistration] = useState(false)
    const [showEmail,setShowEmail] = useState(false)
    const [mail, setMail] = useState({
        email:""
    })

    const OpenLogin =()=>{
        setShowRegistration(false)
        setShowLogin(true)
    }
    const CloseLogin =()=>{
        setShowLogin(false)
    }
    const OpenRegistration =()=>{
        setShowLogin(false)
        setShowRegistration(true)
    }
    const CloseRegistration =()=>{
        setShowRegistration(false)
    }
    const OpenEmail=()=>{
        setShowRegistration(false)
        setShowEmail(true)
    }
    const CloseEmail=()=>{
        setShowRegistration(true)
        setShowEmail(false)
    }
    const handleMail = (e)=>{
        const {name,value} = e.target
        setMail((prev)=>({
            ...prev,
            [name]:value
        }))
    }
    const handleNavigate=async(e)=>{ 
        e.preventDefault()

        if(mail.email === ""){
            return toast.error("Enter your registered email")
        }

        try {
            const verifyCode = await axios.post("http://localhost:5000/api/auth/resend-code",{email:mail.email})

            if(verifyCode.data.success === true){
                toast.success("Code send successfully")
            }
        } catch (error) {
            console.error(error)
            return toast.error(error.response.data.message)
        }
        navigate("/verify",{state:{email:mail.email}})
    }

    const handleDeveloper = ()=>{
        navigate("/Client")
    }
 

    return ( 
    <div className={`relative m-8 flex flex-col items-center justify-center ${showLogin ||showRegistration ? "pointer-events-none" : ""}`}>

        {/* Login */}
        {showLogin && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40 min-h-screen"></div>
        )}
        
        {showLogin && (
            <div className="fixed flex inset-0 items-center justify-center pointer-events-auto z-50"> 
               
                <div className="bg-white p-6 rounded-lg  w-[500px] relative pb-5">
                    <div>
                        <h2 className="flex flex-col items-center justify-center text-2xl font-semibold">LogIn</h2>
                        <button
                            onClick={CloseLogin}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
                        >
                            x
                        </button>
                    </div>
                    
                        <Login />
                        <div className="pt-4 flex items-center justify-center">Doesn't have an account?
                            <span className="ml-1 text-violet-800 hover:text-violet-950 cursor-pointer" 
                            onClick={OpenRegistration}>signup</span>
                        </div>
                    </div>
                    
   
               
            </div>
        )}

        {/* Registration */}
        {showRegistration && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40 min-h-screen"></div>
        )}

        {showRegistration && (
            <div className="fixed flex inset-0 items-center justify-center pointer-events-auto z-50"> 
               
                <div className="bg-white p-6 rounded-lg  w-[500px] relative pb-5">
                    <div>
                        <h2 className="flex flex-col items-center justify-center text-2xl font-semibold">Register</h2>
                        <button
                            onClick={CloseRegistration}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
                        >
                            x
                        </button>
                    </div>
                        <Register />
                        <div className="pt-4 flex items-center justify-center">Already have an account?
                            <span className="ml-1 text-violet-800 hover:text-violet-950 cursor-pointer" 
                            onClick={OpenLogin}>login</span>
                        </div>
                        <div className="pt-1 flex items-center justify-center">Verify your email!
                            <span className="ml-1 text-violet-800 hover:text-violet-950 cursor-pointer" 
                            onClick={OpenEmail}>verify</span>
                        </div>
                    </div>
               
            </div>
        )}
        
        {/* open email */}
        {showEmail && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40 min-h-screen"></div>
        )}

        {showEmail && (
            <div className="fixed flex inset-0 items-center justify-center pointer-events-auto z-50"> 
               
                <div className="bg-white p-6 rounded-lg  w-[500px] relative pb-5">
                    <div>
                        <h2 className="flex flex-col items-center justify-center text-2xl font-semibold">Registered Email</h2>
                        <button
                            onClick={CloseEmail}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
                        >
                            x
                        </button>
                    </div>
                    <div className="flex flex-col mt-4 m-2">
                                    
                        <label htmlFor="email" className="text-black">Enter your registered email: </label>
                                    
                        <input type="email" name="email" value={mail.email} onChange={handleMail} className="w-full p-2 rounded-xl border-2" required/>
                    </div>
                                    
                    <div className="flex flex-row">
                        <button
                            className="w-full bg-violet-500 text-white p-2 rounded-xl hover:bg-violet-700 mt-2 m-2"
                            onClick={handleNavigate}
                        >
                            Continue
                        </button>
                    </div>
                                    
                </div>
            </div>
        )}
        

        <div className="flex flex-row items-center">
            <img src="/Images/Authi.png" className="w-[100px]" alt="Autify"/>
            <div className="text-5xl font-semibold text-violet-900">AUTHIFY</div>
        </div>

        <div className="flex flex-row w-[80vw] mt-10 pt-10">

            <div className="flex flex-col items-center justify-around  ">

                <div>
                    <p className="font-semibold text-5xl">Authify: Empowering Your Digital Identity Safely.</p>
                    
                    <div className="mt-9">
                        <button 
                            className="mr-6 bg-red-900 text-white p-4 rounded-2xl hover:bg-red-700"
                            onClick={OpenRegistration}
                        >Register</button>
                        <button 
                            className="ml-2  bg-violet-900 text-white p-4 rounded-2xl hover:bg-violet-700" 
                            onClick={OpenLogin}
                        >LogIn</button>
                    </div>
                    <div className="mt-6 text-xl">Go to developer mode! <span className="text-gray-600 hover:text-gray-800 cursor-pointer" onClick={handleDeveloper}>Click Here</span></div>
                </div>
                
                
            </div>
          

            <img src="/Images/Joinimage2.jpg" className="w-[600px]"/>

        </div>

    </div>
        
     );
}
 
export default Joinpage;