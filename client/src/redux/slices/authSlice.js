import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user:localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')):null,
    isSidebarOpen:false,
    fetchTaskData:null,
    searchvalue:'',
    startDate:'',
    endDate:''
}
const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setCredentials:(state,action)=>{
            state.user =action.payload,
            localStorage.setItem('userInfo',JSON.stringify(action.payload))
        },
        logout:(state,action)=>{
            state.user = null,
            localStorage.removeItem('userInfo')
        },
        setOpenSidebar:(state,action)=>{
            state.isSidebarOpen=action.payload
        },
        setFetchTaskData:(state,action)=>{
            state.fetchTaskData=action.payload
        },
         setSearchValue:(state,action)=>{
            state.searchvalue=action.payload
        },
        setStartDate:(state,action)=>{
            state.startDate=action.payload
        },
        setEndDate:(state,action)=>{
            state.endDate=action.payload
        },
    }
})

export const {setCredentials,logout,setOpenSidebar,setFetchTaskData,setSearchValue,setStartDate,setEndDate} = authSlice.actions
export default authSlice.reducer
