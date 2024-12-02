import React, { useEffect, useState } from 'react';
import { dateFormatter, getInitials } from '../utils';
import Button from '../components/Button';
import clsx from 'clsx';
import Title from '../components/Title';
import { IoMdAdd } from 'react-icons/io';
import ViewTheme from '../components/ViewTheme';
import { useDeleteUserMutation, useGetInactiveListQuery, useGetTraineeListQuery, useUserActionMutation } from '../redux/slices/api/userApiSlice';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';
import { useLocation, useNavigate } from 'react-router-dom';
import ConfirmatioDialog, { UserAction } from '../components/Dialogs';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { MdDelete, MdOutlineEdit, MdOutlineLock } from 'react-icons/md';
import AddIntern from '../components/AddIntern';
import AdminChangePassword from '../components/AdminChangePassword';

const InActive = () => {
  const [deleteUser] = useDeleteUserMutation()
    const location = useLocation()
    const {searchvalue}=useSelector((state)=>state.auth)
    const [openPass, setOpenPass] = useState(false);
    const [changP,setChangP] = useState(null);
    const [openAction, setOpenAction] = useState(false);
    const[selected,setSelected]=useState(null)
    const{data,isLoading,refetch}=useGetInactiveListQuery({search:searchvalue})
    const [currentPage, setCurrentPage]= useState(1)
    const recordsPerPage = 8
    const lastIndex = currentPage * recordsPerPage
    const firstIndex = lastIndex-recordsPerPage
    const[records,setRecords]=useState(null)
    const[nPage,setnPage]=useState(null)
    const [userAction]=useUserActionMutation()
    const [openDialog, setOpenDialog] = useState(false);
    const [open, setOpen] = useState(false);
    useEffect(() => {
      if (!isLoading && data) {
        refetch()
        
         setRecords(data.slice(firstIndex, lastIndex));
        setnPage(Math.ceil(data.length / recordsPerPage));
       
      }
    }, [isLoading, data, firstIndex,location, recordsPerPage]);
    const numbers = [...Array(nPage+1).keys()].slice(1)
    const deleteClick = (id) => {
      setSelected(id);
      setOpenDialog(true);
    };
      const editClick = (el) => {
   
        setSelected(el);
        setOpen(true);
      };
      const deleteHandler = async() => {
        try{
          const result = await deleteUser(selected)
          refetch()
          toast.success(result?.data.message)
          setSelected(null)
          setTimeout(()=>{
            setOpenDialog(false)
          },50)
        }catch(error){
          toast.error(error?.message)
        }
      };

    const userActionHandler = async() => {
        try{
          const result = await userAction({isActive:!selected?.isActive, id:selected?._id})
          refetch()
          toast.success(result?.data.message)
          setSelected(null)
          setTimeout(()=>{
            setOpenAction(false)
          },500)
        }catch(error){
          toast.error(error?.data.message)
        }
      };
      const setChangePassword=(el)=>{
        setChangP(el)
        setOpenPass(true)
      }
      const userStatusClick=(el)=>{
        setSelected(el);
        setOpenAction(true)
      }
   
  
if(isLoading){
    return(<div className='py-5'><Loading/></div>)
}
    const TableHeader = () => (
        <thead className='border-b text-start border-gray-300'>
            <tr className='text-black text-start'>
                <th className='py-2'>Surname</th>
                <th className='py-2'>First Name</th>
              
               
                <th className='py-2'>Department</th>
               
               
                <th className='py-2'>Role</th>
             
                
                <th className='py-2'>Active</th>
            </tr>
        </thead>
    );

    const TableRow = ({item}) => (
        <tr className='border-b border-gray-200 text-gray-600 text-center hover:bg-gray-400/10 cursor-pointer'>
            <td className='p-2'>{item?.surname}</td>
            <td className='p-2'>{item?.firstname}</td>
          
           
            <td className='p-2'>{item?.department}</td>
            
          
            <td className='p-2'>{item?.role}</td>
           
           
            <td>
            <button
              onClick={() => userStatusClick(item)}
              className={clsx(
                "w-fit px-1 py-1 rounded-full",
                item?.isActive? "bg-blue-200" : "bg-yellow-100"
              )}
            >
              {item?.isActive? "Active" : "Disabled"}
            </button>
            </td>
            <td className='p-2 flex gap-4 justify-end'>
           
           <Button
              icon={<MdOutlineEdit className='text-xl text-blue-600  ' />}
              onClick={() => editClick(item)}
            />
               <Button icon={ <MdOutlineLock className='text-xl text-gray-600 '/>}
           onClick={() => setChangePassword(item?._id)}/>
                 <Button
              icon={<MdDelete className='text-xl text-red-600 ' />}
              onClick={() => deleteClick(item._id)}
            />
              </td>
        </tr>
    );

    return (
        <>
            <div className='w-full md:px-1 px-0 mb-6'>
                <div className='flex items-center justify-between mb-8'>
                    <Title title='InActive Users' />
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
            <AddIntern open={open} setOpen={setOpen} userData={selected} setUserData={setSelected} refetch={refetch}/>
            <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
            <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={userActionHandler}
      />
         <AdminChangePassword open={openPass} setOpen={setOpenPass} userId={changP} />    
        </>
    );
}

export default InActive