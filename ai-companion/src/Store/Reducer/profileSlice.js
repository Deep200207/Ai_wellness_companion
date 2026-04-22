import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// import { use } from "react";
import { useDispatch } from "react-redux";


// const dispatch=useDispatch();
export const setProfile=createAsyncThunk(
    "profile",
    async({age,gender,height,weight},{rejectWithValue})=>{
        const user=JSON.parse(localStorage.getItem("user"));
        const email=user.email;
        console.log(age)
        console.log(email)
        const res=await fetch("https://ai-wellness-companion-k1kr.onrender.com/profile",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({age,gender,height,weight,email})
        });
        const data=await res.json();
        if(!res.ok){
            return rejectWithValue(data)
        }
        return data;
    }
)
export const getProfile=createAsyncThunk(
    "getProfile",
    async({email},{rejectWithValue})=>{
        const res=await fetch("https://ai-wellness-companion-k1kr.onrender.com/checkprofile",{
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({email})
        })
        const data=await res.json();
        console.log(data)
        if(!res.ok){
            return rejectWithValue(data)
        }
        // console.log(data.weight)
        return data;
    }
)
const profileSlice=createSlice({
    name:"profile",
    initialState:{
        profile:null,
        error:null,// error in profile load
        error_profile:null,//error in profile creation 
        response:null,
        isCreated:false,
        haveProfile:false,
        profileData:null,
        loading:false
    },
    extraReducers:(builder)=>{
        builder
        .addCase(setProfile.pending,(state)=>{
            state.error_profile=null,
            state.response=null
        })
        .addCase(setProfile.fulfilled,(state,acion)=>{
            state.user=acion.meta.arg;
            state.error_profile=null,
            state.response="Profile Created"
            localStorage.setItem("user_data",JSON.stringify(acion.payload.data))
        })
        .addCase(setProfile.rejected,(state,action)=>{
            state.error_profile=action.payload.error || action.error.message
            alert(state.error_profile)
        })
        .addCase(getProfile.pending, (state)=>{
            state.error=null,
            state.loading=true
        })
        .addCase(getProfile.fulfilled,(state,action)=>{
            state.error=null;
            state.loading=false
            state.haveProfile=true,
            state.profileData=action.payload
            localStorage.setItem("user_data",JSON.stringify(action.payload))
        })
        .addCase(getProfile.rejected,(state,action)=>{
            // state.haveProfile=false
            state.loading=false
            state.error= action.payload.error ||"No Network, Check Your Network"
        })
    }
})
export const {changeDashboard}=profileSlice.actions;
export default profileSlice.reducer;