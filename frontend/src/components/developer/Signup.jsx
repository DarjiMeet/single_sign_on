import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Signup = () => {

    const [formData,setFormData] = useState({
        clientName:"",
        email:"",
        password:"",
        confirmpassword:""
    })

    const handleInput = (e)=>{
        const {name,value} = e.target
        setFormData((prev)=>({
            ...prev,
            [name]:value
        }))
      
    }

    const handleSubmit = async(e) =>{
        e.preventDefault()

        if(formData.password!==formData.confirmpassword){
            return toast.error("passowrd does not match confirm password")
        }
        try {
            const response = await axios.post("http://localhost:5001/api/client/register",formData)
     
           
            if(response.data.success == true){
                toast.success("Successfully Registered!")
                setFormData({
                    clientName:"",
                    email:"",
                    password:"",
                    confirmpassword:""
                })  
            }
            
        } catch (error) {
            console.error('Error:', error.response.data);
            toast.error(error.response.data.message)
        }
   
    }

    return ( 
        <form onSubmit={handleSubmit}>
        <div className="relative mb-6">
            <input
                name="clientName"
                type="text"
                className="peer w-full p-2 pt-6 text-md border-b-2 border-gray-300 focus:outline-none focus:border-black placeholder-transparent"
                placeholder="Client Name"
                value={formData.clientName}
                onChange={handleInput}
                required
            />
            <label
                htmlFor="firstname"
                className="absolute left-0 top-0 text-gray-500 text-base transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-lg peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-700 peer-hover:top-2 peer-hover:text-sm peer-hover:text-gray-700"
            >
                Client Name
            </label>
        </div>
        
        <div className="relative mb-6">
            <input
                name="email"
                type="email"
                className="peer w-full p-2 pt-6 text-md border-b-2 border-gray-300 focus:outline-none focus:border-black placeholder-transparent"
                placeholder="Email"
                value={formData.email}
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
                value={formData.password}
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
        
        <div className="relative mb-6">
            <input
                name="confirmpassword"
                type="password"
                className="peer w-full p-2 pt-6 text-md border-b-2 border-gray-300 focus:outline-none focus:border-black placeholder-transparent"
                placeholder="Confirm Password"
                value={formData.confirmpassword}
                onChange={handleInput}
                required
            />
            <label
                htmlFor="confirmpassword"
                className="absolute left-0 top-0 text-gray-500 text-base transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-lg peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-700 peer-hover:top-2 peer-hover:text-sm peer-hover:text-gray-700"
            >
                Confirm Password
            </label>
        </div>
        
        <button
            type="submit"
            className="w-full bg-violet-800 text-white p-2 rounded-xl hover:bg-violet-600 mt-2"
        >
            Continue
        </button>

    </form>
     );
}
 
export default Signup;