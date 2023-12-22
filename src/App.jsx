import React, { useState } from 'react';

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import Home from './Home';
import SpotifyLoginButton from './SpotifyLoginButton';
import PlaylistLinkButton from './PlaylistLinkButton';
import GoogleLoginButton from './GoogleLoginButton';

import TopNavbar from './TopNavbar';
import PlaylistComponent from './PlaylistComponent';
import PlaylistTransferButton from './PlaylistTransferButton';

axios.defaults.baseURL ='http://localhost:5005';
axios.defaults.withCredentials=true;

const App = () => {
  return (
    <>
    
    <Router>
      <TopNavbar />
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="spotify-login" element={<SpotifyLoginButton />} />
        <Route path="spotify-callback" element={<SpotifyLoginButton/>} />
        <Route path="view-spotify-playlists" element={<PlaylistComponent/>} />
        <Route path="google-login" element={<GoogleLoginButton />} />
        <Route path="google-callback" element={<GoogleLoginButton/>} />
        <Route path="transfer" element={<PlaylistTransferButton/>} />
      </Routes>
    </Router>
    
    </>
  );
};

export default App;