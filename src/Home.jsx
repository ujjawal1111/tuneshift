// src/components/Home.js
import React from 'react';
import TopNavbar from './TopNavbar';
import { Link } from 'react-router-dom';

import './Home.css'

const checkSmartlink =() =>{
    
}



const Home = () => {
  return (
    <div className= "h-screen flex">
      <div class="w-1/2 p-4 bg-gradient-to-bl from-yellow-200 to-amber-600">
        <h1 class="text-8xl font-bold">Playlist Converter</h1>
      <p className='text-4xl mt-6 mb-6'>Welcome to our playlist conversion tool</p>
      <Link to='/native-login'>
     
      <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-large rounded-lg text-lg px-10 py-6 inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Get Started
        <svg class="rtl:rotate-180 w-4 h-4 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
        </svg>
      </button>

      </Link>




      {/* <Link to={'/create-smartlink'}>
      <button onClick={checkSmartlink}type="button" class="text-white ml-10 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-large rounded-lg text-lg px-10 py-6 inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Create SmartLink
        <svg class="rtl:rotate-180 w-4 h-4 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
        </svg>
      </button>
      </Link> */}
    </div>

    <div className="w-1/2 overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src="https://images.pexels.com/photos/5077069/pexels-photo-5077069.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Your Image"
        />
      </div>
    
    
    
   
    </div>
  );
};

export default Home;