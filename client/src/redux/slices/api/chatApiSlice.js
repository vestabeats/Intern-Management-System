import { apiSlice } from "../apiSlice";
const CHAT_URL="/chat"

export const chatApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        getUserChat:builder.query({
            query:(id)=>({
                url:`${CHAT_URL}/${id}`,
                method:"GET",
                credentials:"include"
            })
        }),
       
      addMessage:builder.mutation({
        query:(data)=>({
            url:`${CHAT_URL}`,
            method:"POST",
            body:data,
            credentials:"include"
        })
    }),

      })
        
    })

export const {useGetUserChatQuery,useAddMessageMutation}= chatApiSlice