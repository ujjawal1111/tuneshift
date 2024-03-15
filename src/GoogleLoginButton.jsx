import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PlaylistTransferToSpotify from "./PlaylistTransferToYoutube";
import ViewGooglePlaylists from "./ViewGooglePlaylists";

const GoogleLoginButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkGoogleAccessToken = async () => {
      try {
        // Check if the user is already logged in by checking for the presence of the Google access token cookie
        const response = await axios.get("http://localhost:5005/check-google-access-token");
        const isLoggedIn = response.data.isLoggedIn;
        setIsLoggedIn(isLoggedIn);
       // useNavigate('/native-login');
      } catch (error) {
        console.error("Error checking Google access token:", error.message);
      }
    };

    checkGoogleAccessToken();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      // Initiate Google OAuth login directly from the frontend
      const response = await axios.get("http://localhost:5005/google-auth-url");
      const authUrl = response.data.authUrl;

      // Open Google's OAuth consent screen in the same window
      window.location.href = authUrl;
    } catch (error) {
      console.error("Error initiating Google OAuth login:", error.message);
    }
  };

  const handleGoogleLogout = async() => {
    // Update the state to indicate that the user is logged out
    try{
        await axios.post("/google-logout");

        window.location.href='/google-login';
    }
    catch(error){
        console.error('Error logging out from Google:', error.message);
    }
    setIsLoggedIn(false);
  };

  
  const handleGoogleCallback = () => {
    // Extract the authorization code from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get("code");

    // Call the function to exchange the authorization code for the Google access token
    if (authorizationCode) {
      exchangeGoogleToken(authorizationCode);
    }
  };

  const exchangeGoogleToken = async (authorizationCode) => {
    try {
      const response = await axios.post("http://localhost:5005/google-exchange-token", {
        code: authorizationCode,
      });

      const googleAccessToken = response.data.google_accessToken;
      console.log("Google Access Token:", googleAccessToken);

      // Update the state to indicate that the user is logged in
      setIsLoggedIn(true);

      // Optional: Redirect to a new page or perform additional actions
      //window.location.href = "/transfer";
    } catch (error) {
      console.error("Error exchanging code for Google access token:", error.message);
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <>
        <button
          type="button"
          onClick={handleGoogleLogout}
          className="text-black bg-slate-200 mr-6 hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Logout from Google
          
        </button>
        <ViewGooglePlaylists/>
        </>
      ) : (
        
        <button onClick={handleGoogleLogin} type="button" className="text-white px-8 py-8 mt-10 mb-10 ml-10  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2">
        <svg class="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
        <path fill-rule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clip-rule="evenodd"/>
        </svg>
        Sign in with Google
        </button>
      )}
        {window.location.search && handleGoogleCallback()} {/* Call the function to handle Google callback */}
    </div>
  );
};

export default GoogleLoginButton;
