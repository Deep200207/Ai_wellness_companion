import React, { useEffect, useState } from 'react'
import dasimg from "../assets/download.jpeg"
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProfile } from '../Store/Reducer/profileSlice'
import { IoPerson } from "react-icons/io5";
import 'chart.js/auto';
import { stepPlot } from '../Store/Reducer/statisticSlice'
import Fitbit_Auth from './Fitbit_Auth'
import WeeklyStepsPlot from './WeeklyStepPlot'
// import AQIByLocation from './AQIBylocation'

function safeParse(item) {
  try {
    const v = localStorage.getItem(item);
    return v ? JSON.parse(v) : null;
  } catch (e) {
    console.warn(`Failed to parse localStorage item ${item}:`, e);
    return null;
  }
}
function Dashboard() {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(safeParse("user") || null);
  const [user_data, setUser_data] = useState(safeParse("user_data") || null);
  const [bmi_score, setBmi_Score] = useState(null);
  const [category, setCategory] = useState(null);
  const [img, setImg] = useState(null);
  const [step, setStep] = useState([]);
  const [stepInput, setstepInput] = useState();
  const [dayInput, setdayInput] = useState();
  const [day, setDay] = useState([])

  const dispatch = useDispatch();

  const handleStep = () => {
    setDay(prev => [...prev, dayInput]);
    setStep(prev => [...prev, stepInput]);
    dispatch(stepPlot({ step, day }))
  }
  const { data } = useSelector((state) => state.statistic)

  const {
    haveProfile,
    loading: profileLoading,
    profileData,
    error,
    error_profile
  } = useSelector((state) => state.profile || {});

  const { isChange } = useSelector((state) => state.user || {});

  useEffect(() => {
    const storeUser = safeParse("user");
    const store_data = safeParse("user_data");
    setUser(storeUser);
    setUser_data(store_data);
    if (storeUser) {
      const url = storeUser.img;
      setImg(url)
      setAuth(true);
      dispatch(getProfile({ email: storeUser.email }));
    } else {
      setAuth(false);
    }
    console.log(isChange)
    console.log(haveProfile)
  }, [isChange, dispatch]);

  // BMI calculation: guard against invalid values
  useEffect(() => {
    const data = (profileData && Object.keys(profileData).length) ? profileData : user_data;
    if (!data) {
      setBmi_Score(null);
      setCategory(null);
      return;
    }
    const weight = parseFloat(data.weight);
    const heightCm = parseFloat(data.height);
    const height = !isNaN(heightCm) ? heightCm / 100 : NaN;

    if (!weight || !height || isNaN(weight) || isNaN(height) || height <= 0) {
      setBmi_Score(null);
      setCategory(null);
      return;
    }

    const score = weight / (height * height);
    let cat;
    if (score < 18.5) cat = "Underweight";
    else if (score < 25) cat = "Normal";
    else if (score < 30) cat = "Overweight";
    else cat = "Obese";

    setBmi_Score(score.toFixed(2));
    setCategory(cat);
  }, [profileData, user_data]);
  return (
    <div className='h-full md:mt-1 mt-16'>
      {(haveProfile && isChange) &&
        < div className='w-[100%] md:w-[85%] float-right'>
          <div className='m-2'>
            <h1 className="text-sm md:text-xl  font-bold text-slate-100 p-1">Hello, {user?.name ?? 'User'}!</h1>
            <h1 className="font-light text-sm  text-slate-300 md:font-semibold font-sans p-1">Let's begin our journey to better health </h1>
          </div>
          <div className='md:p-2 w-full p-1 grid grid-cols-2 '>
            <div className=" ">
              <div className=' md:grid md:grid-cols-2 md:p-2 mt-3  text-slate-800 md:space-x-2 md:justify-center md:items-center'>
                <div className='mb-5 rounded bg-gradient-to-r from-slate-50 to-slate-100 justify-center flex items-center '>
                  <div>
                    <h1 className='text-center font-semibold m-2 p-2 text-xl'>Weight</h1>
                    <h1 className='p-2 m-2 text-xl'>{user_data?.weight} kg</h1>
                  </div>
                </div>
                <div className=' mb-5 rounded bg-gradient-to-r from-slate-50 to-slate-200 justify-center flex items-center'>
                  <div>
                    <h1 className='text-center font-semibold m-2 p-2 text-xl'>Height</h1>
                    <h1 className=' text-center  m-2 p-2 text-xl'>{user_data?.height} cm</h1>
                  </div>
                </div>
              </div>
              {/* BMI Calculator */}
              <div className='flex justify-center items-center m-2'>
                <div className=" rounded bg-gradient-to-r from-slate-100 to-slate-200 justify-center flex items-center w-1/2 ">
                  <div className='p-1'>
                    <h1 className="text-center  md:text-xl text-lg font-semibold m-3">BMI Value </h1>
                    <div className={`${category === "Underweight" || category === "Overweight" ? "bg-yellow-300 text-red-700" :
                      category === "Obese" ? "bg-red-300 text-black" : "bg-green-600 text-slate-700"}
                  p-1 rounded-2xl mb-2`} >
                      <h1 className="text-center text-sm md:text-lg md:p-1 text-slate-100 font-semibold">{bmi_score ?? '—'} kg/m<sup>2</sup></h1>
                      <h1 className="text-center md:p-2 md:text-lg text-sm font-semibold text-slate-100">{category ?? '—'}</h1>
                    </div>
                  </div>
                </div>
              </div>
              <div>

              </div>

              {/* <button onClick={() => window.location.href = authUrl}>Connect Fitbit</button> */}
            </div>
            {/* step traker */}
            <div className=' justify-center items-center w-[100%]'>
              <div className=' w-[100%] rounded-2xl p-4'>
                <WeeklyStepsPlot ></WeeklyStepsPlot>
              </div>
              <div>
                <Fitbit_Auth></Fitbit_Auth>
              </div>
            </div>
          </div>
        </div>
      }

      {
        (isChange) && (profileLoading || haveProfile) ? (profileLoading) && <div className='text-center font-semibold text-xl p-2 text-white'>Loading...</div> :
          <div className='md:w-[80%] md:flex md:float-right m-5 p-2 mt-10 '>
            <div className='md:w-[40%] flex justify-center items-center overflow-hidden'>
              {error && user_data ? <div>
                <h1>Something Went Wrong</h1>
              </div> : <div>
                <h1 className='slide-in-from-left text-transparent text-center m-5 p-2
                    bg-gradient-to-b from-sky-50 via-sky-200 to-sky-400 bg-clip-text
                    md:text-5xl text-2xl '>Your Personalized Wellness Journey Starts Here</h1>
                <div className='flex justify-center items-center' >
                  {auth ? <Link to={"/info"} className='bg-gradient-to-b from-black via-gray-600 to-gray-300 text-slate-50 font-bold text-xl p-1 rounded-2xl cursor-pointer  hover:text-2xl'>{error_profile ? "Something Went Wrong Try Again" : "Set-up Your Profile"}</Link>
                    : <Link to={"/login"} className='bg-sky-700 hover:bg-sky-600 cursor-pointer text-white rounded-2xl p-2 font-bold
                    '>Start Here</Link>}
                </div>
              </div>}
            </div>
            <div className='md:w-[60%] md:flex md:justify-end hidden overflow-hidden'>
              <div className="slide-in-from-right m-5 w-[70%] h-100 bg-cover 
              rounded-full bg-center hover:scale-105 cursor-pointer"
                style={{ backgroundImage: `url(${dasimg})` }}>
              </div>
            </div>
          </div>
      }
    </div >
  )
}

export default Dashboard;
