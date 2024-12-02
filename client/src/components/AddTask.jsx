import React, { useEffect, useState } from "react";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import { useForm } from "react-hook-form";
import UserList from "./UserList";
import SelectList from "./SelectList";
import { BiImages } from "react-icons/bi";
import Button from "./Button";
import { getStorage, ref,getDownloadURL,uploadBytesResumable } from "firebase/storage";
const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORIRY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];
import { app } from "../utils/firebase";
import { useCreateTaskMutation, useUpdateTaskMutation } from "../redux/slices/api/taskApiSlice";
import { toast } from "sonner";
import { dateFormatter } from "../utils";
import { useSelector } from "react-redux";
const uploadedFileURLs = [];
const AddTask = ({ open, setOpen,task }) => {
  const{fetchTaskData}=useSelector((state)=>state.auth)
  const defaultValues={
    title:task?.title ||"",
    date: dateFormatter(task?.date||new Date()),
    team:[],
    stage:"",
    priority:"",
    assets:[]
   };
  
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm({defaultValues});
    const [team, setTeam] = useState(task?.team || []);
    const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]);
    const [priority, setPriority] = useState(
      task?.priority?.toUpperCase() || PRIORIRY[2]
    );
    const [assets, setAssets] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [createTask,{isLoading}]=useCreateTaskMutation()
    const [updateTask,{isLoading:isUpdating}]=useUpdateTaskMutation()
    useEffect(() => {
      // Reset form values whenever the modal is closed or opened
      if (!open) {
        reset(defaultValues);
      }
    }, [open, reset]);
  
    const URLS = task?.assets?[...task?.assets]:[]
    const uploadFile = async (file) => {
      const storage = getStorage(app);
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, file);
    
      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // You can handle progress here if needed
            console.log("upLoading");
          },
          (error) => {
            // This is the error handler
            reject(error);
          },
          () => {
            // This is the completion handler
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                uploadedFileURLs.push(downloadURL);
                resolve();
              })
              .catch((error) => {
                reject(error);
              });
          }
        );
      });
    };
    
    const submitHandler = async(data) => {
      
      setUploading(true)
      for(const file of assets){
        
        try{
          await uploadFile(file)
        }catch(error){
          console.log("error uploading file",error.message)
          return
        }finally{
          setUploading(false)
        }
      }
      try{
        const newData={
          ...data,
          assets:[...URLS,...uploadedFileURLs],
          team,
          stage,
          priority
  
        }
        const res = task?._id ?await updateTask({...newData,_id:task._id}): await createTask(newData)
        fetchTaskData()
        toast.success(res?.data?.message)
        setUploading(false)
        setTimeout(()=>{
          setOpen(false)
        },500)
      }catch(error){
        console.log(error)
        toast.error(error?.data?.message||error.error)
      }
    };
   
  
    const handleSelect = (e) => {
      setAssets(e.target.files);
    };
    const cancelBtn=()=>{
      setOpen(false)
      setUploading(false)
    }

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            {task ? "UPDATE TASK" : "ADD TASK"}
          </Dialog.Title>

          <div className='mt-2 flex flex-col gap-6'>
            <Textbox
              placeholder='Task Title'
              type='text'
              name='title'
              label='Task Title'
              className='w-full rounded'
              register={register("title", { required: "Title is required" })}
              error={errors.title ? errors.title.message : ""}
            />

            <UserList setTeam={setTeam} team={team} />

            <div className='flex gap-4'>
              <SelectList
                label='Task Stage'
                lists={LISTS}
                selected={stage}
                setSelected={setStage}
              />

              <div className='w-full'>
                <Textbox
                  placeholder='Date'
                  type='date'
                  name='date'
                  label='Task Due Date'
                  className='w-full rounded'
                  register={register("date", {
                    required: "Date is required!",
                  })}
                  error={errors.date ? errors.date.message : ""}
                />
              </div>
            </div>

            <div className='flex gap-4'>
              <SelectList
                label='Priority Level'
                lists={PRIORIRY}
                selected={priority}
                setSelected={setPriority}
              />

              <div className='w-full flex items-center justify-center mt-4'>
                <label
                  className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4'
                  htmlFor='imgUpload'
                >
                  <input
                    type='file'
                    className='hidden'
                    id='imgUpload'
                    onChange={(e) => handleSelect(e)}
                    accept='.jpg, .png, .jpeg'
                    multiple={true}
                  />
                  <BiImages />
                  <span>Add Assets</span>
                </label>
              </div>
            </div>

            <div className='bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4'>
              {uploading ? (
                <span className='text-sm py-2 text-red-500'>
                  Uploading assets
                </span>
              ) : (
                <Button
                  label='Submit'
                  type='submit'
                  className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto'
                />
              )}

              <Button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
                onClick={() => cancelBtn()}
                label='Cancel'
              />
            </div>
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddTask;