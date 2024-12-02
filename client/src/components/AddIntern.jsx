import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loading";
import Button from "./Button";
import SelectList from './SelectList';
import SupervisorList from './SupervisorList';
import { useRegisterMutation } from '../redux/slices/api/authApiSlice';
import { useUpdateMutation } from '../redux/slices/api/userApiSlice';
import { toast } from 'sonner';
import { setCredentials } from '../redux/slices/authSlice';

const DEPART = ["DSI", "DHR", "DSR"];
const Role = ["intern", "apprentice"];

const AddIntern = ({ open, setOpen, userData, refetch, setUserData }) => {
  const { user } = useSelector((state) => state.auth);
  const [role, setRole] = useState(Role[0]);
  const [supervisor, setSupervisor] = useState("");
  const [department, setDpt] = useState(DEPART[0]);

  const defaultValues = {
    surname: userData?.surname || "",
    firstname: userData?.firstname || "",
    dob: userData?.dob || "",
    email: userData?.email || "",
    startdate: userData?.startdate || "",
    enddate: userData?.enddate || "",
    theme: userData?.theme || ""
  };

  const cancelBtn = () => {
    setOpen(false);
    setUserData(null);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({ defaultValues });

  const dispatch = useDispatch();
  const [addNewUser, { isLoading }] = useRegisterMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateMutation();

  const handleOnSubmit = async (data) => {
    try {
      if (userData) {
        const result = await updateUser({ ...data, role, department, _id: userData._id, supervisor });
        toast.success(result?.data?.message);
        refetch();
        if (userData._id === user.data._id) {
          dispatch(setCredentials({ data: result.data.user }));
        }
      } else {
        const result = await addNewUser({ ...data, password: data.email, role, department, supervisor });
        toast.success("New user added successfully");
        refetch();
      }
      setTimeout(() => {
        setOpen(false);
      }, 1500);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const startdate = watch("startdate");
  const enddate = watch("enddate");

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className='gap-4 flex flex-col justify-center w-full'>
          <Dialog.Title as='h2' className='text-base font-bold leading-6 text-gray-900 mb-4'>
            {userData ? "UPDATE PROFILE" : "ADD NEW USER"}
          </Dialog.Title>
          <div className='grid grid-cols-2 gap-6'>
            <div className=''>
              <Textbox
                placeholder='Surname'
                type='text'
                name='surname'
                label='Surname'
                className='w-full rounded mb-4'
                register={register("surname", { required: "Surname is required!" })}
                error={errors.surname ? errors.surname.message : ""}
              />
              <Textbox
                placeholder='FirstName'
                type='text'
                name='firstname'
                label='FirstName'
                className='w-full rounded mb-4'
                register={register("firstname", { required: "FirstName is required!" })}
                error={errors.firstname ? errors.firstname.message : ""}
              />
              <Textbox
                placeholder='Date Of Birth'
                type='date'
                name='dob'
                label='Date Of Birth'
                className='w-full rounded mb-4'
                register={register("dob", { required: "Date Of Birth is required!",
                validate: value => new Date(value) < new Date() || "Date of Birth must be in the past" })}
                error={errors.dob ? errors.dob.message : ""}
              />
              <Textbox
                placeholder='Email Address'
                type='email'
                name='email'
                label='Email Address'
                className='w-full rounded mb-4'
                register={register("email", { required: "Email Address is required!"
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
                placeholder='Start Date'
                type='date'
                name='startdate'
                label='Start Date'
                className='w-full rounded mb-4'
                register={register("startdate", {
                  required: "Start Date is required!",
                  validate: value => !enddate || new Date(value) < new Date(enddate) || "Start date must be before end date"
                })}
                error={errors.startdate ? errors.startdate.message : ""}
              />
              <Textbox
                placeholder='End Date'
                type='date'
                name='enddate'
                label='End Date'
                className='w-full rounded mb-4'
                register={register("enddate", {
                  required: "End Date is required!",
                  validate: value => !startdate || new Date(value) > new Date(startdate) || "End date must be after start date"
                })}
                error={errors.enddate ? errors.enddate.message : ""}
              />
              <SelectList
                label='Role'
                lists={Role}
                selected={role}
                setSelected={setRole}
              />
              <SupervisorList setSupervisor={setSupervisor} supervisor={supervisor} />
              <Textbox
                placeholder='Theme'
                type='text'
                name='theme'
                label='Theme'
                className='w-full rounded mb-4'
                register={register("theme", { required: "Theme is required!" })}
                error={errors.theme ? errors.theme.message : ""}
              />
            </div>
          </div>
          {(isLoading || isUpdating) ? (
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
                onClick={cancelBtn}
                label='Cancel'
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
}

export default AddIntern;
