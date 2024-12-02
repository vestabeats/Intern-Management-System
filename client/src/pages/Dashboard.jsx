import React, { useState } from 'react'
import {
    MdAdminPanelSettings,
    MdKeyboardArrowDown,
    MdKeyboardArrowUp,
    MdKeyboardDoubleArrowUp,
  } from "react-icons/md";
  
  import { PiStudentBold } from "react-icons/pi";
  import { LuClipboardEdit } from "react-icons/lu";
  import { FaNewspaper, FaUsers,FaUserGraduate,FaUserTie  } from "react-icons/fa";
  import { FaArrowsToDot } from "react-icons/fa6";
  import moment from "moment";
  import clsx from "clsx";
import Chart from '../components/Chart';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';
import { useGetAdminDashboardStatsQuery } from '../redux/slices/api/userApiSlice';
import { useGetDashboardStatsQuery } from "../redux/slices/api/taskApiSlice";

const Dashboard = () => {
  const {user}=useSelector((state)=>state.auth)
  const[selected,setSelected]=useState(null)
  const {data:dataa,isLoading}= user?.data?.isAdmin && useGetAdminDashboardStatsQuery()
  const {data,isLoading:isLoadin}=!user?.data?.isAdmin && useGetDashboardStatsQuery()
  const totals = dataa?.users;
  const totalss = data?.tasks;

  if(isLoading || isLoadin){ return (<div className='py-5'>
  <Loading/></div>)}
  
    const star = [
        {
          _id: "1",
          label: "TOTAL USERS",
          total:  dataa?.totalUsers ||0,
          icon: <FaUsers/>,
          bg: "bg-[#1d4ed8]",
        },
        {
          _id: "2",
          label: "SUPERVISORS",
          total:  totals?.["supervisor"] ||0,
          icon: <FaUserTie />,
          bg: "bg-[#0f766e]",
        },
        {
          _id: "3",
          label: "INTERNS",
          total: totals?.["intern"] ||0,
          icon: <FaUserGraduate />,
          bg: "bg-[#f59e0b]",
        },
        {
          _id: "4",
          label: "APPRENTICE",
          total: totals?.["apprentice"] ||0,
          icon: <PiStudentBold />,
          bg: "bg-[#be185d]" || 0,
        },
      ];

      
  const stat = [
    {
      _id: "1",
      label: "TOTAL TASK",
      total:  data?.totalTasks || 0,
      icon: <FaNewspaper />,
      bg: "bg-[#1d4ed8]",
    },
    {
      _id: "2",
      label: "COMPLTED TASK",
      total:  totalss?.["completed"] || 0,
      icon: <MdAdminPanelSettings />,
      bg: "bg-[#0f766e]",
    },
    {
      _id: "3",
      label: "TASK IN PROGRESS ",
      total: totalss?.["in progress"] || 0,
      icon: <LuClipboardEdit />,
      bg: "bg-[#f59e0b]",
    },
    {
      _id: "4",
      label: "TODOS",
      total:totalss?.["todo"] ||0,
      icon: <FaArrowsToDot />,
      bg: "bg-[#be185d]",
    },
  ];
const stats = user?.data?.isAdmin?star:stat
      

      const Card = ({ label, count, bg, icon }) => {
        return (
          <div className='w-full  h-32 bg-white p-5 shadow-md rounded-md flex items-center justify-between'>
            <div className='h-full flex flex-1 flex-col justify-between'>
              <p className='text-base text-gray-600'>{label}</p>
              <span className='text-2xl font-semibold'>{count}</span>
              <span className='text-sm text-gray-400'>{user?.data?.isAdmin?"Active":"Recently Updated"}</span>
            </div>
    
            <div
              className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center text-white",
                bg
              )}
            >
              {icon}
            </div>
          </div>
        );
      };
  return (
    <div className='h-full py-4'>
     
    <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
      {stats.map(({ icon, bg, label, total }, index) => (
        <Card key={index} icon={icon} bg={bg} label={label} count={total} />
      ))}
    </div>

    <div className='w-full bg-white my-16 p-4 rounded shadow-sm'>
      <h4 className='text-xl text-gray-600 font-semibold'>

        {user?.data?.isAdmin?"Chart by User":"Chart by Priority"}
      </h4>
    <Chart />
    </div>

    <div className='w-full flex flex-col md:flex-row gap-4 2xl:gap-10 py-8'>
      
    </div>
  </div>
  )
}

export default Dashboard