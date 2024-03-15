import React from "react";
import SpotifyLoginButton from "../SpotifyLoginButton";
import GoogleLoginButton from "../GoogleLoginButton";

const LinkOrigin = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-bl from-yellow-200 to-amber-600">
      <div className="flex space-x-4">
        
      <div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mr-6">
           <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Login With Spotify</h5>
          <div><SpotifyLoginButton/></div>
        </div>

        {/* Google Login Button Card */}
       <div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-800 ml-6">
           <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Login With Google</h5>
          <div><GoogleLoginButton/></div>
        </div>
      </div>
    </div>
  );
};

export default LinkOrigin;
