import React, { useEffect } from 'react'
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
  } from "recharts";
import { chartData } from "../assets/data";
import { useSelector } from 'react-redux';
import { useGetAdminDashboardStatsQuery } from '../redux/slices/api/userApiSlice';
import { useGetDashboardStatsQuery } from '../redux/slices/api/taskApiSlice';
import { useLocation } from 'react-router-dom';

const Chart = () => {
  const location =useLocation()
  const {data:dataa,isLoading,refetch:reload}=useGetAdminDashboardStatsQuery()
  const {data,isLoading:isLoadin,refetch}=useGetDashboardStatsQuery()
const {user}=useSelector((state)=>state.auth)
useEffect(()=>{
   reload()
  refetch()
},[location])
let chartdat
if(user?.data?.isAdmin){
 chartdat= dataa?.graphData
}else{
  chartdat=data?.graphData
}
  return (
    <ResponsiveContainer width={"100%"} height={300}>
      <BarChart width={150} height={40} data={chartdat}>
        <XAxis dataKey='name' />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid strokeDasharray='3 3' />
        <Bar dataKey='total' fill='#8884d8' />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default Chart