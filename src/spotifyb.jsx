import React, { useEffect, useState } from "react";
import axios from "axios";

// ... (your imports)

export default function SpotifyB() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const CLIENT_ID = '608f93ae25dd4fd6be9ac36ee761a8ef';
  const REDIRECT_URI = 'http://localhost:3000/spotify-callback';
  const CLIENT_SECRET = 'c5e18864618744df8b94493bb4029ec9';
  const handleSpotifyLogin = async () => {
    try {
      // Initiate Spotify OAuth login directly from the frontend
      const authUrl = 'https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=user-read-private%20user-read-email'; // Replace with your Spotify authorization URL

      // Open Spotify's OAuth consent screen in the same window
      const popup = window.open(authUrl, '_blank');

      // Listen for messages from the popup window
      window.addEventListener('message', async (event) => {
        if (event.origin === window.location.origin && event.data.source === 'spotify-oauth') {
          // Get the authorization code from the message
          const authorizationCode = event.data.code;
          console.log('Authorization Code from Spotify:', authorizationCode);

          // Send the authorization code to the backend for token exchange
          try {
            const response = await axios.post('http://localhost:5005/spotify-exchange-token', {
              code: authorizationCode,
            });
            console.log('Backend Response:', response.data);
          } catch (error) {
            console.error('Error exchanging code for tokens:', error.message);
          }
        }
      });
    } catch (error) {
      console.error('Error initiating Spotify OAuth login:', error.message);
    }
  };
  const loginHandler = async () => {
    try {
      const response = await axios.get("http://localhost:5005/spotify-auth-url");
      const spotifyAuthUrl = response.data.authorizationUrl;

      // Redirect to Spotify authorization
      window.location.href = spotifyAuthUrl;
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const logoutHandler = () => {
    // Assuming your backend has a logout endpoint to handle necessary cleanup
    axios.post("http://localhost:5005/logout")
      .then(() => {
        // Clear any client-side state or perform additional cleanup
        setIsLoggedIn(false);
      })
      .catch((error) => {
        console.error("Error logging out:", error.message);
      });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");
    const provider = urlParams.get("provider"); // Add a query parameter to identify the provider

    if (authCode && provider) {
      if (provider === "spotify") {
        console.log("Spotify Authorization Code from URL:", authCode);
        sendAuthCodeToBackend(authCode, "spotify");
      } else if (provider === "google") {
        console.log("Google Authorization Code from URL:", authCode);
        sendAuthCodeToBackend(authCode, "google");
      }
    }
  }, []);

  const sendAuthCodeToBackend = async (authCode, provider) => {
    try {
      console.log(`Sending ${provider} authorization code to backend:`, { code: authCode });
      const response = await axios.post(`http://localhost:5005/${provider}-callback`, {
        code: authCode,
      });
      console.log(`${provider} Backend Response:`, response.data);

      // Update the state to indicate that the user is logged in
      setIsLoggedIn(true);
    } catch (error) {
      console.error(`Error sending ${provider} authorization code to the backend:`, error.message);
    }
  };

  return (
    <div>
      
        <button onClick={handleSpotifyLogin}>Login with your Spotify</button>
      
    </div>
  );
}
