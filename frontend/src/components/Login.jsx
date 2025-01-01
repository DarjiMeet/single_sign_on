import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const navigate = useNavigate()

    const[show,setShow] = useState(false)
 

    const [values,setValues] = useState({
        email:"",
        password:""
    })

    const handleInput = (e)=>{
        const {name,value} = e.target
        setValues((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    const openForgetPassword = ()=>{
        setShow(true)
    }

    const closeForgetpassword = ()=>{
        setShow(false)
    }

    const handleForgetPassword = async(e)=>{
        e.preventDefault()
        try {
            const forgetpassword = await axios.post("http://localhost:5000/api/auth/forgot-password",{email:values.email})
            console.log(forgetpassword)

            if(forgetpassword.data.success === true){
                toast.success(forgetpassword.data.message)
                setShow(false)
            }
           
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

    const formSubmit = async(e)=>{
        e.preventDefault()
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login",values,{
                withCredentials:true
            })
            
            if(response.data.success === true){
                toast.success(response.data.message)
                navigate("/home")
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    return ( 
        <form onSubmit={formSubmit} method="POST">
        {!show && (
            <>
                <div className="relative mb-6">
                    <input
                        name="email"
                        type="email"
                        className="peer w-full p-2 pt-6 text-md border-b-2 border-gray-300 focus:outline-none focus:border-black placeholder-transparent"
                        placeholder="Email"
                        value={values.email}
                        onChange={handleInput}
                        required
                    />
                    <label
                        htmlFor="email"
                        className="absolute left-0 top-0 text-gray-500 text-base transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-lg peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-700 peer-hover:top-2 peer-hover:text-sm peer-hover:text-gray-700"
                    >
                        Email
                    </label>
                </div>
                <div className="relative mb-6">
                    <input
                        name="password"
                        type="password"
                        className="peer w-full p-2 pt-6 text-md border-b-2 border-gray-300 focus:outline-none focus:border-black placeholder-transparent"
                        placeholder="Password"
                        value={values.password}
                        onChange={handleInput}
                        required
                    />
                    <label
                        htmlFor="password"
                        className="absolute left-0 top-0 text-gray-500 text-base transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-lg peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-700 peer-hover:top-2 peer-hover:text-sm peer-hover:text-gray-700"
                    >
                        Password
                    </label>
                </div>

                <div className="cursor-pointer hover:text-gray-600" onClick={openForgetPassword}>forget password?</div>
                
                <button
                    type="submit"
                    className="w-full bg-violet-800 text-white p-2 rounded-xl hover:bg-violet-600 mt-2"

                >
                    Continue
                </button>
            </>
        )}

        {show && (
            <>
                <div className="relative mb-6">
                        <input
                            name="email"
                            type="email"
                            className="peer w-full p-2 pt-6 text-md border-b-2 border-gray-300 focus:outline-none focus:border-black placeholder-transparent"
                            placeholder="Email"
                            value={values.email}
                            onChange={handleInput}
                            required
                        />
                        <label
                            htmlFor="email"
                            className="absolute left-0 top-0 text-gray-500 text-base transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-lg peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-700 peer-hover:top-2 peer-hover:text-sm peer-hover:text-gray-700"
                        >
                            Email
                        </label>
                </div>
                <div className="flex flex-row">
                    <div className="bg-violet-800 text-white rounded-xl p-2 m-2 w-full text-center hover:bg-violet-600 cursor-pointer" onClick={handleForgetPassword}>Reset Password</div>
                    <div className="bg-red-800 text-white rounded-xl p-2 m-2 w-full text-center hover:bg-red-600 
                    cursor-pointer" onClick={closeForgetpassword}>Cancel</div>
                </div>
            </>
        )}
        

    </form>
     );
}
 
export default Login;