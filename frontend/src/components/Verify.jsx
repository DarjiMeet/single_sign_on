import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast"

const Verify = () => {
    const navigate = useNavigate()

    const location = useLocation()
    const {email} = location.state || {}

    console.log({email:email})
    const [code,SetCode]=useState(Array(6).fill(""))

    const handleResend = async(e) =>{
        e.preventDefault()

        try {
            const verifyCode = await axios.post("http://localhost:5000/api/auth/resend-code",{email:email})

            if(verifyCode.data.success === true){
                toast.success("Resend code successfully")
            }
        } catch (error) {
            console.error(error)
            toast.error(error.response.data.message)
        }
    }

    const handleInput=(e,index)=>{
        const input = e.target

        const newCode = [...code]
        newCode[index] = input.value
        SetCode(newCode)
       
        if(input.value.length>=1 && input.nextElementSibling){
            input.nextElementSibling.focus()
        }
        
    }
    
    const CombineCode =async()=>{
        const combineCode = code.join("")
        
        if(combineCode.length===6){
            try {
                const response = await axios.post("http://localhost:5000/api/auth/verify-email",{combineCode:combineCode.toString()})
                
                if(response.data.success === true){
                    toast.success("Successfully Verified! ")
                
                        navigate("/");
                }
            } catch (error) {
                console.error(error)
                toast.error(error.response.data.message)
            }
        }else{
            toast.error("Enter the full code")
        }
    }

    
    return ( 
        <>
        
            <div className="flex h-[100vh] items-center justify-center flex-col">
                <div className="flex flex-row items-center">
                    <img src="/Images/Authi.png" className="w-[100px]" alt="Autify"/>
                    <div className="text-5xl font-semibold text-violet-900">AUTHIFY</div>
                </div>
                
                <div className=" border-violet-800 border-2 rounded-2xl">
                    
                    <div className="bg-violet-800  flex flex-col items-center justify-center p-5 rounded-xl">
                        
                        <h1 className="text-white font-bold text-2xl">Enter Verification Code</h1>
                        
                        <div className="flex flex-row mt-5">
                        
                            {code.map((_, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    onInput={(e) => handleInput(e, index)} // Update specific index in state
                                    required
                                    style={{
                                    width: "50px",
                                    height: "50px",
                                    textAlign: "center",
                                    fontSize: "20px",
                                    margin: "10px"
                                    }}
                                />
                            ))}
                        
                        </div>
                        
                        <div className="pt-4 flex items-center justify-center text-white">Doesn't get a verification code?
                            <span className="ml-1 hover:text-white cursor-pointer text-violet-300" 
                            onClick={handleResend}>resend</span>
                        </div>

                        <button
                            className="w-full bg-green-500 text-white p-2 rounded-xl hover:bg-green-700 mt-2 m-2"
                            onClick={CombineCode}
                        >
                            Continue
                        </button>
                        

                        
      
                    </div>
                </div>
            </div>
        </>
     );
}
 
export default Verify;