import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { logout } from './Store/Reducer/authSlice';
import { useEffect } from 'react';
import { IoPerson } from "react-icons/io5";

function Navbar() {
  const [menu, setMenu] = useState(false);
  const [img, setImg] = useState(null);
  const { haveProfile } = useSelector((state) => state.user)
  const navigate = useNavigate();
  // const [auth,setAuth]=useState(false)
  const Auth = JSON.parse(localStorage.getItem("user"))
  const dispatch = useDispatch();

  useEffect(() => {
    const Auth = JSON.parse(localStorage.getItem("user"))
    const url = Auth?.img;
    setImg(url);
  }, [haveProfile])

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user_data")
  }

  return (
    <>
      <div id="nav_bg" className='md:w-[15%] w-full fixed z-50 top-0 md:h-full '> {/* Added relative and z-20 */}
        {/* Desktop Navigation */}
        <div className='md:flex flex-row justify-between hidden'>
          <div>
            <div className='m-2 justify-center items-center flex '>
              <div>
                <h1 className='text-2xl font-bold bg-gradient-to-b from-sky-500 via-sky-700 to-sky-900 bg-clip-text text-transparent mb-2 mt-2'>Ai Wellness</h1>
                {Auth && <div className='mt-2 mb-5  rounded-full'>
                  <div className='flex justify-center items-center'>
                    {img ? <img src={img} alt="" className='md:w-15 rounded-full p-2' /> : <IoPerson className='w-15 border-1 rounded-full h-[100%] p-3 m-1'></IoPerson>}
                    <Link to={"/profile"} className='p-2 cursor-pointer rounded-xl font-semibold bg-slate-100 text-slate-800'>View Profile</Link>
                  </div>
                </div>}
              </div>
            </div>
            <div className=' p-2 space-y-3 font-semibold mb-2  w-full '>
              <h1 className='p-2 cursor-pointer'>
                <Link className={`rounded-xl hover:bg-sky-600 p-2  hover:text-white ${location.pathname === '/' ? " bg-sky-600 p-2 rounded-xl text-white " :
                  "p-2"}`} to={"/"}>Dashboard</Link></h1>
              <h1 className='p-2  hover:p-2 cursor-pointer'>
                <Link to={"/about"} className={`rounded-xl p-2 hover:bg-sky-600 hover:text-white ${location.pathname === '/about' ? " bg-sky-600 p-2 text-white rounded-xl " :
                  "p-2"}`}>About</Link></h1>
              <h1 className='p-2 cursor-pointer'>
                <Link className={`rounded-xl p-2 hover:bg-sky-600 hover:text-white ${location.pathname === '/feature' ? "bg-blue-300 p-2" : "p-2"}`}>Features</Link></h1>
              {Auth ?
                <div className='space-y-2' >
                  <div className='p-2'>
                    <Link to={"/track"} className={`cursor-pointer p-2 hover:bg-sky-600 rounded-2xl hover:text-white ${location.pathname === '/track' ? "bg-sky-600 text-white p-2 rounded-full" : "p-2"}`}>Track Mood</Link></div>
                  <div className='p-2 '>
                    <Link to={"/state"} className={`cursor-pointer p-2 hover:bg-sky-600 hover:text-white rounded-2xl ${location.pathname === "/state" ? "bg-sky-600 text-white p-2 rounded-full " : "p-2"}`}>Statistical </Link>
                  </div>
                  <div className='p-2'>
                    <Link to={"/chatbot"} className={`cursor-pointer p-2 hover:bg-sky-600 hover:text-white rounded-2xl ${location.pathname === "/chatbot" ? "bg-sky-600 text-white p-2 rounded-full " : "p-2"}`}>AI Agent </Link>
                  </div>
                </div>
                : <></>
              }
            </div>
            <div className='p-2'>
              {Auth ?
                <button className='cursor-pointer text-white bg-red-500 rounded-2xl hover:bg-red-700  p-2 font-bold'
                  onClick={() => dispatch(logout())}>Logout</button> :
                <div>
                  <h1 className='p-2 mb-2'><Link className='cursor-pointer font-bold bg-gradient-to-r from-black via-gray-800 to-gray-700 text-white p-2 rounded-2xl' to={"/login"}>Log In </Link></h1>
                  <h1 className='p-2'><Link className='p-2 cursor-pointer font-semibold ' to={"/signup"}>Sign-up</Link></h1>
                </div>
              }
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className='md:hidden flex justify-between items-center'>
          <div className='p-3'>
            <h1 className='text-xl font-bold bg-gradient-to-b from-black via-gray-600 to-gray-500 bg-clip-text text-transparent'>Wellness.Ai</h1>
          </div>
          <button
            className='p-2 m-3 rounded-2xl text-white font-bold bg-slate-600'
            onClick={() => setMenu(!menu)}
          >
            {menu ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {/* Mobile Menu with Overlay */}
      {menu && (
        <>
          {/* Mobile Menu */}
          <div className='fixed top-0 right-0 z-40 md:hidden mt-15'> {/* Added fixed positioning and z-40 */}
            <div className='bg-slate-100 border-t border-gray-300 overflow-hidden shadow-lg'>
              <div className='max-h-60 overflow-y-auto'>
                <div className='flex flex-col space-y-2 p-2'>
                  <Link
                    className='cursor-pointer py-2 px-3 hover:bg-gray-200 rounded'
                    to={"/"}
                    onClick={() => setMenu(false)}
                  >
                    Home
                  </Link>
                  <button className='cursor-pointer py-2 px-3 hover:bg-gray-200 rounded text-left'>
                    About
                  </button>
                  <button className='cursor-pointer py-2 px-3 hover:bg-gray-200 rounded text-left'>
                    Features
                  </button>
                  {Auth ?
                    <><Link className='cursor-pointer py-2 px-3 hover:bg-gray-200 rounded text-left'>Track Mood</Link>
                      <Link className='cursor-pointer py-2 px-3 hover:bg-gray-200 rounded text-left'>Statistical </Link></> : <></>
                  }
                  <div className='border-t border-gray-300 pt-3 mt-3'>
                    {Auth ?
                      <button className='cursor-pointer bg-red-500 text-white p-2 text-center rounded-2xl 
                    ' onClick={handleLogout}>Logout</button>
                      : <><Link
                        className='cursor-pointer bg-gradient-to-r from-black via-gray-700 to-gray-400 text-white p-2 rounded-2xl block text-center mb-1'
                        to={"/login"}
                        onClick={() => setMenu(false)}
                      >
                        Log In
                      </Link>
                        <Link
                          className='cursor-pointer border border-gray-400 p-2 rounded-2xl block text-center'
                          to={"/signup"}
                          onClick={() => setMenu(false)}
                        >
                          Sign-up
                        </Link></>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Navbar