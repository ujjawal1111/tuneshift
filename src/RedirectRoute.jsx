import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const RedirectComponent = () => {
  // Use useEffect to trigger the redirect when the component mounts
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
      const tokenResponse = await axios.post('http://localhost:5005/spotify-callback2', {
        code: authorizationCode,
      });

      const { spotifyUserId, access_token, refresh_token } = tokenResponse.data;

      // Now you can use the access token as needed
      console.log('Spotify Access Token:', access_token);
      sessionStorage.setItem('spotifyUserId', spotifyUserId);
      // spotifytoken=access_token;
      //setIsLoggedIn(true);
    } catch (error) {
      console.error('Error exchanging code for Spotify access token:', error.message);
    }
  };
  useEffect(() => {
    // Use a timeout to simulate a delay (optional)
    const timeout = setTimeout(() => {
      // Replace '/new-route' with the desired route
      window.location.replace('/playlistlink/');
    }, 1000);

    // Cleanup the timeout to avoid memory leaks
    return () => clearTimeout(timeout);
  }, []);

  // Render a Navigate component, which will trigger a redirect
  return ;
};

export default RedirectComponent;
