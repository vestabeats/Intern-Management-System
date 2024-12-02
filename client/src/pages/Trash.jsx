import clsx from "clsx";
import React, { useEffect, useState } from "react";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore,
} from "react-icons/md";
import { tasks } from "../assets/data";
import Title from "../components/Title";
import Button from "../components/Button";
import { PRIOTITYSTYELS, DUTY_TYPE, USER_ROLE } from "../utils";
import Loading from "../components/Loading";
import ConfirmatioDialog from "../components/Dialogs";
import Pagination from "../components/Pagination";
import { useDeleteRestoreUserMutation, useDeleteUserMutation, useGetAllUserQuery } from "../redux/slices/api/userApiSlice";
import { toast } from "sonner";
import { useSelector } from "react-redux";


const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Trash = () => {
  const {searchvalue}=useSelector((state)=>state.auth)
  const{data,isLoading,refetch}=useGetAllUserQuery({strQuery:"",isTrashed:true,search:searchvalue})
  const [currentPage, setCurrentPage]= useState(1)
  const recordsPerPage = 8
  const lastIndex = currentPage * recordsPerPage
  const firstIndex = lastIndex-recordsPerPage
  const[records,setRecords]=useState(null)
  const[nPage,setnPage]=useState(null)
  const [deleteUser] = useDeleteUserMutation()
  
  useEffect(() => {
    if (!isLoading && data) {
      refetch()
       setRecords(data.slice(firstIndex, lastIndex));
      setnPage(Math.ceil(data.length / recordsPerPage));
     
    }
  }, [isLoading, data, firstIndex, recordsPerPage]);
  const numbers = [...Array(nPage+1).keys()].slice(1)
 
  
  const [openDialog, setOpenDialog] = useState(false);

  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("delete");
  const [selected, setSelected] = useState("");


  const[deleteRestoreTask]=useDeleteRestoreUserMutation()

  const deleteRestoreHandler=async()=>{
    try{
      let result
      switch(type){
        case "delete":
          result = await deleteRestoreTask({id:selected,actionType:"delete"})
          break;
        case "restore":
          result = await deleteRestoreTask({id:selected,actionType:"restore"})
          break;
        case "deleteAll":
          result = await deleteRestoreTask({id:selected,actionType:"deleteAll"})
          break;
        case "restoreAll":
          result = await deleteRestoreTask({id:selected,actionType:"restoreAll"})
          break
        default:
          break
      }
      toast.success(result?.data?.message)
      setTimeout(()=>{
        setOpenDialog(false);
        refetch()
      })

    }catch(error){
      toast.error(error?.data?.message)
    }
  }
 
  const deleteAllClick = () => {
    setType("deleteAll");
    setMsg("Do you want to permenantly delete all items?");
    setOpenDialog(true);
  };

  const restoreAllClick = () => {
    setType("restoreAll");
    setMsg("Do you want to restore all items in the trash?");
    setOpenDialog(true);
  };

  const deleteClick = (id) => {
    setType("delete");
    setSelected(id);
    setOpenDialog(true);
  };

  const restoreClick = (id) => {
    setSelected(id);
    setType("restore");
    setMsg("Do you want to restore the selected item?");
    setOpenDialog(true);
  };
  if(isLoading){ return (<div className='py-5'>
  <Loading/></div>)}
   const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black  text-left'>
        <th className='py-2'>Surname</th>
        <th className='py-2'>FirstName</th>
        <th className='py-2'>Role</th>
        <th className='py-2'>Department</th>
        <th className='py-2 line-clamp-1'>Email</th>
      </tr>
    </thead>
  );

  const TableRow = ({ item }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
      <td className='py-2'>
        <div className='flex items-center gap-2'>
          <div
            className={clsx("w-4 h-4 rounded-full", DUTY_TYPE[item.role])}
          />
          <p className='w-full line-clamp-2 text-base text-black'>
            {item?.surname}
          </p>
        </div>
      </td>

      <td className='py-2 capitalize'>
        <div className={"flex gap-1 items-center"}>
          
          <span className=''>{item?.firstname}</span>
        </div>
      </td>

      <td className='py-2 capitalize text-center md:text-start'>
        {item?.role}
      </td>
      <td className='py-2 capitalize text-center md:text-start'>
        {item?.department}
      </td>
      <td className='py-2 text-sm'>{item?.email}</td>

      <td className='py-2 flex gap-1 justify-end'>
        <Button
          icon={<MdOutlineRestore className='text-xl text-gray-500' />}
          onClick={() => restoreClick(item._id)}
        />
        <Button
          icon={<MdDelete className='text-xl text-red-600' />}
          onClick={() => deleteClick(item._id)}
        />
      </td>
    </tr>
  );

  return (
    <>
    <div className='w-full md:px-1 px-0 mb-6'>
        <div className='flex items-center justify-between mb-8'>
          <Title title='Trashed Users' />

          <div className='flex gap-2 md:gap-4 items-center'>
            <Button
              label='Restore All'
              icon={<MdOutlineRestore className='text-lg hidden md:flex' />}
              className='flex flex-row-reverse gap-1 items-center  text-black text-sm md:text-base rounded-md 2xl:py-2.5'
              onClick={() => restoreAllClick()}
            />
            <Button
              label='Delete All'
              icon={<MdDelete className='text-lg hidden md:flex' />}
              className='flex flex-row-reverse gap-1 items-center  text-red-600 text-sm md:text-base rounded-md 2xl:py-2.5'
              onClick={() => deleteAllClick()}
            />
          </div>
        </div>
        <div className='bg-white px-2 md:px-6 py-4 shadow-md rounded'>
          <div className='overflow-x-auto'>
            <table className='w-full mb-5'>
              <TableHeader />
              <tbody>
                {records?.map((tk, id) => (
                  <TableRow key={id} item={tk} />
                ))}
              </tbody>
            </table>
          <Pagination numbers={numbers}currentPage={currentPage} setCurrentPage={setCurrentPage} nPage={nPage}/>

          </div>
        </div>
      </div>
      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        msg={msg}
        setMsg={setMsg}
        type={type}
        setType={setType}
        onClick={() => deleteRestoreHandler()}
      />
    </>
  )
}

export default Trash