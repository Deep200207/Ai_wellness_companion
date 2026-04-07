import React, { useEffect, useState } from 'react'
import hospital from '../assets/hospital.jpg'
import pharmacy from '../assets/pharmacy.jpg'
import clinic from '../assets/doctorClinic.jpeg'
import {Link } from 'react-router-dom'

export default function MedicalDeatails() {
  const [places, setPlaces]= useState([]);
  const [loading, setLoading]= useState(false);
  return (
    <div className='w-[100%] md:w-[85%] float-right mt-15 md:mt-2'>
      <h1 className='text-center text-2xl text-white font-semibold mt-10 '>Nearby Healthcare Services</h1>
      <div className='grid md:grid-cols-3 mt-10 m-10 '>
        <div className='md:w-100 p-15 md:p-10' >
          <img src={hospital} alt="" className='h-50 rounded-2xl'/>
          <div>
            <Link to={'/hos'} className=' text-white font-semibold  text-xl '>
            <h1 className='text-center m-2'>Hospital</h1></Link>
          </div>
        </div>
        <div className='w-100  p-15 md:p-10' >
          <img src={pharmacy} alt="" className='h-50 rounded-2xl' />
          <div>
            <Link to={"/phar"} className='text-center text-white font-semibold text-xl'>
            <h1 className='m-2'>Pharmacy</h1></Link>
          </div>
        </div>
        <div className='w-100 p-15 md:p-10' >
          <img src={clinic} alt="" className='h-50 rounded-2xl'/>
          <div>
            <h1 className='text-center text-white font-semibold m-2 text-xl'>Doctors Details</h1>
          </div>
        </div>
        {places? places.map((item,index)=>{
          return(
            <div key={index}>
              {item.tags?.name}
            </div>
          )
        }):<h1>No Place</h1>}
      </div>
    </div>
  )
}
