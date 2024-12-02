import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import clsx from 'clsx';
import Title from '../components/Title';
import Loading from '../components/Loading';
import { dateFormatter, formatter } from '../utils';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ViewTheme from './ViewTheme';
import { useGetTraineeListQuery } from '../redux/slices/api/userApiSlice';

const OpenTrainee = () => {
    const params =useParams()
    const userid = params.id
  
    const{data,isLoading}=useGetTraineeListQuery({userId:userid})
    const navigate = useNavigate()
    const [openTheme, setOpenTheme] = useState(false);
    const [theme,setTheme]=useState(null)
   
    const [currentPage, setCurrentPage]= useState(1)
    const recordsPerPage = 8
    const lastIndex = currentPage * recordsPerPage
    const firstIndex = lastIndex-recordsPerPage
    const[records,setRecords]=useState(null)
    const[nPage,setnPage]=useState(null)
  
    useEffect(() => {
        if (!isLoading && data) {
          
           setRecords(data.slice(firstIndex, lastIndex));
          setnPage(Math.ceil(data.length / recordsPerPage));
         
        }
      }, [isLoading, data, firstIndex, recordsPerPage]);
      const numbers = [...Array(nPage+1).keys()].slice(1)
  
      const viewTheme = (val) => {
          setTheme(val)
          setOpenTheme(true);
      };
    
  if(isLoading){
      return(<div className='py-5'><Loading/></div>)
  }
    
      
      const TableHeader = () => (
        <thead className='border-b border-gray-300'>
            <tr className='text-black text-center'>
                <th className='py-2'>Surname</th>
                <th className='py-2'>First Name</th>
                <th className='py-2'>Date Of Birth</th>
                <th className='py-2'>Email</th>
                <th className='py-2'>Department</th>
               
                <th className='py-2'>Start Date</th>
                <th className='py-2'>End Date</th>
                <th className='py-2'>Role</th>
                <th className='py-2'>Theme</th>
                <th className='py-2'>Active</th>
            </tr>
        </thead>
    );

    const TableRow = ({item}) => (
        <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
            <td className='p-2'>{item?.surname}</td>
            <td className='p-2'>{item?.firstname}</td>
            <td className='p-2'>{dateFormatter(item?.dob)}</td>
            <td className='p-2'>{item?.email}</td>
            <td className='p-2'>{item?.department}</td>
            
            <td className='p-2'>{dateFormatter(item?.startdate)}</td>
            <td className='p-2'>{dateFormatter(item?.enddate)}</td>
            <td className='p-2'>{item?.role}</td>
          
            <td className='p-2'>
                <button
                    onClick={() => viewTheme(item?.theme)}
                    className={clsx("w-fit px-4 py-1 rounded-full", "bg-[#8f8bda]")}>
                    Theme
                </button>
            </td>
            <td>
                <button
                    className={clsx("w-fit px-4 py-1 rounded-full", item?.isActive  ? "bg-blue-200" : "bg-yellow-100")}>
                    {item?.isActive ? "Active" : "Disabled"}
                </button>
            </td>
        </tr>
    );
      
      
      
    
      return (
        <>
          <div className='w-full md:px-1 px-0 mb-6'>
            <div className='flex items-center justify-between mb-8'>
            <Title title='List of Trainees' />
            </div>
    
            <div className='bg-white px-2 md:px-4 py-4 shadow-md rounded overflow-x-auto'>
              <table className='table-auto w-full mb-5'>
                <TableHeader />
                <tbody>
                  {records?.map((item, id) => (
                    <TableRow key={id} item={item} />
                  ))}
                </tbody>
              </table>
              <Pagination numbers={numbers} currentPage={currentPage} setCurrentPage={setCurrentPage} nPage={nPage} />
            </div>
          </div>
          <ViewTheme open={openTheme} setOpen={setOpenTheme} theme={theme} />
        </>
      );
}

export default OpenTrainee