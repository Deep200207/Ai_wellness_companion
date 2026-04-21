import React, { useContext, useEffect, useRef, useState } from 'react'
import stepImg from "../assets/stepImg.png"
import dashboard from "../assets/dashboard.jpg"
import mood from "../assets/mood.png"
import chatBot from "../assets/chatBot.jpeg"
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProfile } from '../Store/Reducer/profileSlice'
import 'chart.js/auto';
import { stepPlot } from '../Store/Reducer/statisticSlice'
import Fitbit_Auth from './Fitbit_Auth'
import WeeklyStepsPlot from './WeeklyStepPlot'
import { FiEdit } from "react-icons/fi";
import { getAuth } from "firebase/auth";
import { IoFootsteps } from "react-icons/io5";
import Groq from "groq-sdk"
import { ThemeContext } from '../context/ThemeContext'


const client = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

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
  const [steps, setSteps] = useState([]);
  const [stepInput, setstepInput] = useState();
  const [dayInput, setdayInput] = useState();
  const [day, setDay] = useState([])
  const [goal, setGoal] = useState(null);
  const [tar, setTar] = useState(null);
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState([]);
  const { sevenDaysStep } = useContext(ThemeContext)
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);


const dispatch = useDispatch();
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const greeting = {
      role: "assistant",
      content: `Hi ${user?.name}! 
      I'm your AI Wellness Coach. 
      Today you've walked ${user_data?.todaySteps} steps 
      How can I help you?`
    };
    setMessages([greeting]);
  }, []);

  const sendMessage = async (userInput) => {
    if (!userInput.trim()) return;

    
    const userMsg = { role: "user", content: userInput };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system", content: `
          You are Personal AI Wellness Coach.
          User Profile:
          Weight: ${user_data?.weight} kg
          Height: ${user_data?.height} cm
          BMI: ${bmi_score}
          Today's Steps: ${steps}
          Calories Burned: ${(steps * 0.04).toFixed(1)} kcal
          Weekly Steps: ${JSON.stringify(sevenDaysStep)}

          Rules:
            - Remember everything from this conversation
            - Give short friendly responses (2-3 sentences)
            - Be motivating and positive
            - Give specific advice based on their data
            - If they follow up, refer to previous messages

          ` },
        ...updatedMessages
      ],
      temperature: 0.7,
      max_completion_tokens: 300
    });
    const reply = response.choices[0].message.content;
    setMessages(prev => [
      ...prev,
      { role: "assistant", content: reply }
    ]);
    setLoading(false);
  }

  const getdata = () => {
    console.log(sevenDaysStep)
  }
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

  useEffect(()  => {
    const fetchSteps= async ()=>{
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error("No user logged in.");
      }
      const idToken = await user.getIdToken();
      const res = await fetch("http://localhost:5000/fitbit/steps", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("Not connected to Fitbit or session expired (401/403).");
        } else if (res.status === 404) {
          throw new Error("No steps data found (404).");
        } else {
          throw new Error(`Server error: ${res.status}`);
        }
      }
      const data = await res.json();
      console.log("Steps today:", data.steps);
      setSteps(data.steps); // update your state

      return data;

    } catch (err) {
      console.error("Error fetching steps:", err.message);
    }
  };
  fetchSteps();
  },[]);
  return (
    <div className='h-full md:mt-1 mt-16'>
      {(haveProfile && isChange) &&
        < div className='w-[100%] md:w-[85%] float-right'>
          <div className='m-2'>
            <h1 className="text-sm md:text-xl  font-bold text-slate-100 p-1">Hello, {user?.name ?? 'User'}!</h1>
            <h1 className="font-light text-sm  text-slate-300 md:font-semibold font-sans p-1">Let's begin our journey to better health </h1>
          </div>
          <div className='md:p-2 w-full p-1 grid grid-cols-2'>
            <div className="">
              <div className='border-2 border-white'>
                <h1 className='text-center text-white p-2 text-xl font-semibold'>Body Metrics</h1>
                <div className=' md:grid md:grid-cols-3 md:p-2   text-slate-800 md:space-x-2 md:justify-center md:items-center'>
                  <div className='mb-5 rounded bg-gradient-to-r from-slate-50 to-slate-100 justify-center flex items-center '>
                    <div>
                      <h1 className='text-center font-semibold m-2 p-2 text-xl'>Weight</h1>
                      <h1 className='p-2 m-2 text-xl'>{user_data?.weight} kg</h1>
                      <div className='flex  justify-center text-2xl p-2  '>
                        <Link className='cursor-pointer' to={"/profile"}><FiEdit /></Link>
                      </div>
                    </div>
                  </div>
                  <div className=' mb-5 rounded bg-gradient-to-r from-slate-50 to-slate-200 justify-center flex items-center'>
                    <div>
                      <h1 className='text-center font-semibold m-2 p-2 text-xl'>Height</h1>
                      <h1 className=' text-center  m-2 p-2 text-xl'>{user_data?.height} cm</h1>
                      <div className='flex  justify-center text-2xl p-2  '>
                        <Link className='cursor-pointer' to={"/profile"}><FiEdit /></Link>
                      </div>
                    </div>
                  </div>
                  <div className='flex justify-center items-center '>
                    <div className=" rounded bg-gradient-to-r from-slate-100 to-slate-200 justify-center flex items-center mb-5 w-full  ">
                      <div className=''>
                        <h1 className="text-center  md:text-xl text-lg font-semibold m-2 p-1 ">BMI Value </h1>
                        <div className={`${category === "Underweight" || category === "Overweight" ? "bg-yellow-300 text-red-700 m-2" :
                          category === "Obese" ? "bg-red-300 text-black m-2" : "bg-green-600 text-slate-700 m-2  "}
                  p-1 rounded-2xl mb-2`} >
                          <h1 className="text-center text-sm md:text-lg md:p-1 text-slate-100 font-semibold">{bmi_score ?? '—'} kg/m<sup>2</sup></h1>
                          <h1 className="text-center md:p-2 md:text-lg text-sm font-semibold text-slate-100">{category ?? '—'}</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='border-2 border-white p-2 mt-5'>
                <h1 className='text-center mb-2 text-white font-semibold text-xl '>Daily Activity</h1>
                <div className=''>
                  {/* <button className='p-2 bg-amber-600 rounded-2xl' onClick={() => getSteps()} >getSteps</button> */}
                  <div className='flex gap-5 grid-cols-1 md:grid-cols-3'>
                    <div className='rounded-full p-2 bg-gradient-to-r from-slate-50 to-slate-200 justify-center flex items-center'>
                      <div>
                        <h1 className='text-center font-semibold m-2 p-2 text-xl'>Today Steps</h1>
                        <div className=' text-center m-2  border-2 text-2xl p-1 rounded-full flex justify-center'>
                          {steps} <IoFootsteps className='m-1' />
                        </div>
                        <button ></button>
                      </div>
                    </div>
                    <div>
                      <div className='rounded p-2 bg-gradient-to-r from-slate-50 to-slate-200 justify-center flex items-center'>
                        <div>
                          <h1 className='text-center font-semibold m-2 p-2 text-xl'>Today Goals</h1>
                          <div className=''>
                            <input className='p-1 outline-0 border-2 rounded placeholder-black' placeholder='Set Steps Goal' onChange={(e) => setTar(e.target.value)}></input>
                          </div>
                          <div className='text-center'>
                            <button className=' p-2 bg-amber-500 mt-2 rounded-2xl' onClick={() => setGoal(tar)}>Set Step</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center p-2 text-black font-semibold bg-gray-300 border-2 rounded">
                      <h1 className='mt-2 text-lg'>Calories Burn</h1>
                      <h1>Today</h1>
                      <div className="mt-2 bg-orange-500 rounded-lg p-1 text-white text-center">
                         <span className="font-bold">{(steps * 0.04).toFixed(1)}</span> cal burned
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* step traker */}
            <div className=' justify-center items-center w-[100%]'>
              <div className=' w-[100%] rounded-2xl p-4'>
                <WeeklyStepsPlot ></WeeklyStepsPlot>?\
              </div>
              <div>
                <Fitbit_Auth></Fitbit_Auth>
              </div>
            </div>
          </div>
          <div className='border-2  border-gray-500 p-2 mt-10  ml-20 mr-20 mb-10 max-h-100 overflow-auto rounded-xl bg-purple-950'>
            {/* <h1 className='text-center text-white text-xl font-semibold bg-indigo-900 p-2'>Your AI Wellness Agent</h1> */}
            <div className='flex justify-center m-2'>

              <div className="flex items-center gap-3 mb-4 border-b border-gray-700 pb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-xl">
                  🤖
                </div>
                <div>
                  <h2 className="text-white font-bold">AI Wellness Coach</h2>
                  <p className="text-green-400 text-xs"> Online</p>
                </div>
              </div>

              <div>
                {/* <button onClick={() => getdata()}>click</button> */}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                  }`}>
                  {msg.role === "assistant" && (
                    <span className="mr-2 text-lg">🤖</span>
                  )}
                  <div className={`rounded-2xl px-4 py-2 max-w-[80%] text-sm ${msg.role === "user"
                      ? "bg-blue-500 text-white rounded-tr-none"
                      : "bg-[#0f172a] text-gray-200 rounded-tl-none"
                    }`}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Loading dots */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#0f172a] rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestions
            {/* {messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="bg-[#0f172a] text-blue-400 text-xs 
                         px-3 py-1 rounded-full border border-blue-400 
                         hover:bg-blue-400 hover:text-white transition-all"
                  >
                    {s}
                  </button>
                ))} */}
              {/* </div> */}
            
            {/* Input Box */}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Ask your wellness coach..."
                className="flex-1 bg-[#0f172a] text-white rounded-xl 
                     px-4 py-2 outline-none border border-gray-600
                     focus:border-blue-500 transition-all text-sm"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50
                     text-white px-4 py-2 rounded-xl transition-all"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      }

      {
        (isChange) && (profileLoading || haveProfile) ? (profileLoading) && <div className='text-center font-semibold text-xl p-2 text-white'>Loading...</div> :
          <div className='md:w-[80%] md:flex md:float-right m-5 p-2 mt-10 '>
            <div className='md:w-[90%] flex justify-center items-center overflow-hidden'>
              {error && user_data ? <div>
                <h1>Something Went Wrong</h1>
              </div> :
                <div>
                  <h1 className='slide-in-from-left text-transparent text-center m-10 p-2 
                    bg-gradient-to-b from-sky-50 via-sky-200 to-sky-400 bg-clip-text
                    md:text-5xl text-2xl '>Your Personalized Wellness Journey
                    <h1 className='mt-3'>Starts Here</h1></h1>
                  <h1 className='text-center   text-gray-300 '>Monitor your wellness journey with intelligent insight . Get Personal daily</h1>
                  <h1 className='text-center   text-gray-300 '>recommendation that adopt to your unique health</h1>
                  <div className='flex justify-center items-center m-10' >
                    {auth ? <Link to={"/info"} className='bg-gradient-to-b from-black via-gray-600 to-gray-300 text-slate-50 font-bold text-xl p-1 rounded-2xl cursor-pointer  hover:text-2xl'>{error_profile ? "Something Went Wrong Try Again" : "Set-up Your Profile"}</Link>
                      : <Link to={"/login"} className='bg-sky-700 hover:bg-sky-600 cursor-pointer text-white rounded-2xl p-2 font-bold
                    '>Start Your Jouney &gt; </Link>}
                  </div>
                  <div className='border-t-1 p-2 border-white '>
                    <h1 className='text-center text-2xl text-gray-100 mb-10 mt-5 font-semibold'>Explore Features </h1>
                    <div className=''>
                      <div className='grid grid-cols-1 md:grid-cols-3 gap-5 justify-items-center'>
                        <div>
                          <div className='relative'>
                            <img src={stepImg} alt="" className='rounded-xl bg-gradient-to-b from-black/80 to-transparent' />
                            <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 rounded-xl"></div>
                            {/* <h1 className='text-center text-white '> Step Tracking</h1> */}
                          </div>
                          <h1 className='text-center text-white m-2 bg-black/20 hover:text-lg'> Step Tracking</h1>
                        </div>
                        <div>
                          <div className='relative  '>
                            <img src={chatBot} alt="" className='rounded-xl bg-gradient-to-b from-black/80 to-transparent p-3' />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 rounded-xl"></div>
                            {/* <h1 className='text-center text-white '> Step Tracking</h1> */}
                          </div>
                          <h1 className='text-center text-white m-2 bg-black/20 hover:text-lg '>AI Chatbot</h1>
                        </div>
                        <div>
                          <div className='relative m'>
                            <img src={mood} alt="" className='rounded-xl bg-gradient-to-b from-black/80 to-transparent w-100 h-51 ' />
                            {/* <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 rounded-xl  "></div> */}
                            {/* <h1 className='text-center text-white '> Step Tracking</h1> */}
                          </div>
                          <h1 className='text-center text-white m-2 bg-black/20 hover:text-lg '> Mood Analysis</h1>
                        </div>
                      </div>
                      <div className='flex justify-center mt-2'>
                        <div className=''>
                          <div className='relative m'>
                            <img src={dashboard} alt="" className='rounded-xl bg-gradient-to-b from-black/80 to-transparent w-80 h-51 ' />
                            <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 rounded-xl  "></div>
                            {/* <h1 className='text-center text-white '> Step Tracking</h1> */}
                          </div>
                          <h1 className='text-center text-white m-2 bg-black/20 hover:text-lg '>Health Stats</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
      }
    </div >
  )
}

export default Dashboard;
