import React, { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import BoardView from "../components/BoardView";
import { tasks } from "../assets/data";
import Table from "../components/Table";
import AddTask from "../components/AddTask";
import { useGetAllTaskQuery } from '../redux/slices/api/taskApiSlice';
import { useDispatch, useSelector } from "react-redux";
import { setFetchTaskData } from "../redux/slices/authSlice";
import { useLocation } from 'react-router-dom';
const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];
const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};


const Tasks = () => {
  const params = useParams();
  const location = useLocation();
  const dispatch = useDispatch()
  const {searchvalue}=useSelector((state)=>state.auth)
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const{user} = useSelector((state)=>state.auth)
  const status = params?.status || "";
  const{data,isLoading,refetch}=useGetAllTaskQuery({strQuery:status,search:searchvalue})
  dispatch(setFetchTaskData(refetch))
  useEffect(()=>{
   
    refetch()
  },[status,location])

  return isLoading ?(
    <div className='py-10'><Loading/></div>
  ):(
  <div className='w-full'>
    <div className='flex items-center justify-between mb-4'>
        <Title title={status ? `${status} Tasks` : "Tasks"} />

        { user?.data?.isSup && (
          <Button
            onClick={() => setOpen(true)}
            label='Create Task'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5'
          />
        )}
      </div>
      <Tabs tabs={TABS} setSelected={setSelected}>
      {!status && (
          <div className='w-full flex justify-between gap-4 md:gap-x-12 py-4'>
            <TaskTitle label='To Do' className={TASK_TYPE.todo} />
            <TaskTitle
              label='In Progress'
              className={TASK_TYPE["in progress"]}
            />
            <TaskTitle label='completed' className={TASK_TYPE.completed} />
          </div>
        )}

        {selected !== 1 ? (
          <BoardView tasks={data?.tasks} />
        ) : (
          <div className='w-full'>
             <Table tasks={data?.tasks} />
          </div>
        )}
      </Tabs>
      <AddTask open={open} setOpen={setOpen} />
  </div>
  );
}

export default Tasks