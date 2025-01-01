import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

const ClientHome = () => {

    const navigate = useNavigate()

    const [selectedOption, setSelectedOption] = useState('')
    const [redirectValue, setRedirectValue] = useState('')
   
    const [showCredentials, setShowCredentials] = useState(true) 
    const [showInput, setShowInput] = useState(false)
    const [showredirectInput, setShowredirectInput] = useState(false)


    const [ClientDetails,setClientDetails] = useState({
        clientId:"",
        clientName: "",
        clientSecret:"",
        clientEmail:"",
        access:[""],
        redirectedUrl:[""]
    })

    useEffect(()=>{
        const fetchdetails = async()=>{
            try {

                const clientdetails = await axios.get("http://localhost:5001/api/client/showdetails",{
                    withCredentials:true
                })

                setClientDetails({
                    clientId:clientdetails.data.client.clientId,
                    clientName: clientdetails.data.client.clientName,
                    clientSecret:clientdetails.data.client.clientSecret,
                    clientEmail:clientdetails.data.client.clientEmail, 
                    access:clientdetails.data.client.accessRequired,
                    redirectedUrl:clientdetails.data.client.redirectedUrl
                })
                
            } catch (error) {
                console.error(error)
                toast.error("Can't fetch client details")
            }
        } 
        fetchdetails()
    },[])
    

    const handleLogout = async()=>{
        try {
            const response = await axios.post("http://localhost:5001/api/client/logout",{},{
                withCredentials:true
            })
        
            if(response.data.success === true){
                toast.success(response.data.message)
                setClientDetails({
                    clientId:"",
                    clientName: "",
                    clientSecret:"",
                    clientEmail:"",
                })
                navigate("/Client")
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

    const Addaccess = ()=>{
        setShowInput(true)
    }
    const AddredirectURL= ()=>{
        setShowredirectInput(true)
    }

    const upadateAccessRequired = async (e) => {
        e.preventDefault()

        if(ClientDetails.access.includes(selectedOption)){
            setShowInput(false)
            return toast.error("Can't select this value again")
        }

        ClientDetails.access=[...ClientDetails.access,selectedOption]    
        console.log(ClientDetails.access)

        try {
            const response = await axios.post("http://localhost:5001/api/client/Addaccess",{access:ClientDetails.access},{
                withCredentials:true
            })
        } catch (error) {
            console.error(error)
            toast.error("Failed to update access required")
            
        }
        setShowInput(false)
    }

    const upadateRedirectURL = async (e) => {
        e.preventDefault()

        if(ClientDetails.redirectedUrl.includes(redirectValue)){
            setShowredirectInput(false)
            return toast.error("Can't add this value again")
        }

        ClientDetails.redirectedUrl=[...ClientDetails.redirectedUrl,redirectValue]    
        console.log(ClientDetails.redirectedUrl)

        try {
            const response = await axios.post("http://localhost:5001/api`/client/redirectedURL",{redirectedUrl:ClientDetails.redirectedUrl},{
                withCredentials:true
            })
        } catch (error) {
            console.error(error)
            toast.error("Failed to add url")
            
        }
        setShowredirectInput(false)
    }

    // incomplete
    const deleteAccessValue = async (e) => {
        e.preventDefault()

        if(!ClientDetails.access.includes(selectedOption)){
    
            return toast.error("Can't select this value")
        }

    }
    

    return ( 
        <>
            <div className="bg-white shadow-md">
                <div className="flex flex-row items-center justify-center p-4">
                    <img src="/Images/Authi.png" className="w-[50px]" alt="Autify"/>
                    <div className="text-2xl font-semibold text-violet-900">AUTHIFY FOR DEVELOPERS</div>
                </div>
            </div>

            <div className="p-5 flex flex-row justify-center ">
                
                <div className="grow-0 w-[20vw] flex items-start pl-3 flex-col p-3">
                    <div className="flex flex-row">
                        <div className="w-[80px]"><img src="/Images/Logo.jpg" alt="logo" /></div>
                        
                        <div className="flex flex-col items-start justify-center">
                            <div className="text-lg">{ClientDetails.clientName}</div>
                            <div className="text-sm text-gray-500">{ClientDetails.clientEmail}</div>
                        </div>
                    
                    </div>

                    <div className={`text-md ml-3 mt-9 ${showCredentials?'bg-violet-500 hover:bg-violet-700':'bg-violet-900 hover:bg-violet-800'} text-white rounded-lg py-2 w-[15vw] text-center cursor-pointer `} onClick={toggleCredential}>{showCredentials?"Client credentials":"Show credentials"}</div>
                    
                    <div className="text-md ml-3 mt-9 hover:bg-violet-500 hover:text-white rounded-lg py-2 w-[15vw] text-center cursor-pointer bg-violet-300" onClick={handleLogout}>Logout</div>
                </div>  
                
                <div className="w-[60vw] border-2 flex flex-col grow">
                    <div className="px-6 py-4 text-2xl font-semibold">Personal Information</div>
                    {showCredentials && <div className="flex flex-col">
                          
                                <div className="flex flex-row mt-5">
                                    <div className="py-2 px-6 w-[200px] text-gray-500">Email ID</div>
                                    <input type="text" name="clientEmail" value={ClientDetails.clientEmail} className="border-2 py-2 px-4 rounded-lg w-[360px]"/>
                                </div>
                                <div className="flex flex-row mt-5">
                                    <div className="py-2 px-6 w-[200px] text-gray-500">Client Name</div>
                                    <input type="text" name="clientName" value={ClientDetails.clientName} className="border-2 py-2 px-4 rounded-lg w-[360px]"/>
                                </div>
                                <div className="flex flex-row mt-5">
                                    <div className="py-2 px-6 w-[200px] text-gray-500">Client ID</div>
                                    <input type="text" name="clientId" value={ClientDetails.clientId} className="border-2 py-2 px-4 rounded-lg w-[360px]" disabled/>
                                </div>
                                <div className="flex flex-row mt-5">
                                    <div className="py-2 px-6 w-[200px] text-gray-500">Client Secret</div>
                                    <input type="text" name="clientId" value={ClientDetails.clientSecret} className="border-2 py-2 px-4 rounded-lg w-[360px]" disabled/>
                                </div>
                     
                        </div>}

                    <div className="px-6 py-4 mt-6 text-2xl font-semibold">Access Required</div>
                    
                    <div  className="flex flex-row ">
                    {ClientDetails?.access?.map((access, index)=>(
                       
                           <div key={index} className="border-2 border-violet-700 text-violet-700 px-4 py-2 rounded-lg ml-6">{access}</div>
                           
                        ))}
                    </div>


                    {!showInput?<span className="w-[80px] text-center border-2 rounded-lg hover:bg-violet-500 bg-violet-300 cursor-pointer text-white ml-6 text-sm mt-4" onClick={Addaccess}>+ ADD</span>:
                        <div className="flex flex-row ml-6 mt-4">
      
                            <select name="access" id="access" className="px-4 py-2 rounded-xl border-violet-700 border-2 cursor-pointer" value={selectedOption} onChange={(e)=>setSelectedOption(e.target.value)}>
                                <option value="First Name">First Name</option>
                                <option value="Last Name">Last Name</option>
                                <option value="Email">Email</option>
                                <option value="Mobile">Mobile</option>
                            </select>
                            
                            <div className="w-[80px] text-center border-2 rounded-lg hover:bg-violet-500 bg-violet-300 cursor-pointer text-white ml-6 text-sm mt-4" onClick={upadateAccessRequired}>Submit</div>
                            <div className="w-[80px] text-center border-2 rounded-lg hover:bg-violet-300 cursor-pointer ml-3 text-sm mt-4 border-violet-300" onClick={()=>setShowInput(false)}>Cancel</div>
                        </div>
                    }
                  

                    <div className="px-6 py-4 mt-6 text-2xl font-semibold">Redirected URL's</div>

                    <div  className="flex flex-row">
                        {ClientDetails?.redirectedUrl?.map((redirect, index)=>(
                                <div key={index} className="border-2 border-violet-700 text-violet-700 px-4 py-2 rounded-lg ml-6">{redirect}</div>
                            ))}
                    </div>

                    {!showredirectInput?<span className="w-[80px] text-center border-2 rounded-lg hover:bg-violet-500 bg-violet-300 cursor-pointer text-white ml-6 text-sm mt-4 mb-6" onClick={AddredirectURL}>+ ADD</span>    :
                        <div className="flex flex-row ml-6 mt-4 mb-6">
      
                            <input type="text" value={redirectValue} onChange={(e)=>setRedirectValue(e.target.value)} className="border-2 border-violet-700 px-2 rounded-lg"/>
                            
                            <div className="w-[80px] text-center border-2 rounded-lg hover:bg-violet-500 bg-violet-300 cursor-pointer text-white ml-6 text-sm mt-4" onClick={upadateRedirectURL}>Submit</div>
                            <div className="w-[80px] text-center border-2 rounded-lg hover:bg-violet-300 cursor-pointer ml-3 text-sm mt-4 border-violet-300" onClick={()=>setShowredirectInput(false)}>Cancel</div>
                        </div>
                    }
                    


                </div>
            
            </div>

        </>
     );
}
 
export default ClientHome;