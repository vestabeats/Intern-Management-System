import clsx from "clsx";
import moment from "moment";
import pdfDefault from "../assets/pdfDefault.webp"
import docs from "../assets/docs.jpg"
import React, { useState } from "react";
import { FaBug, FaCheck, FaTasks, FaThumbsUp, FaUser } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineDoneAll,
  MdOutlineMessage,
  MdTaskAlt,
} from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { tasks } from "../assets/data";
import Tabs from "../components/Tabs";
import { PRIOTITYSTYELS, TASK_TYPE, dateFormatter, formatter, getInitials } from "../utils";
import Loading from "../components/Loading";
import Button from "../components/Button";
import {  useGetSingleTaskQuery, usePostTaskActivityMutation } from "../redux/slices/api/taskApiSlice";

import { AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";



const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const bgColor = {
  high: "bg-red-200",
  medium: "bg-yellow-200",
  low: "bg-blue-200",
};

const TABS = [
  { title: "Task Detail", icon: <FaTasks /> },
  { title: "Evaluation", icon: <RxActivityLog /> },
];

const TASKTYPEICON = {
  bad: (
    <div className='w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white'>
      <AiOutlineClose size={124}/>
    </div>
  ),
  good: (
    <div className='w-7 h-7 rounded-full bg-yellow-600 flex items-center justify-center text-white'>
      <FaCheck size={14} />
    </div>
  ),
  fair: (
    <div className='w-7 h-7 flex items-center justify-center rounded-full bg-gray-500 text-white'>
      <FaCheck size={18} />
    </div>
  ),
  "very bad": (
    <div className='text-red-600'>
      <FaBug size={24} />
    </div>
  ),
  excellent: (
    <div className='w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-white'>
      <MdOutlineDoneAll size={20} />
    </div>
  ),
  "very good": (
    <div className='w-7 h-7 flex items-center justify-center rounded-full bg-blue-600 text-white'>
      <FaCheck size={16} />
    </div>
  ),
};

const act_types = [
  "Started",
  "Completed",
  "In Progress",
  "Commented",
  "Bug",
  "Assigned",
];
const evaluation_types = [
  "Very Bad",
  "Bad",
  "Fair",
  "Good",
  "Very Good",
  "Excellent",
 
];

const TaskDetails = () => {
  const { id } = useParams();
  const {data,isLoading,refetch}= useGetSingleTaskQuery(id)
  const [selected, setSelected] = useState(0);
  const task = data?.task;
 
 
  if(isLoading){ return (<div className='py-5'>
  <Loading/></div>)}
  return (
    <div className='w-full flex flex-col gap-3 mb-4 overflow-y-hidden'>
      <h1 className='text-2xl text-gray-600 font-bold'>{task?.title}</h1>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {selected === 0 ? (
          <>
            <div className='w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow-md p-8 overflow-y-auto'>
              {/* LEFT */}
              <div className='w-full md:w-1/2 space-y-8'>
                <div className='flex items-center gap-5'>
                  <div
                    className={clsx(
                      "flex gap-1 items-center text-base font-semibold px-3 py-1 rounded-full",
                      PRIOTITYSTYELS[task?.priority],
                      bgColor[task?.priority]
                    )}
                  >
                    <span className='text-lg'>{ICONS[task?.priority]}</span>
                    <span className='uppercase'>{task?.priority} Priority</span>
                  </div>

                  <div className={clsx("flex items-center gap-2")}>
                    <div
                      className={clsx(
                        "w-4 h-4 rounded-full",
                        TASK_TYPE[task.stage]
                      )}
                    />
                    <span className='text-black uppercase'>{task?.stage}</span>
                  </div>
                </div>

                <p className='text-gray-500'>
                  Created At: {new Date(task?.date).toDateString()}
                </p>

                <div className='flex items-center gap-8 p-4 border-y border-gray-200'>
                  <div className='space-x-2'>
                    <span className='font-semibold'>Assets :</span>
                    <span>{task?.assets?.length}</span>
                  </div>

                  <span className='text-gray-400'>|</span>

                  <div className='space-x-2'>
                    <span className='font-semibold'>Submitted-Task :</span>
                    <span>{task?.subTask?.length}</span>
                  </div>
                </div>

                <div className='space-y-4 py-6'>
                  <p className='text-gray-600 font-semibold test-sm'>
                    TASK TEAM
                  </p>
                  <div className='space-y-3'>
                    {task?.team?.map((m, index) => (
                      <div
                        key={index}
                        className='flex gap-4 py-2 items-center border-t border-gray-200'
                      >
                        <div
                          className={
                            "w-10 h-10 rounded-full text-white flex items-center justify-center text-sm -mr-1 bg-blue-600"
                          }
                        >
                          <span className='text-center'>
                          {getInitials(m?.surname)}
                          </span>
                        </div>

                        <div>
                          <p className='text-lg font-semibold'>{m?.surname} {m?.firstname}</p>
                          <span className='text-gray-500'>{m?.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='space-y-4 py-6'>
                  <p className='text-gray-500 font-semibold text-sm'>
                    SUBMITTED-TASKS 
                  </p>
                  <div className='space-y-8'>
                    {task?.subTask?.map((el, index) => (
                      <div key={index} className='flex gap-3'>
                        <div className='w-10 h-10 flex items-center justify-center rounded-full bg-violet-50-200'>
                          <MdTaskAlt className='text-violet-600' size={26} />
                        </div>

                        <div className='space-y-1'>
                          <div className='flex gap-2 items-center'>
                            <span className='text-sm text-gray-500'>
                              {new Date(el?.submitedAt).toDateString()}
                            </span>

                            <span className='px-2 py-0.5 text-center text-sm rounded-full bg-violet-100 text-violet-700 font-semibold'>
                              {el?.tag}
                            </span>
                          </div>

                          <p className='text-gray-700'>{el?.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* RIGHT */}
              <div className='w-full md:w-1/2 space-y-8'>
              <div className='w-full grid grid-cols-2 gap-4'>
                <p className='text-lg font-semibold'>TASK ASSETS</p>
                <p className='text-lg font-semibold'>SUBMITTED TASK ASSETS</p>
                </div>
                <div className='w-full grid grid-cols-2 gap-4'>
                  <span>
                {task?.assets?.map((el, index) => (
                    <Link to={el} >
                    <img
                      key={index}
                      src={el}
                      alt={task?.title}
                      className='w-full rounded h-28 md:h-36 2xl:h-52 cursor-pointer transition-all duration-700 hover:scale-125 hover:z-50'
                    />
                    </Link>
                  ))}
                  </span>
                  <span>
                {task?.subTask?.map((subTask, index) => (
                  <div key={index}>
                    {subTask.assets.map((asset, assetIndex) => (
                      <Link to={asset} key={assetIndex}>
                        {asset &&
                        <img
                          src={docs} 
                          alt={task?.title}
                          className='w-full rounded h-28 md:h-36 2xl:h-52 cursor-pointer transition-all duration-700 hover:scale-125 hover:z-50'
                        />
                        }
                      </Link>
                    ))}
                  </div>
                ))}
               </span>
                </div>
                
              </div>
              
            </div>
          </>
        ) : (
          <>
            <Activities evaluation={task?.evaluation} id={id} refetch={refetch}   subtask={task.subTask} />
          </>
        )}
      </Tabs>
    </div>
  );
};

const Activities = ({ evaluation, id ,refetch,subtask}) => {
  const [selected, setSelected] = useState(act_types[0]);
  const {user}=useSelector((state)=>state.auth)
  const [text, setText] = useState("");
  //const isLoading = false;
  const[postActivity,{isLoading}]=usePostTaskActivityMutation()
  const handleSubmit = async () => {
   
    try{
      
      const activityData={
       
        mark:text
      }
      const result = await postActivity({data:activityData,id})
      if(result?.data?.status){
      setText("")
      toast.success(result?.data?.message)
      refetch()}
      else{
        toast.error(result?.error?.data?.message)
      }
    }catch(error){
      toast.error(result?.error?.data?.message)
      console.log(error)
    }
  };

  const Card = ({ item }) => {
    return (
      <div className='flex space-x-4'>
       

        <div className='flex flex-col gap-y-1 mb-8'>
       
          {subtask.map((m,i)=>
          <div className="flex flex-row gap-4 mb-4">
           <div className='w-7 h-7 flex items-center justify-center rounded-full bg-gray-500 text-white'>
      <FaUser size={20} />
    </div>
           <p className='font-semibold text-gray-900'> {m?.by?.surname} {m?.by?.firstname}</p>
           <span>On {formatter(m?.submittedAt)}</span>
           </div>
          
          )}
             <h4 className='text-black font-semibold text-lg  mt-8'>PERFOMANCE</h4>
          <div className='text-gray-500 space-y-2'>
          <div className="flex flex-row gap-4 mb-4">
         
          
          <div className="mb-5 mt-5 flex flex-row gap-4">
          {TASKTYPEICON[item?.performance]}
          <h4 className='capitalize text-gray-600 font-semibold text-lg'>{item?.performance} </h4>
          </div>
           </div>
          </div>
          <h4 className='text-black font-semibold text-lg mb-4 '>MARK</h4>
          <div className='font-semibold border border-blue-400 p-2 flex justify-center '>{item?.mark}</div>
        </div>
      </div>
    );
  };
  

  return (
    <div className='w-full flex gap-10 2xl:gap-20 min-h-screen px-10 py-8 bg-white shadow rounded-md justify-between overflow-y-auto'>
      <div className='w-full md:w-1/2'>
        <h4 className='text-black font-semibold text-lg mb-5'>TASK SUBMITTED BY</h4>

        <div className='w-full'>
         
            <Card
              
            
              item={evaluation}
              
            />
         
        </div>
      </div>
{user?.data?.isSup &&
      <div className='w-full md:w-1/3'>
        <h4 className='text-gray-600 font-semibold text-lg mb-5'>
          Add Evaluation
        </h4>
        <div className='w-full flex flex-wrap gap-5'>
        
          <textarea
            rows={1}
            required={true}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='Type ......'
            className='bg-white w-full mt-10 border border-gray-300 outline-none p-4 rounded-md focus:ring-2 ring-blue-500'
          ></textarea>
          {isLoading ? (
            <Loading />
          ) : (
            <button
            disabled={Array.isArray(subtask) && subtask.length === 0}
             onClick={handleSubmit}
              className='bg-blue-600 text-white  px-3 py-2 outline-none rounded-full'
            >Submit</button>
          )}
        </div>
      </div>}
    </div>
  );
};
export default TaskDetails;