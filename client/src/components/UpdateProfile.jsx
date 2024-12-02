import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loading";
import Button from "./Button";
import SelectList from './SelectList';
import { useUpdateMutation } from "../redux/slices/api/userApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { useRegisterMutation } from '../redux/slices/api/authApiSlice';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
const DEPART =["DSI","DHR","DSR"]
const Role=["admin"]
const UpdateProfile= ({open,setOpen,userData,refetch}) => {
  const [team,setTeam]=useState([])

  const [department,setDpt]=useState(DEPART[0])
  const [role,setRole]=useState(Role[0])
  const { user } = useSelector((state) => state.auth);
  let defaultValues = user?.data ?? {};

  const navigate =useNavigate()
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({defaultValues});

  const [updateUser,{isLoading:isUpdating}]= useUpdateMutation()
 const closeDialog=()=>{
    navigate("/dashboard")
 }
  const handleOnSubmit =async(data) => {
    try{
     
        const result = await updateUser({...data,role,department,_id:user?.data?._id})
        dispatch(setCredentials({data:result.data.user}))
        toast.success(result?.data?.message)
        navigate("/dashboard")
        refetch()
       
    }catch(error){
      toast.error("something went wrong")
    }
  };
  return (
    <>
     
     <form onSubmit={handleSubmit(handleOnSubmit)} className='gap-4 flex flex-col justify-center w-full'>
          
            <h2
            className='text-base font-bold leading-6 text-gray-900 mb-4'>
          
            UPDATE PROFILE
         </h2>
          <div className='grid grid-cols-2 gap-6'>
          <div className=''>
            <Textbox
              placeholder='Surname'
              type='text'
              name='surname'
              label='Surname'
              className='w-full rounded mb-4'
              register={register("surname", {
                required: "surname is required!",
              })}
              error={errors.surname ? errors.surname.message : ""}
            />
            
            
            <Textbox
              placeholder='Email Address'
              type='email'
              name='email'
              label='Email Address'
              className='w-full rounded mb-4'
              register={register("email", {
                required: "Email Address is required!",
              })}
              error={errors.email ? errors.email.message : ""}
            />

           
             <SelectList
                label='Department'
                lists={DEPART}
                selected={department}
                setSelected={setDpt}
                
              />

          </div>
          <div className=''>
          <Textbox
              placeholder='FirstName'
              type='text'
              name='firstname'
              label='FirstName'
              className='w-full rounded mb-4'
              register={register("firstname", {
                required: "FirstName is required!",
              })}
              error={errors.firstname ? errors.firstname.message : ""}
            />
          
           
             <Textbox
              placeholder='Phone Number'
              type='text'
              name='phonenumber'
              label='Phone Number'
              className='w-full rounded mb-4'
              register={register("phonenumber", {
                required: "User phone number is required!",
              })}
              error={errors.phonenumber ? errors.role.phonenumber : ""}
            />
            
             <SelectList
                label='Role'
                lists={Role}
                selected={role}
                setSelected={setRole}
                
              />
           
           
          </div>
          </div>

          {isUpdating? (
            <div className='py-5'>
              <Loading />
            </div>
          ) : (
            <div className='flex justify-center py-3 mt-4 sm:flex sm:flex-row-reverse gap-20'>
              <Button
                type='submit'
                className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto'
                label='Submit'
              />

              <Button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
                onClick={() => closeDialog()}
                label='Cancel'
              />
            </div>
          )}
        </form>
     
    </>
  )
}

export default UpdateProfile