import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import Title from '../components/Title';
import { useGetAllUserHistoryQuery } from '../redux/slices/api/userApiSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { setEndDate, setStartDate } from '../redux/slices/authSlice';
import { formatter } from '../utils';
import { FaUsers } from 'react-icons/fa';

const History = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { startDate, endDate,searchvalue, user } = useSelector((state) => state.auth);
  const { data, isLoading, refetch } = useGetAllUserHistoryQuery({ start: startDate, end: endDate ,search:searchvalue});
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const [records, setRecords] = useState(null);
  const [nPage, setnPage] = useState(null);

  useEffect(() => {
    refetch();
    if (!isLoading && data && Array.isArray(data)) {
      setRecords(data.slice(firstIndex, lastIndex));
      setnPage(Math.ceil(data.length / recordsPerPage));
    }
  }, [isLoading, data, firstIndex, location, recordsPerPage]);

  const numbers = [...Array(nPage + 1).keys()].slice(1);
  console.log(data);
  if (isLoading) {
    return (
      <div className='py-5'>
        <Loading />
      </div>
    );
  }
  const Card = () => {
    return (
      <div className='w-full  h-32 bg-white p-5 shadow-md rounded-md flex items-center justify-between'>
        <div className='h-full flex flex-1 flex-col justify-between'>
          <p className='text-base text-gray-600'>Total Trainees</p>
          <span className='text-2xl font-semibold'>{data?.length}</span>
          <p className='text-base text-gray-600'>{startDate&&endDate?`Trainee from ${startDate} to${endDate}`:startDate?`Trainee Started In ${startDate}`:endDate?`Trainee Finished In ${endDate}`:'From All The Years'}</p>
        </div>

        <div
          className=
            "w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white"
            
        
        >
          <FaUsers size={24}/>
        </div>
      </div>
    );
  };

  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black text-left'>
        <th className='py-2'>Surname</th>
        <th className='py-2'>First Name</th>
        <th className='py-2'>Supervisor</th>
        <th className='py-2'>Role</th>
        <th className='py-2'>Department</th>
        <th className='py-2'>Start Date</th>
        <th className='py-2'>End Date</th>
        <th className='py-2'>Evaluations</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
      <td className='p-2'>{user?.surname}</td>
      <td className='p-2'>{user?.firstname}</td>
      <td className='p-2'>{user?.supervisor ? `${user.supervisor.surname}` : ''}</td>
      <td className='p-2'>{user?.role}</td>
      <td className='p-2'>{user?.department}</td>
      <td className='p-2'>{formatter(user?.startdate)}</td>
      <td className='p-2'>{formatter(user?.enddate)}</td>
      <td className='p-2'>
        <button onClick={()=>navigate(`/openevaluation/${user?._id}`)} className='w-fit px-4 py-1 rounded-full text-white bg-violet-600'>Open</button>
      </td>
    </tr>
  );

  const handleStartDateChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      dispatch(setStartDate(value));
    }
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      dispatch(setEndDate(value));
    }
  };

  return (
    <div>
      <div className='grid grid-cols-3 justify-between'>
        <div className=''>
          <h4 className='text-black font-bold'>Enter Start Date</h4>
          <input
            type='number'
            label='start date'
            placeholder='year eg: 2022'
            value={startDate}
            className='bg-white w-[8rem] border border-gray-300 outline-none p-2 rounded-md focus:ring-2 ring-blue-500'
            onChange={handleStartDateChange}
          />
        </div>
        <div>
          <h4 className='text-black font-bold'>Enter End Date</h4>
          <input
            type='number'
            label='end date'
            placeholder='year eg: 2023'
            value={endDate}
            className='bg-white w-[8rem] border border-gray-300 outline-none p-2 rounded-md focus:ring-2 ring-blue-500'
            onChange={handleEndDateChange}
          />
        </div>
        <Card/>
      </div>
      {/*Tables */}
      <div className='w-full md:px-1 px-0 mb-6'>
        <div className='flex items-center justify-between mt-16 mb-8'>
          <Title title='History Of Trainees' />
        </div>

        <div className='bg-white px-2 md:px-4 py-4 shadow-md rounded overflow-x-auto'>
          <table className='table-auto w-full mb-5'>
            <TableHeader />
            <tbody>
              {records?.map((user, index) => (
                <TableRow user={user} key={index} />
              ))}
            </tbody>
          </table>
          <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} numbers={numbers} nPage={nPage} />
        </div>
      </div>
    </div>
  );
};

export default History;
