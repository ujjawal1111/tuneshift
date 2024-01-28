// src/components/Home.js
import React from 'react';
import TopNavbar from './TopNavbar';
import { Link } from 'react-router-dom';

import './Home.css'
import SpotifyLoginButton from './SpotifyLoginButton';


const Home = () => {
  return (
    <div className= "h-screen flex">
      <div class="w-1/2 p-4">
        <h1 class="text-8xl font-bold">Playlist Converter</h1>
      <p className='text-4xl mt-6 mb-6'>Welcome to our playlist conversion tool</p>
      <button className='text-4xl font-medium font-light bg-blue-500 rounded-full px-6 py-4'><Link to="spotify-login">Start Converting</Link></button>
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
