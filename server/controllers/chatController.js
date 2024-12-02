import Chat from "../models/chat.js";
import Message from "../models/message.js";
import Notice from "../models/notification.js";
import User from "../models/user.js";

export const createChat = async (req, res) => {
  try {
  const { chatId, senderId, text,receiverId } = req.body;
  let textmsg 
  let newMessage
  let newChat
  if(!chatId){
    
    newChat = await Chat.create({
      members: [senderId, receiverId],
    });
    
    newMessage = await Message.create({
      chatId:newChat?._id,
      senderId,
      text
    })
  }else{
    newMessage = await Message.create({
      chatId,
      senderId,
      text
    })
  }
 const user= await User.findById(senderId)
 textmsg =`You Have New Messages from ${user.firstname} ${user.surname}`
  await Notice.create({
    team:receiverId,
    notiType:"message",
    text:textmsg,
  
  });
    
      res.status(200).json(newMessage);
    } catch (error) {
      res.status(500).json(error);
    }
  };
  
  export const userChats = async (req, res) => {
    const { receiverId } = req.params;
    const { userId } = req.user;
 
    try {
      const chat = await Chat.findOne({
        members: { $all: [userId, receiverId] }
      });
      
      if (!chat) {
        return res.status(200).json({ message: "No messages yet" });
      }
  
      const messages = await Message.find({ chatId: chat._id });
      
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json(error);
    }
  };
  
  
