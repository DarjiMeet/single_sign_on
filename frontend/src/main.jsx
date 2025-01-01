import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import { Toaster, toast } from 'react-hot-toast';
import './index.css'
import App from './App.jsx'
import Verify from './components/Verify.jsx'
import Home from './components/Home.jsx';
import ResetPass from './components/ResetPass.jsx';
import CheckAuth from './checkAuth.jsx';
import Developer from './components/developer/Developer.jsx';
import ClientHome from './components/developer/ClientHome.jsx';
import CheckClient from './components/developer/ClientCheck.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<App/>}/>
        <Route path="/verify" element={<Verify/>}/>
        <Route path="/home" element={
           <CheckAuth>
            <Home/>
           </CheckAuth>
        }/>
        <Route path="/reset-password/:token" element={<ResetPass/>}/>
        <Route path="/Client" element={<Developer/>}/>
        <Route path="/Clienthome" element={
          <CheckClient>
            <ClientHome/>
          </CheckClient>
        }/>
      </Routes>
    </BrowserRouter>
    
  </StrictMode>,
)
