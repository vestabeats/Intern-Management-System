import React from 'react'
import ModalWrapper from './ModalWrapper'
import { Dialog } from '@headlessui/react'
import Button from './Button'

const ViewTheme = ({open,setOpen,theme}) => {
  return (
    <>
     <ModalWrapper open={open} setOpen={setOpen}>
    <div className="py-4 w-full flex flex-col gap-4 items-center justify-center">
        <Dialog.Title as="h3" className="font-semibold text-lg">
           Theme
        </Dialog.Title>
        <p className='text-start text-gray-500'>{theme}</p>
        <Button type="button" label="Ok" className="bg-blue-400 px-8 mt-3 text-sm font-semibold text-gray-900 sm:w-auto border" onClick={()=>setOpen(false)}/>
    </div>
    </ModalWrapper>
    
    </>
  )
}

export default ViewTheme