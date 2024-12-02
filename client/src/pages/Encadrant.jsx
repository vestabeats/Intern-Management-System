import React, { useEffect, useState } from 'react';
import { getInitials } from '../utils';
import Button from '../components/Button';
import clsx from 'clsx';
import Title from '../components/Title';
import { IoMdAdd } from 'react-icons/io';
import ViewTheme from '../components/ViewTheme';
import { useGetSupervisorQuery } from '../redux/slices/api/userApiSlice';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';

const Encadrant = () => {
 
    const{data,isLoading}=useGetSupervisorQuery()
    const navigate = useNavigate()
    const [currentPage, setCurrentPage]= useState(1)
    const recordsPerPage = 8
    const lastIndex = currentPage * recordsPerPage
    const firstIndex = lastIndex-recordsPerPage
    const[records,setRecords]=useState(null)
    const[nPage,setnPage]=useState(null)
   
    
    useEffect(() => {
        console.log("Data:", data);
        if (!isLoading && data) {
          // If data is an array of records
          if (Array.isArray(data)) {
            setRecords(data.slice(firstIndex, lastIndex));
            setnPage(Math.ceil(data.length / recordsPerPage));
          } else {
            // If data is a single record
            setRecords([data]); // Wrap the single record in an array
            setnPage(1); // Set nPage to 1 since there's only one page
          }
        }
      }, [isLoading, data, firstIndex, recordsPerPage]);
      
      
    const numbers = [...Array(nPage+1).keys()].slice(1)
    if(isLoading){
        return(<div className='py-5'><Loading/></div>)
    }

  const TableHeader = () => (
      <thead className='border-b border-gray-300'>
          <tr className='text-black text-left'>
              <th className='py-2'>Surname</th>
              <th className='py-2'>First Name</th>
              <th className='py-2'>Email</th>
              <th className='py-2'>Phone Number</th>
              <th className='py-2'>Department</th>
              <th className='py-2'>Role</th>
              <th className='py-2'>Message</th>
          </tr>
      </thead>
  );

  const TableRow = ({item}) => (
      <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
          <td className='p-2'>{item?.supervisor?.surname}</td>
          <td className='p-2'>{item?.supervisor?.firstname}</td>
          <td className='p-2'>{item?.supervisor?.email}</td>
          <td className='p-2'>{item?.supervisor?.phonenumber}</td>
          <td className='p-2'>{item?.supervisor?.department}</td>
          <td className='p-2'>{item?.supervisor?.role}</td>
          <td className='p-2'>
              <button onClick={() => navigate(`/chatbox/${item?.supervisor?._id}`)} className={clsx("w-fit px-4 py-1 rounded-full", "bg-green-400")}>
                  Message
              </button>
          </td>
         
      </tr>
  );
  

  return (
      <>
          <div className='w-full md:px-1 px-0 mb-6'>
              <div className='flex items-center justify-between mb-8'>
                  <Title title='Your Supervisor' />
              </div>

              <div className='bg-white px-2 md:px-4 py-4 shadow-md rounded overflow-x-auto'>
                  <table className='table-auto w-full mb-5'>
                      <TableHeader />
                      <tbody>
                            {records?.map((item,id)=>(
                            <TableRow key={id} item={item}/>
                        ))}
                        </tbody>
                  </table>
                  <Pagination numbers={numbers}currentPage={currentPage} setCurrentPage={setCurrentPage} nPage={nPage}/>
              </div>
          </div>

         
      </>
  );
 
}

export default Encadrant