import React from "react";
import axios from "axios";

const GoogleLoginButton = () => {
  const handleGoogleLogin = async () => {
    try {
      // Initiate Google OAuth login directly from the frontend
      const response = await axios.get('http://localhost:5005/google-auth-url');
      const authUrl = response.data.authUrl;

      // Open Google's OAuth consent screen in the same window
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error initiating Google OAuth login:', error.message);
    }
  };

  const handleGoogleCallback = () => {
    // Extract the authorization code from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');

    // Call the function to exchange the authorization code for the Google access token
    if (authorizationCode) {
      exchangeGoogleToken(authorizationCode);
    }
  };

  const exchangeGoogleToken = async (authorizationCode) => {
    try {
      const response = await axios.post('http://localhost:5005/google-exchange-token', {
        code: authorizationCode,
      });

      const googleAccessToken = response.data.googleAccessToken;
      console.log('Google Access Token:', googleAccessToken);

      // Now you can use the Google access token as needed

      // Optional: Redirect to a new page or perform additional actions
      window.location.href = '/transfer';
    } catch (error) {
      console.error('Error exchanging code for Google access token:', error.message);
    }
  };

  return (
    <div>
      <button onClick={handleGoogleLogin}>Login with Google</button>
      {handleGoogleCallback()} {/* Call the function to handle Google callback */}
    </div>
  );
};

export default GoogleLoginButton;
