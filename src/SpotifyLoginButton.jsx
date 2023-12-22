import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PlaylistLinkButton from './PlaylistLinkButton';
import PlaylistComponent from './PlaylistComponent';

const SpotifyLoginButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const handleSpotifyLogin = async () => {
    try {
      // Request to your backend to initiate Spotify authentication
      const authResponse = await axios.get('http://localhost:5005/spotify-auth');

      // Redirect to Spotify authorization
      window.location.href = authResponse.data.spotifyAuthUrl;
    } catch (error) {
      console.error('Error initiating Spotify authentication:', error.message);
    }
  };

  const handleSpotifyLogout = () => {
    // Implement your logout logic here
    setIsLoggedIn(false);
  };

  // Extract the authorization code from the URL after the user grants permission
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');

    if (authorizationCode) {
      // Call the function to exchange authorization code for access token
      exchangeToken(authorizationCode);
    }
  }, []);

  const exchangeToken = async (authorizationCode) => {
    try {
      // Request to your backend to exchange authorization code for access token
      const tokenResponse = await axios.post('http://localhost:5005/spotify-callback', {
        code: authorizationCode,
      });

      const { access_token, refresh_token } = tokenResponse.data;

      // Now you can use the access token as needed
       console.log('Spotify Access Token:', access_token);
      // spotifytoken=access_token;
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error exchanging code for Spotify access token:', error.message);
    }
  };

  return (
    <div>
     
      {isLoggedIn ? (
        <>
        <button  onClick={handleSpotifyLogout}>Logout from Spotify</button>
        <a href="/view-spotify-playlists">View Playlists</a>
        </>
      ) : (
        <button onClick={handleSpotifyLogin}> Login to Spotify</button>
      )}
    </div>
  );
};

export default SpotifyLoginButton;
