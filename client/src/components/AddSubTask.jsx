import React, { useState, useEffect } from "react";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Button from "./Button";
import { BiImages } from "react-icons/bi";
import { app } from "../utils/firebase";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useCreateSubTaskMutation } from "../redux/slices/api/taskApiSlice";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const uploadedFileURLs = [];

const AddSubTask = ({ open, setOpen, id }) => {
  const defaultValues = {
    title: "",
    assets: [],
    tag: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // Reset form values
  } = useForm({ defaultValues });
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [addSbTask] = useCreateSubTaskMutation();
  const { fetchTaskData } = useSelector((state) => state.auth);

  useEffect(() => {
    // Reset form values whenever the modal is closed or opened
    if (!open) {
      reset(defaultValues);
    }
  }, [open, reset]);

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
        assets:[...uploadedFileURLs],
      
      }
      
      const res =  await addSbTask({data:newData,id})
      fetchTaskData()
      toast.success(res?.data?.message)
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

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Dialog.Title as="h2" className="text-base font-bold leading-6 text-gray-900 mb-4">
          ADD SUB-TASK
        </Dialog.Title>
        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Sub-Task title"
            type="text"
            name="title"
            label="Title"
            className="w-full rounded"
            register={register("title", { required: "Title is required!" })}
            error={errors.title ? errors.title.message : ""}
          />

          <div className="flex items-center gap-4">
            <div className="w-full flex items-center justify-center mt-4">
              <label
                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
                htmlFor="imgUpload"
              >
                <input
                  type="file"
                  className="hidden"
                  id="imgUpload"
                  onChange={(e) => handleSelect(e)}
                  accept=".jpg, .png,.pdf, .jpeg"
                  multiple={true}
                />
                <BiImages />
                <span>Add Assets</span>
              </label>
            </div>
            <Textbox
              placeholder="Tag"
              type="text"
              name="tag"
              label="Tag"
              className="w-full rounded"
              register={register("tag", { required: "Tag is required!" })}
              error={errors.tag ? errors.tag.message : ""}
            />
          </div>
        </div>
        <div className="py-3 mt-4 flex justify-center sm:flex-row-reverse gap-4">
          {uploading ? (
            <span className="text-sm py-2 text-red-500">Uploading assets</span>
          ) : (
            <Button
              type="submit"
              className="bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 sm:ml-3 sm:w-auto"
              label="Add Task"
            />
          )}
          <Button
            type="button"
            className="bg-white border text-sm font-semibold text-gray-900 sm:w-auto"
            onClick={() => setOpen(false)}
            label="Cancel"
          />
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddSubTask;
