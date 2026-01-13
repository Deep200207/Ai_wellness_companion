import React from 'react'
import Navbar from './Navbar'
import { Routes,Route } from 'react-router-dom'
import Dashboard from './Components/Dashboard'
import Login from './Authentication/Login'
import SignUp from './Authentication/SignUp'
import User_info from './journey/user_info'
import Fitbit_Auth from './Components/Fitbit_Auth'
import Profile from './Components/Profile'
import ChatBot from './Components/ChatBot'

// import DashBord2 from './Components/DashBord2'
export default function App() {
  return (
    <>
    <Navbar></Navbar>
    <Routes>
      <Route path='/profile' element={<Profile></Profile>}></Route>
      <Route path='/' element={<Dashboard></Dashboard>}></Route>
      <Route path='/Auth' element={<Fitbit_Auth></Fitbit_Auth>}></Route>
      <Route path='/login' element={<Login></Login>}></Route>
      <Route path='/info' element={<User_info></User_info>}></Route>
      <Route path='/signup' element={<SignUp></SignUp>}></Route>
      <Route path='/chatbot' element={<ChatBot></ChatBot>}></Route>
    </Routes>
    </>
  )
}
