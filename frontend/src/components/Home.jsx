import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useEffect,useState } from "react";

const Home = () => {

    const navigate = useNavigate()
   
    const [showCredentials, setShowCredentials] = useState(true) 



    const [userDetails,setUserDetails] = useState({
        firstName: "",
        lastName:"",
        email:"",
        mobile:""
    })

    useEffect(()=>{
        const fetchdetails = async()=>{
            try {

                const userdetails = await axios.get("http://localhost:5000/api/auth/showdetails",{
                    withCredentials:true
                })

                setUserDetails({
                    firstName: userdetails.data.user.firstName,
                    lastName:userdetails.data.user.lastName,
                    email:userdetails.data.user.email,
                    mobile:userdetails.data.user.mobile
                })
                
            } catch (error) {
                console.error(error)
                toast.error("Can't fetch user details")
            }
        } 
        fetchdetails()
    },[])
    

    const handleLogout = async()=>{
        try {
            const response = await axios.post("http://localhost:5000/api/auth/logout",{},{
                withCredentials:true
            })
        
            if(response.data.success === true){
                toast.success(response.data.message)
                setUserDetails({
                    userId:"",
                    firstName: "",
                    lastName:"",
                    email:"",
                    mobile:""
                })
                navigate("/")
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to logged out")
        }
    }

    const toggleCredential = ()=>{
        if(showCredentials === true){
            setShowCredentials(false)
        }
        else{
            setShowCredentials(true)
        }
    }

    return ( 
    <>
            <div className="bg-white shadow-md">
                <div className="flex flex-row items-center justify-center p-4">
                    <img src="/Images/Authi.png" className="w-[50px]" alt="Autify"/>
                    <div className="text-2xl font-semibold text-violet-900">AUTHIFY</div>
                </div>
            </div>

            <div className="p-5 flex flex-row justify-center ">
                
                <div className="grow-0 w-[20vw] flex items-start pl-3 flex-col p-3">
                    <div className="flex flex-row">
                        <div className="w-[80px]"><img src="/Images/Logo.jpg" alt="logo" /></div>
                        
                        <div className="flex flex-col items-start justify-center">
                            <div className="text-lg">{userDetails.firstName + ' ' +userDetails.lastName}</div>
                            <div className="text-sm text-gray-500">{userDetails.email}</div>
                        </div>
                    
                    </div>

                    <div className={`text-md ml-3 mt-9 ${showCredentials?'bg-violet-500 hover:bg-violet-700':'bg-violet-900 hover:bg-violet-800'} text-white rounded-lg py-2 w-[15vw] text-center cursor-pointer `} onClick={toggleCredential}>{showCredentials?"User credentials":"Show credentials"}</div>
                    
                    <div className="text-md ml-3 mt-9 hover:bg-violet-500 hover:text-white rounded-lg py-2 w-[15vw] text-center cursor-pointer bg-violet-300" onClick={handleLogout}>Logout</div>
                </div>  
                
                <div className="w-[60vw] border-2 flex flex-col grow h-[80vh]">
                    <div className="px-6 py-4 text-2xl font-semibold">Personal Information</div>
                    {showCredentials && <div className="flex flex-col">
                          
                                <div className="flex flex-row mt-5">
                                    <div className="py-2 px-6 w-[200px] text-gray-500">Email ID</div>
                                    <input type="text" name="email" value={userDetails.email} className="border-2 py-2 px-4 rounded-lg w-[360px]" disabled/>
                                </div>
                                <div className="flex flex-row mt-5">
                                    <div className="py-2 px-6 w-[200px] text-gray-500">First Name</div>
                                    <input type="text" name="firstName" value={userDetails.firstName} className="border-2 py-2 px-4 rounded-lg w-[360px]" disabled/>
                                </div>
                                <div className="flex flex-row mt-5">
                                    <div className="py-2 px-6 w-[200px] text-gray-500">Last Name</div>
                                    <input type="text" name="lastName" value={userDetails.lastName} className="border-2 py-2 px-4 rounded-lg w-[360px]" disabled/>
                                </div>
                                <div className="flex flex-row mt-5">
                                    <div className="py-2 px-6 w-[200px] text-gray-500">Mobile</div>
                                    <input type="text" name="mobile" value={userDetails.mobile} className="border-2 py-2 px-4 rounded-lg w-[360px]" disabled/>
                                </div>

                                <button className="m-5 py-2 bg-violet-900 text-white hover:bg-violet-500 w-[100px] rounded-xl">Edit</button>
                     
                    </div>}


                </div>
            
            </div>
    </>
     );
}
 
export default Home;