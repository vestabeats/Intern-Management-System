import React, { useEffect, useRef, useState } from 'react'

import Loading from './Loading'
import { useGetUserQuery } from '../redux/slices/api/userApiSlice'
import { getInitials } from '../utils'
import { useAddMessageMutation, useGetUserChatQuery } from '../redux/slices/api/chatApiSlice'
import moment from 'moment';
import InputEmoji from "react-input-emoji"
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {io} from "socket.io-client"
const ChatBox = () => {
    const scroll = useRef();
    const socket = useRef()
    const params = useParams();
    const userId = params?.id || "";
    const imageRef = useRef();
    const [userData, setUserData] = useState("")
    const {user}=useSelector((state)=>state.auth)
    const [sendMessage,setSendMessage]=useState(null)
    const {data,isLoading,refetch}=useGetUserQuery(userId)
  
   const [addMessage]=useAddMessageMutation()
    const{data:userMsg,isLoading:isLoadin,refetch:getMsg}=userId && useGetUserChatQuery(userId)
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([]);
   const location = useLocation()
   
     // Send Message to socket server
  useEffect(() => {
    if (sendMessage!==null) {
      socket.current.emit("send-message", sendMessage);}
  }, [sendMessage]);


    useEffect(() => {
      socket.current = io("http://localhost:5000");
      socket.current.emit("new-user-add", user?.data?._id);
      socket.current.on("get-users", (users) => {
        setOnlineUsers(users);
      });
    }, [user]);

     // Get the message from socket server
  useEffect(() => {
    socket.current.on("receive-message", (data) => {
      
      //setReceivedMessage(data);
    
      //setMessages(prevMessages => [...prevMessages, data]);
      setMessages( [...messages, data]);
      scroll.current?.scrollIntoView({ behavior: "smooth" });
      console.log("Message Arrived: ", data)
       // Clean up on component unmount
    return () => {
      socket.current.off("receive-message");
  }; })}, [location]);
    
    console.log("Message set: ", messages)

    const handleChange = (newMessage)=> {
        setNewMessage(newMessage)
        
      }

    useEffect(()=> {
        getMsg()
            refetch()
           setUserData(data)
           scroll.current?.scrollIntoView({ behavior: "smooth" });
           setMessages(userMsg)
      
    }, [userId,messages,userMsg,data])

    //send message to db
    const handleSend=async(e)=>{
      e.preventDefault()
     
      if (!newMessage.trim()) {
        return; // If empty, exit the function
      }

      const message = {
        senderId : user?.data?._id,
        text: newMessage,
        chatId: userMsg?.[0]?.chatId,
        receiverId:userId
    }
    
    // send message to socket server
    setSendMessage({...message, userId})
    // send message to database
    try {
      
      const data  = await addMessage(message);
      getMsg()
      setNewMessage("");
      setMessages([...messages, data]);
     
      
    }
    catch(error){
      console.log("error",error)
    }
    }
    const checkOnlineStatus = () => {
     
      const online = onlineUsers.find((user) => user.userId === userId);
      return online ? true : false;
    };

 
   
    
    if(isLoading  ){ return (<div className='py-5'>
  <Loading/></div>)}
  
  
  return (
    <div className=''>
       
               <div className='grid  md:fixed grid-cols-2 '>
    
               <div className='flex md:fixed shadow   justify-start '>
                {/* chat-header */}
                {checkOnlineStatus()?(<span className='bg-green-600 ml-2 rounded-full h-2 w-2'></span>):""}
                 <p className='w-10 h-10  bg-blue-600 rounded-full text-white flex items-center justify-center text-lg'>
                   <span className='text-center  font-bold'>
                     {userData ? getInitials(userData?.surname) : ""}
                   </span>
                 </p>
                 <div className='flex flex-col  ml-1'>
                   <p className='capitalize font-semibold'>{userData ? userData?.surname : ""} {userData ? userData?.firstname : ""}  </p>
                 
                   {checkOnlineStatus()?(<span className=' text-gray-500'>online </span>):(<span className=' text-gray-500'>offline </span>)}
                   
                   
                 </div>
               </div>
               
             </div>
            <div className='md:ml-[14rem] '>
             {/*Chat Body*/ }
             {isLoadin ?(<div className='py-5'>
             <Loading/></div>):
               <div class="flex flex-col  gap-2 p-6 overflow-scroll">
                
               {userMsg && Array.isArray(userMsg) && userMsg.map((message) => (
               
                
              <div
                  key={message._id}
                  ref={scroll}
                  className={
                      message.senderId === user?.data?._id
                          ? "bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white p-3 rounded-tl-lg rounded-tr-lg rounded-br-lg max-w-screen-sm  flex flex-col gap-2 self-end w-[18rem] lg:w-[27rem] whitespace-normal"
                          : "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white p-3 rounded-tl-lg rounded-tr-lg rounded-br-lg max-w-screen-sm w-[18rem]  lg:w-[27rem] flex flex-col gap-2 whitespace-normal inline-block"
                  }
              >
                
                 
                  <p style={{ wordWrap: "break-word", overflowWrap: "break-word" }}>{message && message?.text}</p>
                 
                  <span className="flex flex-row-reverse text-sm">
                    
                      {moment(message && message?.createdAt).fromNow()}
                  </span>
              </div>
              ))}
              

                   </div>}
                   </div>
                    {/* chat-sender */}
                    <div className="bg-white flex justify-between mb-24  items-center sticky mt-44 gap-4 p-2 bottom-0 w-full rounded-lg self-end">
                   <div className="bg-gray-300 rounded-full flex items-center justify-center font-bold cursor-pointer" onClick={() => imageRef.current.click()}>+</div>
                   <InputEmoji class="flex-1 sticky " value={newMessage} onChange={handleChange} />
                   <button className="bg-green-600 rounded-full text-center p-2 cursor-pointer" onClick={handleSend} >Send</button>
                   <input type="file" name="" id="" className="hidden" ref={imageRef} />
                   </div>
                   </div>
               
   
  )
}

export default ChatBox