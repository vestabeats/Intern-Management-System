import React, { useEffect, useState } from 'react'
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

const DEPART = ["DSI", "DHR", "DSR"];
const Role = ["supervisor"];
const AddSupervisor = ({ open, setOpen, userData, refetch }) => {
  const [team, setTeam] = useState([]);
  const [department, setDpt] = useState(DEPART[0]);
  const [role, setRole] = useState(Role[0]);

  const defaultValues = userData ?? {};

  const { user } = useSelector((state) => state.auth);
  console.log(defaultValues);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });
  const [addNewUser, { isLoading }] = useRegisterMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateMutation();

  const handleOnSubmit = async (data) => {
    try {
      if (userData) {
        const result = await updateUser({ ...data, role, department, _id: userData._id });
        toast.success(result?.data?.message);
        refetch();
        if (userData._id === user.data._id) {
          dispatch(setCredentials({ data: result.data.user }));
        }
      } else {
        const result = await addNewUser({ ...data, password: data.email, role, department });
        toast.success("New user added successfully");
        refetch();
      }
      setTimeout(() => {
        setOpen(false);
      }, 1500);
    } catch (error) {
      toast.error("something went wrong");
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className='gap-4 flex flex-col justify-center w-full'>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            {userData ? "UPDATE PROFILE" : "ADD NEW SUPERVISOR"}
          </Dialog.Title>

          <div className='grid grid-cols-2 gap-6'>
            <div className=''>
              <Textbox
                placeholder='Surname'
                type='text'
                name='surname'
                label='Surname'
                className='w-full rounded mb-4'
                register={register("surname", {
                  required: "Surname is required!",
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
                placeholder='First Name'
                type='text'
                name='firstname'
                label='First Name'
                className='w-full rounded mb-4'
                register={register("firstname", {
                  required: "First Name is required!",
                })}
                error={errors.firstname ? errors.firstname.message : ""}
              />

              <Textbox
                placeholder='Phone Number'
                type='number'
                name='phonenumber'
                label='Phone Number'
                className='w-full rounded mb-4'
                register={register("phonenumber", {
                  required: "User phone number is required!",
                  pattern: {
                    value: /^\d{10}$/, // Assuming 10-digit mobile numbers
                    message: "Please enter a valid 10-digit mobile phone number",
                  }
                })}
                error={errors.phonenumber ? errors.phonenumber.message : ""}
              />

              <SelectList
                label='Role'
                lists={Role}
                selected={role}
                setSelected={setRole}
              />
            </div>
          </div>

          {isLoading || isUpdating ? (
            <div className='py-5'>
              <Loading />
            </div>
          ) : (
            <div className='py-3 mt-4 sm:flex sm:flex-row-reverse'>
              <Button
                type='submit'
                className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto'
                label='Submit'
              />

              <Button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
                onClick={() => setOpen(false)}
                label='Cancel'
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  )
}

export default AddSupervisor;
