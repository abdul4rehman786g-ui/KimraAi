import React from 'react'
import { HiOutlineSparkles, HiOutlineMicrophone, HiOutlineCodeBracket, HiOutlineBolt } from "react-icons/hi2";
import { FcGoogle } from "react-icons/fc"
import logo from "../assets/logo.png"
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utills/firebase';
import axios from "axios"
import { serverUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';


const Login = ({setUser}) => {
  const navigate = useNavigate()
  const Features =
    [
      {
        icon:
          <HiOutlineMicrophone />,

        title:
          "Voice Al",
        desc:
          "Natural real-time voice conversations.",
      },

      {
        icon:
          <HiOutlineSparkles />,
        title:
          "Smart Navigation",
        desc:
          "Navigate pages using voice commands.",
      },


      {
        icon:
          <HiOutlineCodeBracket />,
        title:
          "Easy Embed",
        desc:
          "Add assistant using one script tag.",
      },


      {
        icon:
          <HiOutlineBolt />,
        title:
          "Fast Responses",
        desc:
          "Optimized Gemini AI responses.",
      },
    ];

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      const { displayName, email } = result.user
      const res = await axios.post(serverUrl + "/api/auth/google", { name: displayName, email }, { withCredentials: true })

      setUser(res.data)
      toast.success("Login Successfully")
      navigate("/")
    } catch (error) {
      toast.error("Login Failed")
      console.log(error)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-white-to-emerald-50 overflow-hidden'>
      <div className='max-w-7x1 mx-auto px-6 py-16 lg:py-24'>
        <div className=' grid lg:grid-cols-2 gap-16 items-center'>
          {/* left */}


          <div>
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-200 bg-purple-100 text-purple-600 text-sm font-medium'>
              <HiOutlineSparkles />
              Al Voice Assistant Platform </div>
            <br />
            <div />
            <p className="mt-4 text-lg text-purple-500 font-black ">
              Created by Abdul Rehman Ghaffar
            </p>
            <h1 className='mt-8 text-5xl lg:text-7xl font-black leading-tight text-[#113a5a]'>
              Build Ai Assistants
              <span className='block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-emerald-500'>For any Website</span>
            </h1>

            <p className='mt-8 text-lg text-[#475569] leading-8 max-w-2xl'>
              Create customizable Ai Voice Assitant that talk, Guide users and Integrate into any Website instantly.
            </p>
            <button onClick={handleLogin} className='mt-8 h-16 px-8 rounded-2xl bg-gradient-to-r from-purple-500 to-emerald-500 text-white text-lg font-semibold flex items-center gap-4 shadow-[0_20px_80px_rgba(139,92,246,0.25)] hover:scale-[1.02] rounded-full  transition cursor-pointer'>

              <FcGoogle className='text-4xl bg-white rounded-full' />
              Continue with Google</button>

            <p className='mt-4 text-sm text-purple-900'>Free plan includes 200 free responses</p>

          </div>
          {/* right */}

          <div className='relative'>
            <div className='absolute inset-0 bg-gradient-to-r from-purple-200/50 to-emerald-200/40 blur-[120px]' />

            <div className='relative rounded-[40px] border border-black/5 bg-white shadow-[0_20px_80px_rgba(0,0,0,06)] p-8 overflow-hidden'>

              <div className='flex items-center justify-between'>
                <div>
                  <h2 className='mt-2 text-3xl font-bold text-[#113a5a]'>Features
                  </h2>
                </div>
                <div className='w-16 h-16 rounded-3xl bg-gradient-to-r from-purple-500 to-emerald-500 flex items-center justify-center shadow-[0_10px_40px_rgba(139,92,246,0.25)] p-3 '>

                  <img src={logo} alt="Logo" className='h-full w-full object-contain' />
                </div>
              </div>
              <div className='mt-10 sapce-y-5'>
                {
                  Features.map(({ icon, title, desc }, index) => (
                    <div key={index} className='flex gap-5 rounded-3xl border border-black/5 bg-[#f8fafc] p-5'>
                      <div className='min-w-[60px] h-[60px] rounded-3xl  bg-gradient-to-r from-purple-500 to-emerald-500 flex items-center justify-center shadow-[0_10px_40px_rgba(139,92,246,0.25)] text-white text-2xl'>
                        {icon}
                      </div>
                      <div>
                        <h3 className='text-[#113a5a] text-lg font-semibold'>
                          {title}
                        </h3>
                        <p className='my-2 text-sm leading-7 text-gray-700'>{desc}</p>
                      </div>
                    </div>

                  ))
                }
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Login

