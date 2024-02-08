import React from 'react';
import SpotifyLoginButton from '../SpotifyLoginButton';
import GoogleLoginButton from '../GoogleLoginButton';

const Nativelogin = () => {
  return (
    <div className="h-screen flex relative">
        
      {/* Left Side with Image */}
      <div className="w-1/2 relative bg-gradient-to-tr from-green-200 to-slate-500">
        
        <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
          <div className="max-w-md mx-4 bg-gradient-to-r from-green-600 to-emerald-200 p-6 rounded-md shadow-md text-white rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Login with Spotify</h2>
            <p className="text-gray-600 mb-4">Connect your Spotify account to get started.</p>
            <SpotifyLoginButton />
          </div>
        </div>
      </div>

      {/* Right Side with Google Login */}
      <div className="w-1/2 overflow-hidden relative">
        <img
          className="w-full h-full object-cover rounded-r-md"
          src="https://images.pexels.com/photos/983831/pexels-photo-983831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Your Image"
        />
        <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
          <div className="max-w-md mx-4 bg-gradient-to-r from-cyan-500 to-blue-100 p-6 rounded-2xl shadow-md text-white">
            <h2 className="text-2xl font-bold mb-4">Login with Google</h2>
            <p className="text-gray-600 mb-4">Sign in with your Google account.</p>
            <GoogleLoginButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nativelogin;
