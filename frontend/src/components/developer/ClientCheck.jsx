import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const CheckClient = ({children}) => {
    const navigate = useNavigate()

   

    const [isAuthenticate,setIsAuthenticate] = useState(null)

    useEffect(()=>{
        const fetchAuth = async ()=>{
            try {
                const client = await axios.get("http://localhost:5001/api/client/check-client",{
                    withCredentials:true
                })

              
                
                setIsAuthenticate(true)

            } catch (error) {
                setIsAuthenticate(false)
            }
        }

        fetchAuth()
    },[])

    return isAuthenticate === null ? (
        <div>Loading...</div> // Optionally show a loading spinner or message while checking auth
      ) : isAuthenticate ? (
        children  // If authenticated, render the children
      ) : (
        navigate("/Client") // If not authenticated, redirect to the home page
      );
}
 
export default CheckClient;