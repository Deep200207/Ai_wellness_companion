import React, { useState } from 'react'
import {useDispatch} from "react-redux"
import { setProfile } from '../Store/Reducer/profileSlice';
import { useNavigate } from 'react-router-dom';

export default function User_info() {
  const [age ,setage]=useState("");
  const [gender,setGender]=useState("");
  const [height,setHeight]=useState("");
  const [weight, setWeight]=useState("");
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const handelSubmit=()=>{
    dispatch(setProfile({age,gender,height,weight}))
    navigate("/")
  }
  return (
    <div className='bg-slate-300 h-fit m-10 w-[80%] float-right rounded-2xl'>
      <div className=' flex justify-center items-center p-2 z-0  '>
        <div className='text-center text-slate-600 space-y-1'>
            <h1 className='text-2xl text-slate-600 font-bold font-sans p-2'>Give Some Details About Yourself</h1>
            <h1 className='text-slate-600 p-2 mt-3 font-bold text-xl font-serif'>Your Age</h1>
            <input type="text" placeholder='Age' className='bg-slate-100 p-2 rounded-2xl outline-0'onChange={(e)=>setage(e.target.value)}  value={age}/>
            <h1 className='p-2 font-bold font-serif text-xl '>Gender</h1>
            <label className='mr-2'>
            <input className='outline-0 p-2 border-2  ' type='radio' value="Male" onChange={(e)=>setGender(e.target.value)} checked={gender==="Male"} name='gender'>
            </input> Male</label>
            <label className=''>
              <input className='outline-0 p-2 border-2 ' type='radio' value="Female" onChange={(e)=>setGender(e.target.value)} checked={gender==="Female"
                }/> Female
            </label>
            <h1 className='p-2 font-bold font-serif text-xl '>Height</h1>
            <input type='text' placeholder='Heigth' className='p-2 bg-slate-100 rounded-2xl outline-0' value={height} onChange={(e)=>setHeight(e.target.value)}></input>
            <h1 className='p-2 font-bold font-serif text-xl '>Weight</h1>
            <input type='text' placeholder='weigth' className='p-2 bg-slate-100 rounded-2xl outline-0' value={weight} onChange={(e)=>setWeight(e.target.value)}></input><br />
            <button className=' p-3 mb-2 text-white bg-blue-500 rounded-2xl font-bold mt-5' onClick={handelSubmit}>Submit</button>
        </div>
      </div>
    </div>
  )
}
