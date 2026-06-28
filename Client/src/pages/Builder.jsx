import React, { useState } from 'react'
import { FiCopy, FiPlus, FiTrash2 } from 'react-icons/fi';
import axios from "axios"
import toast, { Toaster } from 'react-hot-toast';
import { clientUrl, serverUrl } from '../App';
import { data } from 'react-router-dom';

const THEMES = [
  "light",
  "dark",
  "glass",
  "neon",
];

const TONES = [
  "friendly",
  "professional",
  "sales",
];
const Builder = ({ user, setUser }) => {

  const [editAssistant , setEditAssistant] = useState(!user?.isSetupComplete)
  const [assistantName, setAssistantName] = useState(user?.assistantName || "")

  const [businessName, setBusinessName] = useState(user?.businessName || "")

  const [businessType, setBusinessType] = useState(user?.businessType || "")

  const [businessDescription, setBusinessDescription] = useState(user?.businessDescription || "")

  const [theme, setTheme] = useState(user?.theme || "neon")
  const [tone, setTone] = useState(user?.tone || "friendly")
  const [geminiApiKey, setGeminiApiKey] = useState(user?.geminiApiKey || "")

  const [pages, setPages] = useState(user?.pages || [])
  const [pageName, setPageName] = useState("")
  const [pagePath, setPagePath] = useState("")
  const [pageKeywords, setPageKeywords] = useState("")
  const [loading, setLoading] = useState(false)

  const addPage = () => {
    if (!pageName || !pagePath) return;

    const newPage = {
      name: pageName,
      path: pagePath,
      keywords: pageKeywords.split(",").map((k) => k.trim())
    }
    setPages([...pages, newPage])

    setPageName("")
    setPagePath("")
    setPageKeywords("")
  }

  const removePage = (index) => {
    const updatePages = pages.filter((_, i) => i !== index)

    setPages(updatePages)
  }

  const saveAssistant = async () => {
    setLoading(true)
    try {
      const data ={
        assistantName,
        businessName,
        businessType,
        businessDescription,
        tone,
        theme,
        geminiApiKey,
        pages,

      }

      const res = await axios.post(serverUrl + "/api/user/save-assistant"
        ,data ,{withCredentials:true}
      )
     console.log(res.data);
     setUser(res.data.user)
     toast.success("Assistant Saved Successfully")
     setLoading(false)
     setEditAssistant(false)
    } catch (error) {
      toast.error("Failed to save assistant")
      console.log(error)
      setLoading(false)
    }
  }


  const remainingMessages = 
  Math.max(
    0,
    (user?.requestLimit || 0)-
    (user?.totalMessages || 0)
  );


  const embedCode = `<script src="${clientUrl}/assistant.js" data-user-id="${user?._id}"></script>`

  return (
    <div className='min-h-screen bg-[#f7f8fc] px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-[#081028]'> Assistant Builder</h2>
          <p className='mt-1 text-gray-500'>Customize your Virtual Assistant</p>
        </div>

       {user.isSetupComplete && !editAssistant &&(
        <div className='bg-white rounded-3xl border  border-gray-100 shadow-sm p-6 mb-6'>

         <p className='text-sm text-gray-400'>
          Assistant
         </p>

         <h2 className='text-3xl font-bold mt-1 text-[#081028]'>
          {user.assistantName}
         </h2>

         <p className='text-gray-500 mt-3 leading-7'>
          Your assistant is ready to use on your website
         </p>

         <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6'>


            <div className='rounded-2xl border border-gray-100 p-4 bg-[#faf8fc]'>
              <p className='text-sm text-gray-400'>
                Current Plan
              </p>

              <h2 className='text-2xl font-bold text-black mt-1'>
                Free
              </h2>
            </div>


            <div className='rounded-2xl border border-gray-100 p-4 bg-[#faf8fc]'>
              <p className='text-sm text-gray-400'>
                Gemini Status
              </p>

              <h2 className={`text-2xl font-bold  capitalize mt-1 ${
                user?.geminiStatus === "active"
                ? "text-emerald-600"
                : user?.geminiStatus === "invalid"
                ? "text-red-500"
                :"text-amber-500"
              }`}>
                {user?.geminiStatus}
              </h2>
            </div>



            <div className='rounded-2xl border border-gray-100 p-4 bg-[#faf8fc]'>
              <p className='text-sm text-gray-400'>
                Message Left
              </p>

              <h2 className='text-2xl font-bold text-black  capitalize mt-1'
              >
                {remainingMessages}
              </h2>
            </div>
         </div>
         
         <div className='mt-7'>
           
           <div className='bg-amber-50 rounded-2xl border  border-amber-200  p-4 mt-4'>

            <p className='text-sm font-semibold text-amber-900'>
              Where to paste this Script?
            </p>

            <p className='text-sm text-amber-700 mt-2 leading-6'>

              Paste this Script before the closing
              {" "}
              <span className='font-semibold'>
                {"</body>"}
              </span>
             {" "}
              tag of your HTML file
              <br />
              <br />
              
              Example:
            </p>

            <pre className='mt-3 rounded-xl text-emerald-400 bg-[#081028] p-3 text-xs font-mono overflow-x-auto'>
              

              {`<body>

  Your Website Content

  <script src="${clientUrl}/assistant.js" data-user-id="${user?._id}"></script>

</body>`}
            </pre>
         </div>
        
        <p className=' mt-3 text-sm font-medium text-[#081028]'>
          Embed Code
        </p>
         </div>
         <div className='relative'>
           <textarea value={embedCode} className='w-full h-20 mt-3 rounded-2xl text-emerald-400 bg-[#081028] p-4 text-xs font-mono resize-none outline-none'
           readOnly/>
           <button onClick={()=>{navigator.clipboard.writeText(embedCode);
            toast.success("Copied")
           }}
           
           className='absolute top-4 right-4 w-10 h-10 bg-white rounded-xl flex items-center justify-center cursor-pointer'>
            <FiCopy/>
           </button>
         </div>

         <button onClick={()=>setEditAssistant(true)} className='px-6  mt-6 h-12  rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 text-white  font-medium hover:scale-[1.02] transition-all cursor-pointer'>
          Edit Assistant
         </button>

        </div>
       )}

        {editAssistant && <div className='space-y-6'>
          <div className='bg-white rounded-3xl border  border-gray-100 shadow-sm p-6'>
            <h2 className='text-lg font-semibold mb-5 '>
              Basic Information
            </h2>
            <div className='space-y-4'>
              <input type="text"
                onChange={(e) => setAssistantName(e.target.value)}
                value={assistantName}
                placeholder='Assistant Name'
                className='w-full border border-gray-300 rounded-2xl px-4 py-3'
              />

              <input type="text"
                placeholder='Business Name'
                onChange={(e) => setBusinessName(e.target.value)}
                value={businessName}
                className='w-full border border-gray-300 rounded-2xl px-4 py-3'
              />

              <input type="text"
                onChange={(e) => setBusinessType(e.target.value)}
                value={businessType}
                placeholder='Business Type'
                className='w-full border border-gray-300 rounded-2xl px-4 py-3'
              />

              <textarea type="text"
                rows={4}
                onChange={(e) => setBusinessDescription(e.target.value)}
                value={businessDescription}
                placeholder='Business Description'
                className='w-full border border-gray-300 rounded-2xl px-4 py-3 resize-none'
              />
            </div>
          </div>

          <div className='bg-white rounded-3xl border  border-gray-100 shadow-sm p-6'>
            <h2 className='text-lg font-semibold mb-5'>
              Appearance
            </h2>
            <div>
              <label className='text-sm text-gray-600 mb-3 block' >Theme</label>
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                {THEMES.map((item) => (
                  <button key={item} onClick={() => setTheme(item)} className={`py-3 rounded-2xl border-2 capitalize cursor-pointer  ${theme === item ? "border-purple-500 bg-purple-50  text-purple-700" :
                    "border-gray-200"
                    } `}>{item}

                  </button>
                ))}
              </div>
            </div>
            <div className='mt-6'>
              <label className='text-sm text-gray-600 mb-3 block' >Assistant Tone</label>
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                {TONES.map((item) => (
                  <button key={item} onClick={() => setTone(item)} className={`py-3 rounded-2xl border-2 capitalize cursor-pointer  ${tone === item ? "border-purple-500 bg-purple-50  text-purple-700" :
                    "border-gray-200"
                    } `}>{item}

                  </button>
                ))}
              </div>
            </div>

          </div>
          <div className='bg-white rounded-3xl border  border-gray-100 shadow-sm p-6'>
            <div className='flex items-center justify-between gap-4 flex-wrap mb-5'>
              <div>
                <h2 className='text-lg font-semibold'>Gemini API Key</h2>
                <p className='text-sm text-gray-500 mt-2'>Add Gemini API key to Power your Assistant</p>
              </div>
              <a href="https://aistudio.google.com/api-keys"
                target='_blank'
                rel='noopener noreferrer'
                className='px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 text-white
                 text-sm font-medium hover:scale-[1.02] transition-all cursor-pointer'>
                Get API KEY
              </a>
            </div>
            <input type="password"
              placeholder='AIza1.......'
              onChange={(e) => setGeminiApiKey(e.target.value)}
              value={geminiApiKey}
              className='w-full bg-white rounded-2xl border  border-gray-100 shadow-sm px-4 py-3' />

            <p className='text-xs text-gray-400 mt-3 leading-6'>
              Your API Key is securely stored and used for only generating AI respnses.
            </p>
          </div>
          <div className='bg-white rounded-3xl border  border-gray-100 shadow-sm p-6'>
            <div className='flex items-center justify-between mb-5 flex-wrap'>
              <div>
                <h2 className='text-lg font-semibold'>
                  Navigate Pages
                </h2>
                <p className='text-sm text-gray-400 mt-1'>
                  Assistant can redirect users
                </p>
              </div>
              <button onClick={addPage} className=' flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 text-white cursor-pointer
                 text-sm font-medium'>
                <FiPlus /> Add
              </button>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
              <input type="text" placeholder='Page Name'
                className='border  border-gray-300 rounded-2xl px-4 py-3'
                onChange={(e) => setPageName(e.target.value)}
                value={[pageName]}
              />


              <input type="text" placeholder='/pricing'
                className='border  border-gray-300 rounded-2xl px-4 py-3'
                onChange={(e) => setPagePath(e.target.value)}
                value={[pagePath]}
              />


              <input type="text" placeholder='Pricing , orders , Plans'
                className='border  border-gray-300 rounded-2xl px-4 py-3'
                onChange={(e) => setPageKeywords(e.target.value)}
                value={[pageKeywords]}
              />

            </div>
            <div className='mt-5 space-y-3'>
              {
                pages.map((page, index) => (
                  <div key={index}
                    className='flex items-center justify-between border border-gray-100 rounded-2xl p-4'>
                    <div>
                      <p className='font-medium'>{page.name}</p>
                      <p className='text-sm text-gray-600'>{page.path}</p>
                      <p className='text-xs text-gray-500'>{page.keywords}</p>
                    </div>
                    <button onClick={() => removePage(index)} className='text-red-500 cursor-pointer'>
                      <FiTrash2 />
                    </button>
                  </div>
                ))
              }

            </div>
          </div>
              <button onClick={saveAssistant} 
                 disabled={loading} 
                 className='w-full h-14 rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 text-white cursor-pointer
                 font-semibold'>
                  {
                     loading ? "Saving..." : user.isSetupComplete ? "Update Assistant" : "Save Assistant"
                 }
               </button>
        </div>}
      </div>

    </div>

  )
}

export default Builder
