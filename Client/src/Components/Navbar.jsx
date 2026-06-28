import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from "../assets/logo.png"
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import axios from 'axios';
import toast from 'react-hot-toast';
import { serverUrl } from "../App";


function Navbar({user , setUser}) {
  const handleLogout = async () => {
  try {
    await axios.get(serverUrl + "/api/auth/logout" , {withCredentials:true})
    setUser(null)
    toast.success("Logout Successfully")
    navigate("/login")
  } catch (error) {
    toast.error("Logout Failed")
    console.log(error)
  }
}
  const navigate = useNavigate()
  const [menuOpen , setMenuOpen] = useState(false )
  return (
    <div className='sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-orange-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between'>

      <div onClick={()=>navigate("/")} className='flex items-center gap-2.5 cursor-pointer'>
        <img src={logo} alt="Logo" className='h-13 w-auto object-contain'/>

        <h1 className='font-bold text-3xl text-blue-950 leading-none'>Kimra{" "} <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-emerald-500 '>AI</span></h1>
      </div>

 

     {user && (<div className='hidden md:flex items-center gap-3'>
       <button onClick={()=>navigate("/builder")} className=' px-6 py-3 rounded-3xl bg-gradient-to-r from-purple-500 to-emerald-500 text-white text-xl font-medium shadow-md hover:scale-[1.02]  transition-all cursor-pointer '>Builder</button>

       <div className='flex items-center gap-3 px-4 py-2 bg-white border border-orange-100 shadow-md  rounded-3xl'>
        <div className='w-11 h-11 rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 flex items-center justify-center flex-shrink-0'>
          <span className='text-white text-xl font-bold'>
            {user?.name.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className='max-w-[140px]'>
          <p className='text-m font-semibold text-gray-700 truncate'>
            {user.name}
          </p>
          <p className='text-xs text-gray-500 truncate'>
            {user.email}
          </p>
        </div>
       <button onClick={handleLogout} className='m1-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer'> <FiLogOut size={30}/></button>

      
       </div>
     </div> )}

     {user && (<button onClick={()=>setMenuOpen(!menuOpen)} className='md:hidden text-gray-500 hover:text-red-500 transition-colors'>
      {menuOpen ? <FiX size={22}/> : <FiMenu size={22}/>}

     </button>
     )}
      </div>
      {menuOpen && (
      <div className='md:hidden px-4 pb-4'>
        <div className='bg-white rounded-2xl border border-orange-100 shadow-lg p-4'>
           <div className='flex items-center gap-3 pb-4 border-b border-orange-100'>
             <div className='w-11 h-11 rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 flex items-center justify-center flex-shrink-0'>
          <span className='text-white text-xl font-bold'>
            {user?.name.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className='flex-1 overflow-hidden'>
          <p className='text-m font-semibold text-gray-700 truncate'>
            {user.name}
          </p>
          <p className='text-xs text-gray-500 truncate'>
            {user.email}
          </p>
        </div>
        </div>
         <div className='flex flex-col gap-3 mt-4'>
          <button className='w-full py-2.5 rounded-3xl bg-gradient-to-r from-purple-500 to-emerald-500 text-white text-m font-medium' onClick = {()=>{navigate("/builder");setMenuOpen(false)}}>Builder</button>

         </div>
        <button onClick={()=>{setMenuOpen(false);handleLogout()}} className='mt-4 py-3 w-full flex items-center  justify-center gap-2 rounded-3xl  bg-red-50 text-red-500 text-m font-medium s hover:bg-red-200  transition-colors cursor-pointer '> <FiLogOut size={16}/>
           Logout
        </button>
        </div>
      </div>
      )}
    </div>
  )
}

export default Navbar
