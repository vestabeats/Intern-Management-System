import React, { useRef,Fragment } from 'react'
import { Transition } from '@headlessui/react'
import {BrowserRouter,Routes,Route,Navigate,useLocation,Outlet} from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import MobileSidebar from './components/MobileSidebar'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { useSelector } from 'react-redux'
import { Toaster } from 'sonner'
import Interns from './pages/Interns'
import Apprentice from './pages/Apprentice'
import Trash from './pages/Trash'
import Supervisor from './pages/Supervisor'
import Tasks from './pages/Tasks'
import Trainees from './pages/Trainees'
import Encadrant from './pages/Encadrant'
import TaskDetails from './pages/TaskDetails'
import UpdateProfile from './components/UpdateProfile'

import ChatBox from './components/ChatBox'
import Home from './pages/Home'
import Evaluation from './pages/Evaluation'
import History from './pages/History'
import InActive from './pages/InActive'
import OpenEvaluation from './components/OpenEvaluation'
import OpenTrainee from './components/OpenTrainee'


function Layout (){
  const {user}=useSelector((state)=>state.auth)
  
  const location = useLocation()
  return user ? (
    <div className='w-full h-screen flex flex-col md:flex-row'>
      <div className='w-1/5 h-screen bg-white sticky top-0 hidden md:block'>
        <Sidebar /> 
      </div>

       <MobileSidebar/> 

       <div className='flex-1 z-10 overflow-y-auto'>
        <Navbar /> 
        <div className='p-4 2xl:px-10'>
        <Outlet/>
       </div>
       
       </div>
       
    </div>
  ):(
    <Navigate to="/home" state={{from: location}} replace/>
  )
}


const App = () => {
  return (
    <main className='w-full min-h-screen bg-[#f3f4f6]'>
      
      <Routes>
      <Route element={<Layout/>}>
      <Route index path='/' element={<Navigate to='/dashboard'/>} />
      <Route path='/dashboard' element={<Dashboard/>} />
      <Route path='/interns/:duty' element={<Interns/>} />
      <Route path='/apprentices/:duty' element={<Apprentice/>} />
      <Route path='/supervisors/:duty' element={<Supervisor/>} />
      <Route path='/trashed' element={<Trash/>} />
      <Route path='/tasks' element={<Tasks/>} />
      <Route path='/history' element={<History/>} />s
      <Route path='/completed/:status' element={<Tasks/>} />
      <Route path='/in-progress/:status' element={<Tasks/>} />
      <Route path='/todo/:status' element={<Tasks/>} />
      <Route path='/trainee' element={<Trainees/>} />
      <Route path='/supervisor' element={<Encadrant/>} />
      <Route path='/inactive' element={<InActive/>} />
      <Route path='/update-profile' element={<UpdateProfile/>} />
      <Route path='/task/:id' element={<TaskDetails/>} />
      <Route path='/evaluation' element={<Evaluation/>} />
      <Route path='/openevaluation/:id' element={<OpenEvaluation/>} />
      <Route path='/openTrainee/:id' element={<OpenTrainee/>} />
      <Route path='/chatbox/:id' element={<ChatBox/>} />
      </Route>
      <Route path='/login' element={<Login/>} />
      <Route path='/home' element={<Home/>} />
      </Routes>
      
      <Toaster richColors/>
     
    </main>
  )
}

export default App