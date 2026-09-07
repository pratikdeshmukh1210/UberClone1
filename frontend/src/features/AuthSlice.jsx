import {createSlice} from "@reduxjs/toolkit"
let authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null ,
    },
    reducers:{
        setUser:(state,action)=>{
            state.user =action.payload ;
        }
    }
})
export const {setUser} =authSlice.actions ;
export default authSlice.reducer ;
