import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"

const ResetPass = () => {

    const {token} = useParams()

    const navigate = useNavigate()

    const [values,setValues] = useState({
        password:"",
        confirmpassword:""
    })

    const handleInput = (e)=>{
        const {name,value} = e.target
        setValues((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    const resendPassword = async(e)=>{
        e.preventDefault()

        if(values.password !== values.confirmpassword){
            return toast.error("Password doesn't match with confirm password")
        }

        try {
            const newPass = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, {password:values.password})
           
            if(newPass.data.success === true){
                toast.success(newPass.data.message)
                navigate("/")
            }
        } catch (error) {
            console.error(error)
            toast.error(error.response.data.message)
        }
    }

    return ( 
        <div className="flex items-center flex-col justify-center h-[100vh]">
            
            <div className="flex flex-row items-center">
                <img src="/Images/Authi.png" className="w-[100px]" alt="Autify"/>
                <div className="text-5xl font-semibold text-violet-900">AUTHIFY</div>
            </div>
            
            <div className="flex flex-col bg-violet-800 w-[500px] border-2 border-black p-8 rounded-2xl">
                <h1 className="text-3xl text-white font-semibold text-center">Enter your new password</h1>
                <div className="relative mb-6 pt-3">
                    <input
                        name="password"
                        type="password"
                        className="peer w-full p-2 pt-6 text-md border-b-2 border-gray-300 focus:outline-none focus:border-black placeholder-transparent rounded-lg bg-violet-800 text-white"
                        placeholder="Password"
                        value={values.email}
                        onChange={handleInput}
                        required
                    />
                    <label
                        htmlFor="password"
                        className="absolute left-0 top-0 text-gray-300 text-base transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-lg peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-400 peer-hover:top-2 peer-hover:text-sm peer-hover:text-gray-400"
                    >
                        Password
                    </label>
                </div>
                <div className="relative mb-6">
                    <input
                        name="confirmpassword"
                        type="password"
                        className="peer w-full p-2 pt-6 text-md border-b-2 border-gray-300 focus:outline-none focus:border-black placeholder-transparent rounded-lg bg-violet-800 text-white"
                        placeholder="Confirm Password"
                        value={values.confirmpassword}
                        onChange={handleInput}
                        required
                    />
                    <label
                        htmlFor="confirmpassword"
                        className="absolute left-0 top-0 text-gray-300 text-base transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-lg peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-400 peer-hover:top-2 peer-hover:text-sm peer-hover:text-gray-400"
                    >
                        Confirm Password
                    </label>
                </div>
                <button onClick={resendPassword} className="w-full bg-green-600 py-2 text-white rounded-xl hover:bg-green-500">Continue</button>
            </div>
        </div>
     );
}
 
export default ResetPass;