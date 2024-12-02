import React from 'react'
import {
    MdDashboard,
    MdOutlineAddTask,
    MdOutlineMessage,
    MdOutlinePendingActions,
    MdOutlinePersonAddDisabled,
    MdSettings,
    MdTaskAlt,
  } from "react-icons/md";
  import { MdOutlineTask } from "react-icons/md";
  import { PiStudentBold } from "react-icons/pi";
import { FaTasks, FaTrashAlt, FaUsers,FaUserGraduate,FaUserTie  } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import {  Link, useLocation,useNavigate } from 'react-router-dom';
import { setOpenSidebar } from '../redux/slices/authSlice';
import clsx from 'clsx';
import epb  from "../assets/epb.jpg"
import { RiFolderHistoryFill } from 'react-icons/ri';

const linkDataa = [
    {
      label: "Dashboard",
      link: "dashboard",
      icon: <MdDashboard />,
    },
    {
      label: "Supervisors",
      link: "supervisors/supervisor",
      icon: <FaUserTie/>,
    },
    {
      label: "Interns",
      link: "interns/intern",
      icon: <FaUserGraduate  />,
    },
   
    {
      label: "Apprentices",
      link: "apprentices/apprentice",
      icon: <PiStudentBold/>,
     
    },
    {
      label: "InActive Users",
      link: "inactive",
      icon:<MdOutlinePersonAddDisabled />,
      
    },
    {
      label: "History",
      link: "history",
      icon: <RiFolderHistoryFill />,
    },
    {
      label: "Trash",
      link: "trashed",
      icon: <FaTrashAlt />,
    },
  ];



  // Define the user-specific link object conditionally
  const linkData = [
    {
      label: "Dashboard",
      link: "dashboard",
      icon: <MdDashboard />,
    },
    {
      label: "Tasks",
      link: "tasks",
      icon: <FaTasks />,
    },
    {
      label: "Completed",
      link: "completed/completed",
      icon: <MdTaskAlt />,
    },
    {
      label: "In Progress",
      link: "in-progress/in progress",
      icon: <MdOutlinePendingActions />,
    },
    {
      label: "To Do",
      link: "todo/todo",
      icon: <MdOutlineTask />,
    },
    {
      label: "Trainees",
      link: "trainee",
      icon: <FaUsers />,
    },{
      label:"Evaluations",
      link:"evaluation",
      icon: <MdOutlineMessage/>
    }
  ];
  const linkDataaa = [
    {
      label: "Dashboard",
      link: "dashboard",
      icon: <MdDashboard />,
    },
    {
      label: "Tasks",
      link: "tasks",
      icon: <FaTasks />,
    },
    {
      label: "Completed",
      link: "completed/completed",
      icon: <MdTaskAlt />,
    },
    {
      label: "In Progress",
      link: "in-progress/in progress",
      icon: <MdOutlinePendingActions />,
    },
    {
      label: "To Do",
      link: "todo/todo",
      icon: <MdOutlineTask />,
    },{
      label: "Supervisor",
      link: "supervisor",
      icon: <FaUserTie />,
    },,{
      label:"Evaluations",
      link:"evaluation",
      icon: <MdOutlineMessage/>
    }
  ];
  

  
 
  
 
 
const Sidebar = () => {
  const {user}=useSelector((state)=>state.auth)
  // Conditional inclusion of user-specific link object
  
  
  
  const dispatch = useDispatch()
  const location = useLocation()
  const path = location.pathname.split("/")[1]
  const sidebarLinks = user.data.isAdmin?linkDataa :user.data.isSup?linkData:linkDataaa
  const navigate = useNavigate()
  const closeSidebar = ()=>{
    

    dispatch(setOpenSidebar(false))
    
  }
  const NavLink =({el})=>{
    return(
      <Link to={el.link} onClick={closeSidebar} className={
        clsx("w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center  text-none text-base hover:bg-[#2564ed2d]",
        path===el.link.split("/")[0] ? "bg-blue-700 hover:bg-gray-800 text-white":"text-gray-800")}>
          {el.icon}
          <span className='hover:text-[#2564ed]'>{el.label}</span>
      </Link>
    )
   }
  return (
    <div className='w-full h-full flex flex-col gap-6 p-5'>
       <h1 className='flex gap-1 items-center'>
        <p className='bg-blue-600 rounded-full p-1 '>
       
        <img src={epb} className='h-6 rounded'/>

        </p>
        <span className='text-3xl text-black font-bold'>EPB</span>
      </h1>
      <div className='flex-1 flex-col flex gap-y-5 py-8'>
        {
          sidebarLinks.map((link)=>(
            <NavLink el={link} key={link.label}/>
          ))
        }

      </div>
      
      </div>
  )
}

export default Sidebar