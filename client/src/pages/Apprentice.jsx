import React, { useEffect, useState } from 'react'
import { dateFormatter, formatter, getInitials } from '../utils';
import Button from '../components/Button';
import clsx from 'clsx';
import Title from '../components/Title';
import { IoMdAdd } from 'react-icons/io';
import ViewTheme from '../components/ViewTheme';
import AddIntern from '../components/AddIntern';
import { useLocation, useParams } from 'react-router-dom';
import { useDeleteUserMutation, useGetAllUserQuery, useUserActionMutation } from '../redux/slices/api/userApiSlice';
import Pagination from '../components/Pagination';
import ConfirmatioDialog, { UserAction } from '../components/Dialogs';
import { toast } from 'sonner';
import moment from "moment";
import Loading from '../components/Loading';
import { useSelector } from 'react-redux';
import { MdDelete, MdOutlineEdit, MdOutlineLock } from 'react-icons/md';
import AdminChangePassword from '../components/AdminChangePassword';

const Apprentice = () => {
  const [openAction, setOpenAction] = useState(false);
  const [openPass, setOpenPass] = useState(false);
  const [changP,setChangP] = useState(null);
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const[selected,setSelected]=useState(null)
    const [openTheme,setOpenTheme]=useState(false)
    const params = useParams();
    const duty = params?.duty || "";
    const {searchvalue}=useSelector((state)=>state.auth)
    const{data,isLoading,refetch}=useGetAllUserQuery({strQuery:duty,isTrashed:false,search:searchvalue})
    const [currentPage, setCurrentPage]= useState(1)
    const recordsPerPage = 8
    const lastIndex = currentPage * recordsPerPage
    const firstIndex = lastIndex-recordsPerPage
    const[records,setRecords]=useState(null)
    const[nPage,setnPage]=useState(null)
    const[theme,setTheme]=useState(null)
    const [deleteUser] = useDeleteUserMutation()
    const location = useLocation();
    const [userAction]=useUserActionMutation()
    console.log(data)
    useEffect(() => {
      if (!isLoading && data) {
        refetch()
         setRecords(data.slice(firstIndex, lastIndex));
        setnPage(Math.ceil(data.length / recordsPerPage));
       
      }
    }, [isLoading, data,location, firstIndex, recordsPerPage]);
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

    const viewTheme=(val)=>{
      setTheme(val)
        setOpenTheme(true)

    }
    if(isLoading){ return (<div className='py-5'>
    <Loading/></div>)}
    const TableHeader = () => (
        <thead className='border-b  border-gray-300'>
          <tr className='text-black  text-center'>
            <th className='py-2'>Surname</th>
            <th className='py-2'>FirstName</th>
            <th className='py-2'>D.O.B</th>
            <th className='py-2'>Email</th>
            <th className='py-2'>Department</th>
         
            <th className='py-2'>Start Date</th>  
             <th className='py-2'>End Date</th>
            <th className='py-2'>Role</th>
            <th className='py-2'>Supervisor</th>
            <th className='py-2'>Theme</th>
            <th className='py-2'>Active</th>
          </tr>
        </thead>
      );

      const TableRow = ({user}) => (
        <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10 cursor-pointer'>
          <td className='p-2'>{user?.surname}</td>
          <td className='p-2'>{user?.firstname}</td>
          <td className='p-2'>{formatter(user?.dob)}</td>
          <td className='p-2'>{user?.email}</td>
          <td className='p-2'>{user?.department}</td>
          
          <td className='p-2'>{formatter(user?.startdate)}</td>
          <td className='p-2'>{formatter(user?.enddate)}</td>
          <td className='p-2'>{user?.role}</td>
          <td className='p-2'> {user?.supervisor ? `${user.supervisor.surname}` : ''}</td>
          <td className='p-2'><button
              onClick={() => viewTheme(user?.theme)}
              className={clsx(
                "w-fit px-4 py-1 rounded-full",
                true? "bg-[#8f8bda]" : "bg-yellow-100"
              )}
            >
              Theme
            </button></td>
    
          <td>
            <button
              onClick={() => userStatusClick(user)}
              className={clsx(
                "w-fit px-4 py-1 rounded-full",
                user?.isActive? "bg-blue-200" : "bg-yellow-100"
              )}
            >
              {user?.isActive? "Active" : "Disabled"}
            </button>
          </td>
    
          <td className='p-2 flex gap-1 justify-end'>
          <Button
          icon={<MdOutlineEdit className='text-xl text-blue-600  ' />}
          onClick={() => editClick(user)}
        />
            <Button icon={ <MdOutlineLock className='text-xl text-gray-600 '/>}
           onClick={() => setChangePassword(user?._id)}/>
             <Button
          icon={<MdDelete className='text-xl text-red-600 ' />}
          onClick={() => deleteClick(user._id)}
        />
          </td>
        </tr>
      );


  return (
   <>
    <div className='w-full md:px-1 px-0 mb-6'>
        <div className='flex items-center justify-between mb-8'>
          <Title title='List Of Active Apprentices' />
          <Button
            label='Add New Apprentice'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5'
            onClick={() =>   setOpen(true)}
          />
        </div>

        <div className='bg-white px-2 md:px-4 py-4 shadow-md rounded'>
          <div className='overflow-x-auto'>
            <table className='table-auto w-full mb-5'>
              <TableHeader />
              <tbody>
              {records?.map((user, index) => (
                  <TableRow user={user} key={index}/>
              ))}
              </tbody>
            </table>
            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} numbers={numbers} nPage={nPage}/>
          </div>
        </div>
      </div>
      <AddIntern open={open} setOpen={setOpen} userData={selected} setUserData={setSelected}  refetch={refetch}/>
    <ViewTheme open={openTheme} setOpen={setOpenTheme} theme={theme}/>
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
  )
}

export default Apprentice