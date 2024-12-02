import { apiSlice } from "../apiSlice";
const TASK_URL="/task"
export const taskApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        getDashboardStats:builder.query({
            query:()=>({
                url:`${TASK_URL}/dashboard`,
                method:"GET",
                credentials:"include"
            })
        }),
        getAllTask:builder.query({
            query:({strQuery,search})=>({
                url:`${TASK_URL}?stage=${strQuery}&search=${search}`,
                method:"GET",
                credentials:"include"
            })
        }),
        createTask:builder.mutation({
            query:(data)=>({
                url:`${TASK_URL}/create`,
                method:"POST",
                body:data,
                credentials:"include"
            })
        }),
      
        updateTask:builder.mutation({
            query:(data)=>({
                url:`${TASK_URL}/update/${data._id}`,
                method:"PUT",
                body:data,
                credentials:"include"
            })
        }),
        createSubTask:builder.mutation({
            query:({data,id})=>({
                url:`${TASK_URL}/create-subtask/${id}`,
                method:"PUT",
                body:data,
                credentials:"include"
            })
        }),
        trashTask:builder.mutation({
            query:(id)=>({
                url:`${TASK_URL}/${id}`,
                method:"DELETE",
                credentials:"include"
            })
        }),
        getSingleTask:builder.query({
            query:(id)=>({
                url:`${TASK_URL}/${id}`,
                method:"GET",
                credentials:"include"
            })
        }),
        postTaskActivity:builder.mutation({
            query:({data,id})=>({
                url:`${TASK_URL}/activity/${id}`,
                method:"POST",
                body:data,
                credentials:"include"
            })
        }),
        getTaskEvaluation:builder.query({
            query:(id)=>({
                url:`${TASK_URL}/opentaskevaluation/${id}`,
                method:"GET",
                credentials:"include"
            })
        }),
        ValidateTask:builder.mutation({
            query:(data)=>({
                url:`${TASK_URL}/validate-Task/${data._id}`,
                method:"PUT",
               
                credentials:"include"
            })
        }),
      
        
        
        
    })
})
export const {useGetDashboardStatsQuery,useGetAllTaskQuery,useCreateTaskMutation,useGetSingleTaskQuery,usePostTaskActivityMutation,
   useUpdateTaskMutation,useCreateSubTaskMutation,useTrashTaskMutation,useValidateTaskMutation,useGetTaskEvaluationQuery}= taskApiSlice