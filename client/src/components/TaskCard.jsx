import clsx from "clsx";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate, formatter } from "../utils";
import TaskDialog from "./TaskDialog";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import UserInfo from "./UserInfo";
import { IoMdAdd } from "react-icons/io";
import AddSubTask from "./AddSubTask";
import { AiTwotoneFolderOpen } from "react-icons/ai";
import { useValidateTaskMutation } from "../redux/slices/api/taskApiSlice";
import { toast } from "sonner";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task }) => {
  const { user } = useSelector((state) => state.auth);
  const[validateTask]=useValidateTaskMutation()
  const {fetchTaskData}=useSelector((state)=>state.auth)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const validateClick=async(data)=>{
    console.log(data)
    try{
      const res = await validateTask(data)
      fetchTaskData()
      toast.success(res?.data?.message)

    }catch(error){
      console.log(error)
      toast.error(error?.message)

    }

  }

  return (
    <>
      <div className='w-full h-fit bg-white shadow-md p-4 rounded'>
        <div className='w-full flex justify-between'>
          <div
            className={clsx(
              "flex flex-1 gap-1 items-center text-sm font-medium",
              PRIOTITYSTYELS[task?.priority]
            )}
          >
            <span className='text-lg'>{ICONS[task?.priority]}</span>
            <span className='uppercase'>{task?.priority} Priority</span>
          </div>

          {user?.data?.isSup && <TaskDialog task={task} />}
          
        </div>

        <>
          <div className='flex items-center gap-2'>
            <div
              className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task?.stage])}
            />
            <h4 className='line-clamp-1 text-black'>{task?.title}</h4>
          </div>
          <span className='text-sm text-gray-600'>
            {formatDate(new Date(task?.date))}
          </span>
        </>

        <div className='w-full border-t border-gray-200 my-2' />
        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center gap-3'>
            <div className='flex gap-1 items-center text-sm text-gray-600'>
              <BiMessageAltDetail />
              <span>{task?.activities?.length}</span>
            </div>
            <div className='flex gap-1 items-center text-sm text-gray-600 '>
              <MdAttachFile />
              <span>{task?.assets?.length}</span>
            </div>
            <div className='flex gap-1 items-center text-sm text-gray-600 '>
              <FaList />
              <span>{task?.subTask?.length}</span>
            </div>
          </div>

          <div className='flex flex-row-reverse'>
            {task?.team?.map((m, index) => (
              <div
                key={index}
                className={clsx(
                  "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                  BGS[index % BGS?.length]
                )}
              >
                <UserInfo user={m} />
              </div>
            ))}
          </div>
        </div>

        {/* sub tasks */}
        {task?.subTask?.length > 0 ? (
          <div className='py-4 border-t border-gray-200'>
            <h5 className='text-base line-clamp-1 text-black'>
            <span className='text-sm text-gray-600'>  Submited By:</span> {task.subTask[0].by.surname} {task.subTask[0].by.firstname}
            </h5>

            <div className='pt-2 space-x-8'>
              <span className='text-sm text-gray-600'>
               Submitted On: {formatter(new Date(task?.subTask[0]?.submitedAt))}
              </span>
              <button  disabled={user?.data?.isSup ? false : true} onClick={()=>validateClick(task)} className={`bg-blue-400/10 px-3 py-1 rounded-full ${task.stage === "in progress" ? "text-red-600" : "text-green-600"} font-medium`}>
                {task.stage === "in progress" ? "In Progress" : "Completed"}
              </button>

            </div>
          </div>
        ) : (
          <>
            <div className='py-4 border-t border-gray-200'>
              <span className='text-gray-500'>Not yet Submited</span>
            </div>
          </>
        )}
      {(!user?.data?.isSup & !task?.subTask?.length ) ?(
        <div className='grid grid-cols-2 '>
          <div className="pb-2">
          <button
            onClick={() => setOpen(true)}
            disabled={!user?.data?.isSup ? false : true}
            className='w-full flex gap-4 items-center text-sm text-gray-500 font-semibold disabled:cursor-not-allowed disabled::text-gray-300'
          >
            <IoMdAdd className='text-lg' />
            <span>SUBMIT TASK</span>
          </button>
          </div>
          <button  onClick={ () => navigate(`/task/${task._id}`)} className=" flex flex-row-reverse "><span className="mr-2">Open Task</span> 
            <AiTwotoneFolderOpen className='mr-2 h-5 w-5' aria-hidden='true' /> </button>
         
        </div>):<span></span>
}
      </div>
      
      <AddSubTask open={open} setOpen={setOpen} id={task._id} />
    </>
  );
};

export default TaskCard;