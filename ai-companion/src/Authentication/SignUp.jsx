import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { sendUser } from '../Store/Reducer/authSlice';
import img from "../assets/doctor.jpg"

export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const { error, loading, response } = useSelector((state) => state.user)

    const handleSubmit = () => {

        if (name && email && password) {
            dispatch(sendUser({ name, email, password }));
        }
        setName("");
        setEmail("");
        setPassword("");

    }
    return (
        <>
            <h1 className='text-gray-100 text-center p-3 md:w-[85%] md:float-right text-3xl font-semibold font-sans mt-15 md:mt-2 md:mb-10'>Register Your-Self</h1>
            <div className='md:flex md:w-[85%] w-full md:float-right'>
                <div className='hidden md:flex md:w-[50%] justify-center items-center'>
                    <img className="rounded-full w-[70%] p-2 m-3 " src={`${img}`} alt="sign-up" />
                </div>
                <div className='flex justify-center items-center mt-10 md:w-[50%]'>
                    <div className=' rounded-2xl  md:p-5 bg-slate-400 '>
                        <div className=' m-5 rounded-2xl p-2'>
                            <h1 className='font-bold text-2xl 
                font-sans bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text 
                text-transparent text-center'>Create Your Account</h1>
                        </div>
                        <div className='mt-5 w-full font-bold space-y-5 p-2 md:p-3 text-slate-900 text-sm md:text-lg'>
                            {response && <h1 className='text-center text-green-600'>{response}</h1>}
                            {error && <h1 className='text-center text-red-500'>{error}</h1>}
                            {loading && <h1 className='text-center text-yellow-500'>Loading...</h1>}
                            <h1 className='float-right'>Name: <input type="text" className='outline-none  rounded-2xl md:p-3 p-2 bg-slate-300' placeholder='Enter Name'
                                onChange={(e) => setName(e.target.value)} value={name} /></h1><br />
                            <h1 className='float-right'>Email: <input type="text" className='outline-none rounded-2xl md:p-3 p-2 bg-slate-300' placeholder='Enter Mail'
                                onChange={(e) => setEmail(e.target.value)} value={email} /></h1><br />
                            <h1 className='float-right'>Password: <input type="text" className='outline-none rounded-2xl md:p-3 p-2 bg-slate-300' placeholder='Enter Password'
                                onChange={(e) => setPassword(e.target.value)} value={password} /></h1><br />
                            <div className='flex justify-center items-center w-full mt-5 mb-2'>
                                <button className='text-white bg-sky-700 rounded-xl p-2 cursor-pointer hover:bg-sky-600' onClick={handleSubmit}> Sign-Up</button>
                            </div>
                            <h1 className='text-center text-sm'>Already have an account <Link className='text-blue-600' to={"/login"}>Login Now</Link></h1>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
