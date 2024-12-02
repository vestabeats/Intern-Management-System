import React, { useState } from "react";
import TaskCard from "./TaskCard";
import Pagination from "./Pagination";

const BoardView = ({ tasks }) => {
  const [currentPage, setCurrentPage]= useState(1)
  const recordsPerPage = 9
  const lastIndex = currentPage * recordsPerPage
  const firstIndex = lastIndex-recordsPerPage
 
  
 let  records= (tasks.slice(firstIndex, lastIndex));
  let nPage= (Math.ceil(tasks.length / recordsPerPage));
  const numbers = [...Array(nPage+1).keys()].slice(1)
  return (
    <>
    <div className='w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10'>
      {records.map((task, index) => (
        <TaskCard task={task} key={index}  />
      ))}
     
    </div>
    {records.length > 0 &&
    <Pagination numbers={numbers}currentPage={currentPage} setCurrentPage={setCurrentPage} nPage={nPage}/>}
    </>
  );
};

export default BoardView;