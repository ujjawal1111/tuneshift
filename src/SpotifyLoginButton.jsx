import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PlaylistLinkButton from './PlaylistLinkButton';
import PlaylistComponent from './PlaylistComponent';

const SpotifyLoginButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Check if the Spotify access token cookie is present
        const response = await axios.get("/check-spotify-login");
        if (response.data.loggedIn) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error checking Spotify login status:', error.message);
      }
    };

    // Call the function to check login status
    checkLoggedIn();
  }, []);
  
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

  const handleSpotifyLogout = async() => {
    try{
        await axios.post("/spotify-logout");
        
        window.location.href='/spotify-login';
    }
    catch(error){
        console.error('Error logging out from Spotify:', error.message);
    }
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
    <div className=' flex mt-8 mb-4 mx-8'>

       {/* <div className='flex-shrink-0 w-80 h-80'>
      
      <img src='https://images.pexels.com/photos/18938604/pexels-photo-18938604/free-photo-of-song-on-spotify-on-tablet.jpeg' alt='Spotify Logo' className='w-full h-full object-cover' />
    </div> */}
      <div className='flex-grow flex items-center justify-end pl-4'>
      {isLoggedIn ? (
        <>
        
        <Link to ='/view-spotify-playlists'><button  type="button" class="text-white rounded-3xl bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">View Playlists</button></Link>
        <button onClick={handleSpotifyLogout}type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Logout From Spotify</button>

        {/* <a href="/view-spotify-playlists">View Playlists</a> */}
        </>
      ) : 
      (
        <button  onClick={handleSpotifyLogin}type="button" class="text-white bg-[#030f0399] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium 
        rounded-lg text-sm px-10 py-25 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" height="80" width="120" viewBox="-33.4974 -55.829 290.3108 334.974"><path d="M177.707 98.987c-35.992-21.375-95.36-23.34-129.719-12.912-5.519 1.674-11.353-1.44-13.024-6.958-1.672-5.521 1.439-11.352 6.96-13.029 39.443-11.972 105.008-9.66 146.443 14.936 4.964 2.947 6.59 9.356 3.649 14.31-2.944 4.963-9.359 6.6-14.31 3.653m-1.178 31.658c-2.525 4.098-7.883 5.383-11.975 2.867-30.005-18.444-75.762-23.788-111.262-13.012-4.603 1.39-9.466-1.204-10.864-5.8a8.717 8.717 0 015.805-10.856c40.553-12.307 90.968-6.347 125.432 14.833 4.092 2.52 5.38 7.88 2.864 11.968m-13.663 30.404a6.954 6.954 0 01-9.569 2.316c-26.22-16.025-59.223-19.644-98.09-10.766a6.955 6.955 0 01-8.331-5.232 6.95 6.95 0 015.233-8.334c42.533-9.722 79.017-5.538 108.448 12.446a6.96 6.96 0 012.31 9.57M111.656 0C49.992 0 0 49.99 0 111.656c0 61.672 49.992 111.66 111.657 111.66 61.668 0 111.659-49.988 111.659-111.66C223.316 49.991 173.326 0 111.657 0" fill="#191414"/></svg>
        Sign in with Spotify
        </button>

        
      )}
      </div>
    </div>
  );
};

export default SpotifyLoginButton;
