import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import SmartLinkContext from '../context/SmartLinkContext';

const SmartLinkConversion = () => {
  const { playlist_link } = useParams();
  const [playlistData, setPlaylistData ] = useState(null);
  const [isSpotifyLoggedIn, setIsSpotifyLoggedIn] = useState(false);
  const tempPlaylistData=JSON.parse(sessionStorage.getItem("FetchedPlaylistData"));

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let linkToFetch = playlist_link;
        
        // Check if playlist_link is available in the URL
        if (!linkToFetch && tempPlaylistData && tempPlaylistData.length > 0) {
          // Use the one from the context if not available in the URL
          linkToFetch = tempPlaylistData[0].parameter;
          console.log("TempPlaylistData",tempPlaylistData);
          //console.log("hi");
        }
        console.log(linkToFetch);

        if (linkToFetch) {
          const response = await axios.post('/retrieve-link', { playlist_link: linkToFetch });

          setPlaylistData(response.data);
          sessionStorage.setItem('FetchedPlaylistData',JSON.stringify(response.data));
          console.log(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(playlist_link);
  }, []);



  const handleSpotifyClick=async()=>{
    try{
    const response=await axios.get('/spotify-auth2');
    const {spotifyAuthUrl}= response.data;
    console.log(spotifyAuthUrl);
    window.location.href = spotifyAuthUrl;
    
    }
    catch(error){

      console.error(error);
    }

  }
  //const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Check if the Spotify access token cookie is present
        const response = await axios.get("/check-spotify-login");
        if (response.data.loggedIn) {
          setIsSpotifyLoggedIn(true);
        }
      } catch (error) {
        console.error('Error checking Spotify login status:', error.message);
      }
    };

    // Call the function to check login status
    checkLoggedIn();
  }, []);
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
      setIsSpotifyLoggedIn(true);
    } catch (error) {
      console.error('Error exchanging code for Spotify access token:', error.message);
    }
  };

  const onSpotifyTransfer = async () => {
  try {
    // Make an API call to your backend using Axios
    let spotifyUserId = sessionStorage.getItem("spotifyUserId");
    // if (spotifyUserId === null) {
    //   toast("Please login to your Spotify Account"); // Corrected the syntax here
    // }

    //setloading(true);
    
    const response = await axios.post('transfer-to-spotify-2', {
      //playlistId: sessionStorage.getItem("youtubePlaylistId"),

      playlistName: playlistData[0].playlist_name,
      spotifyUserId: spotifyUserId,
      songList:playlistData[0].songList,
    });

    // Handle the response as needed
    if (response.status === 200) {
      console.log('Conversion successful!');
      // Extract playlistId from the response
      const playlistId = response.data.playlistId;
      const playlistImageUrl=response.data.playlistImageUrl;

      // Store the playlistId in local storage
      sessionStorage.setItem('createdPlaylistUrl', `open.spotify.com/playlist/${playlistId}`);
      sessionStorage.setItem('createdPlaylistImageUrl', playlistImageUrl);
      //setloading(false);

      // Perform any actions or update UI based on the successful conversion

      // Navigate to /transfer-success
      
      window.location.href = '/transfer-success';
    } else {
      console.error('Conversion failed:', response.statusText);
      // Handle the error or update UI accordingly
    }
  } catch (error) {
    console.error('Error during conversion:', error.message);
    // Handle the error or update UI accordingly
  }
};




  return (
    <div className='px-80 py-8 flex items-center 'style={{ backgroundImage: `url('https://images.pexels.com/photos/159376/turntable-top-view-audio-equipment-159376.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`, backgroundSize: 'cover' }}>
      

      {playlistData && playlistData.length > 0 && (
        

<div class=" bg-white border w-4/5 ml-1000 border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <div>
        <img class="object-fil object-contain rounded-t-lg" src={playlistData[0].image_url} alt="" />
    </div>
    <div class="p-5">
        <div>
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"> {playlistData[0].playlist_name}</h5>
        </div>
        
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Go ahead and import into your favourite streaming platform!</p>
        {isSpotifyLoggedIn ?(
            <button onClick={onSpotifyTransfer} type="button" className="px-8 text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2">
            <svg width="30px" height="30px" viewBox="0 0 20 20" version="1.1"  fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>spotify [#162]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -7479.000000)" fill="#000000"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M99.915,7327.865 C96.692,7325.951 91.375,7325.775 88.297,7326.709 C87.803,7326.858 87.281,7326.58 87.131,7326.085 C86.981,7325.591 87.26,7325.069 87.754,7324.919 C91.287,7323.846 97.159,7324.053 100.87,7326.256 C101.314,7326.52 101.46,7327.094 101.196,7327.538 C100.934,7327.982 100.358,7328.129 99.915,7327.865 L99.915,7327.865 Z M99.81,7330.7 C99.584,7331.067 99.104,7331.182 98.737,7330.957 C96.05,7329.305 91.952,7328.827 88.773,7329.792 C88.36,7329.916 87.925,7329.684 87.8,7329.272 C87.676,7328.86 87.908,7328.425 88.32,7328.3 C91.951,7327.198 96.466,7327.732 99.553,7329.629 C99.92,7329.854 100.035,7330.334 99.81,7330.7 L99.81,7330.7 Z M98.586,7333.423 C98.406,7333.717 98.023,7333.81 97.729,7333.63 C95.381,7332.195 92.425,7331.871 88.944,7332.666 C88.609,7332.743 88.274,7332.533 88.198,7332.197 C88.121,7331.862 88.33,7331.528 88.667,7331.451 C92.476,7330.58 95.743,7330.955 98.379,7332.566 C98.673,7332.746 98.766,7333.129 98.586,7333.423 L98.586,7333.423 Z M94,7319 C88.477,7319 84,7323.477 84,7329 C84,7334.523 88.477,7339 94,7339 C99.523,7339 104,7334.523 104,7329 C104,7323.478 99.523,7319.001 94,7319.001 L94,7319 Z" id="spotify-[#162]"> </path> </g> </g> </g> </g></svg>
            Transfer Now
            </button>
        ):(
          <>
        
        <button onClick={handleSpotifyClick} className="inline-flex  w-full sm:w-auto bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700">
            Get it on Spotify
             <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
        </button>
        <button  className=" ml-8 w-full sm:w-auto bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700">
            Get it on Youtube
             <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
        </button>
        </>
        )}
        
    </div>
</div>

      )}
         
      
    </div>
  );
};

export default SmartLinkConversion;