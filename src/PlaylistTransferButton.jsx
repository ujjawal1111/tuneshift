import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaylistTransferButton = () => {
    const navigate = useNavigate();

    let spotifyPlaylistName = localStorage.getItem('selectedPlaylistName');
  

let songarray;
let PlaylistObject = localStorage.getItem('selectedPlaylistDetails');
let spotifyPlaylist = JSON.parse(PlaylistObject);
//console.log(spotifyPlaylist)
if (spotifyPlaylist && spotifyPlaylist.tracks) {
  songarray = spotifyPlaylist.tracks;
}
//console.log(songarray);
const temporaryHandleTransfer = async () => {
  try {
    const response = await axios.post('http://localhost:5005/temp-playlist-create', {
      pName: spotifyPlaylistName, // Make sure spotifyPlaylistName is defined
      songarray: songarray,
    });
    const playlistUrl = response.data.playlistUrl;
    console.log(playlistUrl);
    console.log('Done with playlist transfer');
    // Handle the response data if needed
    console.log(response.data);
     navigate('/transfer-complete', { state: { playlistUrl } });
  } catch (error) {
    console.error('Error:', error.message);
    // Handle the error more specifically if needed
  }
};


    
  return (
    <div>
    {/* <button onClick={temporaryHandleTransfer}>Transfer Playlist to YouTube Music</button> */}
      <button  onClick={temporaryHandleTransfer}type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Transfer Playlist to YouTube Music</button>
    </div>
  );
};

export default PlaylistTransferButton;
