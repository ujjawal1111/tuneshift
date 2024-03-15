import React, { useState } from 'react';

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import Home from './Home';
import SpotifyLoginButton from './SpotifyLoginButton';
import PlaylistLinkButton from './PlaylistLinkButton';
import GoogleLoginButton from './GoogleLoginButton';
import SmartLinkConversion from './pages/SmartLinkConversion';
import TopNavbar from './TopNavbar';
import PlaylistComponent from './PlaylistComponent';
import PlaylistCardDisplay from './PlaylisttCardDisplay';
import { useContext } from 'react';
import TransferSuccess from './TransferSuccess';
import NativeLogin from './pages/NativeLogin';


import SmartLinkContextProvider from './context/SmartLinkContextProvider';
import PlaylistTransferToYoutube from './PlaylistTransferToYoutube';
import Footer from './Footer';
import LinkOrigin from './pages/LinkOrigin';
import SmartLinkCreation from './pages/SmartLinkCreation';
import SmartLinkContext from './context/SmartLinkContext';
import RedirectComponent from './RedirectRoute';

axios.defaults.baseURL ='http://localhost:5005';
axios.defaults.withCredentials=true;

const App = () => {
  return (
    <>
    <SmartLinkContextProvider>
    <Router>
      <TopNavbar />
        <Routes>
        <Route path="" element={<Home />} />
        
        <Route path="" element={<Home />} />
        <Route path="spotify-login" element={<><NativeLogin /></>} />
        <Route path="spotify-callback" element={<NativeLogin/>} />
        <Route path="spotify-callback2" element={<RedirectComponent/>} />
        <Route path="view-spotify-playlists" element={<PlaylistComponent/>} />
        <Route path="google-login" element={<NativeLogin/>} />
        <Route path="google-callback" element={<NativeLogin/>} />
        <Route path="transfer" element={<PlaylistTransferToYoutube/>} />
        <Route path="transfer-success" element={<TransferSuccess />} />
        <Route path="playlist-card-display" element={<PlaylistCardDisplay/>}/>
        <Route path="transfer-to-youtube" element={<PlaylistTransferToYoutube/>}/>
        <Route path="create-smartlink" element={<LinkOrigin/>}/>
        <Route path="native-login" element={<NativeLogin />} />
        <Route path="share-your-link" element={<SmartLinkCreation />} />
        <Route path="playlistlink/:playlist_link"element={<SmartLinkConversion/>}/>
        <Route path="playlistlink"element={<SmartLinkConversion/>}/>    
      </Routes>
      
    
    </Router>
    </SmartLinkContextProvider>
    
    </>
  );
};

export default App;