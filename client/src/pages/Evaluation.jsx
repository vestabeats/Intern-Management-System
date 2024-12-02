import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import Title from '../components/Title';
import { useGetAllTaskQuery } from '../redux/slices/api/taskApiSlice';
import Loading from '../components/Loading';
import { dateFormatter, formatter } from '../utils';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Evaluation = () => {
    const {user}=useSelector((state)=>state.auth)
  const { data, isLoading, refetch } = useGetAllTaskQuery({ strQuery: "", search: "" });
  const location=useLocation()
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const [records, setRecords] = useState([]);
  const [nPage, setnPage] = useState(0);


  useEffect(() => {
    refetch()
    if (!isLoading && data && Array.isArray(data.tasks)) {
        
          setRecords(data.tasks.slice(firstIndex, lastIndex));
      setnPage(Math.ceil(data.tasks.length / recordsPerPage));
    }
  }, [isLoading, data, firstIndex,location, recordsPerPage]);

  const numbers = [...Array(nPage + 1).keys()].slice(1);

  if (isLoading) {
    return <div className='py-5'><Loading /></div>;
  }

  console.log("evaluations", records);

  const TableHeader = () => (
    <thead className='border-b text-start border-gray-300'>
      <tr className='text-black text-start'>
        <th className='py-2'>Surname</th>
        <th className='py-2'>First Name</th>
        <th className='py-2'>Role</th>
        <th className='py-2'>Task Title</th>
        <th className='py-2'>Task Due Date</th>
        <th className='py-2'>Submission Date</th>
        <th className='py-2'>Perfomance</th>
        <th className='py-2'>Mark</th>
        
        
      </tr>
    </thead>
  );

  const TableRow = ({ item }) => (
    
    <>
    {user?.data?.isSup ? (
      // Iterate over item.team if user is a supervisor
      item?.team.map((m, i) => (
        <tr key={i} className='border-b border-gray-200 text-center text-gray-600 hover:bg-gray-400/10'>
          <td className='p-2'>{m?.surname}</td>
          <td className='p-2'>{m?.firstname}</td>
          <td className='p-2'>{m?.role}</td>
          <td className='p-2'>{item?.title}</td>
          <td className='p-2'>{formatter(item?.date)}</td>
          <td className='p-2'>{item?.subTask?.[0]?.title ? dateFormatter(item?.subTask?.[0]?.submitedAt) : "pending"}</td>
          <td className='p-2'>{item?.evaluation.performance}</td>
          <td className='p-2'>{item?.evaluation.mark}</td>
        </tr>
      ))
    ) : (
      // Iterate over item.subTask if user is not a supervisor
      item?.team.map((m, i) => (
        // Display only if m.by._id matches user's _id
        m?._id === user?.data?._id && (
          <tr key={i} className='border-b border-gray-200 text-center text-gray-600 hover:bg-gray-400/10'>
            <td className='p-2'>{m?.surname}</td>
            <td className='p-2'>{m?.firstname}</td>
            <td className='p-2'>{m?.role}</td>
            <td className='p-2'>{item?.title}</td>
            <td className='p-2'>{formatter(item?.date)}</td>
            <td className='p-2'>{item?.subTask?.[0]?.title ? dateFormatter(item?.subTask?.[0]?.submitedAt) : "pending"}</td>
            <td className='p-2'>{item?.evaluation.performance}</td>
            <td className='p-2'>{item?.evaluation.mark}</td>
          </tr>
        )
      ))
    )}
  </>
  
  
  );

  return (
    <>
      <div className='w-full md:px-1 px-0 mb-6'>
        <div className='flex items-center justify-between mb-8'>
          <Title title={user?.data?.isSup?'Evaluation Of  Trainees':'Evaluation'} />
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
    </>
  );
};

export default Evaluation;
