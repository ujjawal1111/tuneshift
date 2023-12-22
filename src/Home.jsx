// src/components/Home.js
import React from 'react';
import TopNavbar from './TopNavbar';
import { Link } from 'react-router-dom';

import './Home.css'
import SpotifyLoginButton from './SpotifyLoginButton';


const Home = () => {
  return (
    <div>
        
      
      <h1>Playlist Converter</h1>
      <p>Welcome to our playlist conversion tool!</p>

      <div><Link to="spotify-login">Start Converting</Link></div>
    </div>
  );
};

export default Home;
