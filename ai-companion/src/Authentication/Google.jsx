import React from 'react'
import { useEffect, useState } from "react";
import google from "../assets/google.png"
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '../firebase';
import { useDispatch } from 'react-redux';
import { googleLogin } from '../Store/Reducer/authSlice';

export default function Google() {
  const dispatch=useDispatch();
     async function handleLogin(){
        try{
            const result=await signInWithPopup(auth,googleProvider);
            const user=result.user;
            const idToken=await user.getIdToken();
            console.log("fiberBase User",user);
            console.log("token",idToken);
            dispatch(googleLogin({idToken}));

        }catch(err){
            console.log(err);
            alert("login fails")
        }
    }

  return (
    <div className='flex justify-center items-center  '>
      <button className='text-slate-800 p-2 rounded-xl  cursor-pointer flex bg-gray-200 justify-center items-center ' onClick={handleLogin} >
        <img src={`${google}`} alt="" className='w-6 md:w-8 p-1 bg-white mr-2 font-semibold rounded-2xl'/>Sign in with Google
      </button>
    </div>
  );
}

