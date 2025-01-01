import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {

    const navigate = useNavigate()

    const handleLogout = async()=>{
        try {
            const response = await axios.post("http://localhost:5000/api/auth/logout",{},{
                withCredentials:true
            })
        
            if(response.data.success === true){
                toast.success(response.data.message)
                navigate("/")
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to logged out")
        }
    }

    return ( 
        <div>
            hemlo
            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
     );
}
 
export default Home;