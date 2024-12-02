import React from 'react'
import { Dialog } from "@headlessui/react";
import clsx from "clsx";
import { useNavigate} from 'react-router-dom';
import ModalWrapper from "./ModalWrapper";
import Button from "./Button";
import { getInitials } from '../utils';

export default function ProfileView({
  open,
  setOpen,
  userData
 
}) {
  const closeDialog = () => {
   
    setOpen(false);
  };
const navigate=useNavigate()
const switchPro=()=>{
    setOpen(false)
    navigate("/update-profile")
}
  return (
    <>
      <ModalWrapper open={open} setOpen={closeDialog}>
        <div className='py-4 w-full flex flex-col gap-4 items-center justify-center'>
          <Dialog.Title as='h3' className=''>
            <p
              className={clsx(
                "p-3 rounded-full text-white bg-blue-600 "
               
              )}
            >
              {getInitials(userData?.surname)}
            </p>
          </Dialog.Title>
          <div className='grid grid-cols-2 gap-6'>
          <p className='text-center text-gray-500'>
             Full Name :
          </p>
        
          <p className='text-center text-gray-500'>
            {userData?.firstname.toUpperCase()} {userData?.surname.toUpperCase()}
          </p>
              </div>
              <div className='grid grid-cols-2 gap-6'>
          <p className='text-center text-gray-500'>
             Email :
          </p>
        
          <p className='text-center text-gray-500'>{userData?.email}
          </p>
              </div>
        <div className='grid grid-cols-2 gap-14'>
          <p className='text-center text-gray-500'>
        Your Role :
          </p>
        
          <p className='text-center text-gray-500'>
            {userData?.role}
          </p>
         
              </div>

          <div className='bg-gray-50 py-3 sm:flex sm:flex-row-reverse gap-4'>
            { userData?.isAdmin &&
            <Button
              type='button'
              className={clsx(
                " px-8 text-sm font-semibold text-blue-600 sm:w-auto border"
               
              )}
              onClick={() => switchPro()}
              label= "Update Profile"
            />
            }
            <Button
              type='button'
              className='bg-white px-8 text-sm font-semibold text-gray-900 sm:w-auto border'
              onClick={() => closeDialog()}
              label='Cancel'
            />
          </div>
        </div>
      </ModalWrapper>
    </>
  );
}

