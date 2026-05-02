import React, { useEffect, useState } from 'react'
import { IoPerson } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
export default function Profile() {
    const [img, setImg] = useState(null);
    const [auth, setAuth] = useState(false);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [newHeight, setNewHeight] = useState(null);
    const [newWeight, setNewWeight] = useState(null);
    const [newAge, setNewAge] = useState(null);
    const [gender, setGender] = useState(null);
    const [height, setHeight] = useState(null);
    const [weight, setWeight] = useState(null);
    const [Age, setAge] = useState(null);
    const [goal, setGoal] = useState(null);
    const { isChange } = useSelector((state) => state.user)

    const updateUser = async () => {
        const res = await fetch('https://ai-wellness-companion-k1kr.onrender.com/update',{
            method: "PUT",
            headers:{
                "Content-Type": "application/json"
            },
            body : JSON.stringify({
                email:email,
                age:newAge || Age,
                height:newHeight || height,
                weight:newWeight || weight,
            })
        })
        const data = await res.json();
        console.log(data)
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"))
        const user_data = JSON.parse(localStorage.getItem("user_data"))
        if (user) { setAuth(true) }
        else { setAuth(false) }
        const img = user?.img;
        const name = user?.name;
        const email = user?.email;
        const height = user_data?.height;
        const gender = user_data?.gender;
        const weight = user_data?.weight;
        setImg(img)
        setName(name);
        setEmail(email);
        setGender(gender);
        setHeight(height);
        setWeight(weight);
        console.log("This is called")
    }, [isChange])
    return (
        <>
            {auth ?
                <div className='md:w-[85%] md:float-right mt-15 md:mt-2'>
                    <h1 className='p-2 md:p-3  text-lg md:text-3xl text-slate-200'>Profile Setting</h1>
                    {img ? <img src={img} alt='profile pic' className='md:p-2 md:w-30 w-15 m-2 rounded-full' /> :
                        <IoPerson className='text-white border-2 p-2 m-2 border-white rounded-full w-20 h-20'></IoPerson>}
                    <div className='bg-slate-700 rounded-2xl w-[90%] grid grid-cols-2 m-5 p-2 mb-5 '>
                        <div className='text-slate-100 w-[80%]   '>
                            <div className='text-xl p-2 '><h1 className='p-2'>Name: </h1> 
                            <input  className='bg-slate-50  text-slate-800 p-2 rounded w-[80%] outline-0 placeholder-black' placeholder={name} ></input>
                                <button className='text-sm p-2 bg-green-500 m-1 rounded-2xl cursor-pointer' onClick={()=>updateUser()}>Update</button>
                            </div>
                        </div>
                        <div className='text-slate-100 w-[80%]'>
                            <div className='text-xl p-2'> <h1 className='p-2'>Email:</h1>
                            <h1 className='bg-slate-50  text-slate-800 p-2 rounded ' >{email}</h1></div>
                        </div>
                        <div className='text-slate-100 w-[80%]'>
                            <div className='text-xl p-2'><h1 className='p-2'>Gender: </h1> <input  className='bg-slate-50  text-slate-800 p-2 rounded w-[80%] placeholder-black 
                            outline-1' placeholder={gender}></input>
                                <button className='text-sm p-2 bg-green-500 m-1 rounded-2xl cursor-pointer'onClick={()=>updateUser()}>Update</button></div>
                        </div>
                        <div className='text-slate-100  w-[80%]'>
                            <div className='text-xl p-2'> <h1 className='p-2'>Weight: </h1> <input className='bg-slate-50  text-slate-800 p-2 rounded w-[80%] placeholder-black'placeholder={weight} onChange={(e)=>setNewWeight(e.target.value)}></input>
                                <button className='text-sm p-2 bg-green-500 m-1 rounded-2xl cursor-pointer' onClick={()=>updateUser()}>Update</button></div>
                        </div>
                        <div className='text-slate-100  w-[80%]'>
                            <div className='text-xl p-2'><h1 className='p-2'>Height:</h1><input className='bg-slate-50  text-slate-800 p-2 rounded w-[80%] outline-0 placeholder-black' placeholder={height} onChange={(e)=>setNewHeight(e.target.value)}></input>
                                <button className='text-sm p-2 bg-green-500 m-1 rounded-2xl cursor-pointer' onClick={()=>updateUser()}>Update</button></div>
                        </div>
                        <div className='text-slate-100  w-[80%]'>
                            <div className='text-xl p-2'><h1 className='p-2'>Age:</h1><input value={Age} className='bg-slate-50  text-slate-800 p-2 rounded w-[80%]' placeholder='N.a'onChange={(e)=>setNewAge(e.target.value)} ></input>
                                <button className='text-sm p-2 bg-green-500 m-1 rounded-2xl cursor-pointer' onClick={()=>updateUser()}>Update</button></div>
                        </div>
                        <div className='text-slate-100  w-[80%]'>
                            <div className='text-xl p-2'><h1 className='p-2'>Set Goal:</h1><input value={goal} className='bg-slate-50  text-slate-800 p-2 rounded w-[80%]' placeholder='N.a' ></input>
                                <button className='text-sm p-2 bg-green-500 m-1 rounded-2xl cursor-pointer'>Update</button></div>
                        </div>
                    </div>
                </div>
                : <>
                    <h1 className='w-[85%] float-right text-center text-slate-100 font-semibold text-2xl p-2 '> Profile Not Exist </h1>
                    <h1 className='w-[85%] float-right text-center text-slate-100 font-semibold text-2xl '> Make Your Accounts First  </h1>
                    <Link to={"/login"} className='w-[85%] float-right text-center text-slate-100 font-semibold text-2xl p-4 '> Login Now  </Link>
                </>
            }
        </>
    )
}
