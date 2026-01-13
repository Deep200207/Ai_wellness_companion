import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../Store/Reducer/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import img from '../assets/login.jpg'
import Google from './Google';

export default function Login() {
    // const [name,setName]=useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { response, error, user, loading } = useSelector((state) => state.user);

    const handleSubmit = () => {
        if (!email || !password) {
            alert("All Fields are Required")
        }
        dispatch(loginUser({ email, password }));
        // setName("")
        setEmail("")
        setPassword("")
    }
    useEffect(() => {
        const checkUser = localStorage.getItem("user")

        if (checkUser) {
            navigate("/")
        }
    })

    return (
        <div className='flex justify-center items-center mt-15 md:w-[85%] w-full float-right'>
            <div className='hidden md:flex items-center justify-center w-[50%]'>
                <img src={`${img}`} alt="" className='rounded-2xl w-[90%]'/>
            </div>
            <div className=' m-10 rounded-2xl p-1 md:w-[36%]'>
                <div className='mt-5 w-full font-bold space-y-5 p-4 rounded-2xl text-slate-900 bg-slate-400 '>
                    <h1 className='font-bold text-2xl font-sans bg-gradient-to-r from-black via-slate-800 to-slate-600 bg-clip-text 
                text-transparent text-center mt-2'>Login Here</h1>
                    <div className='flex justify-center items-center'>
                        {response && <h1 className='text-center text-green-400'>{response}</h1>}
                        {error && <h1 className='text-center text-red-400 font-bold w-40'>{error}</h1>}
                        {loading && <h1 className='text-center text-yellow-500 font-bold '>Loading..</h1>}
                    </div>
                    <h1 className='float-right md:mr-8'>Email: <input type="text" className='outline-none rounded-2xl p-2 bg-slate-300' placeholder='Enter Mail'
                        onChange={(e) => setEmail(e.target.value)} value={email} /></h1><br />
                    <h1 className=' md:mr-8 float-right'>Password: <input type="text" className='outline-none rounded-2xl p-2 bg-slate-300' placeholder='Enter Password'
                        onChange={(e) => setPassword(e.target.value)} value={password} /></h1><br />
                    <div className='flex justify-center items-center w-full mt-5 mb-2'>
                        <button className='text-white bg-sky-700 rounded-xl p-2 cursor-pointer hover:bg-sky-600'
                            onClick={handleSubmit}> Login Now</button>
                    </div>
                    <h1 className='text-center'>Don't Have Account <Link className='text-sky-700' to={"/signup"}>Sign-Up</Link></h1>
                    <hr className=' m-5' />
                    <div className='text-center'><Google></Google></div>
                </div>
            </div>
        </div>
    )
}
