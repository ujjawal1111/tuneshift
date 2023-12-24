import React, { useEffect } from 'react';
import axios from 'axios';

const PlaylistTransferButton = () => {
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

    console.log('Done with playlist transfer');
    // Handle the response data if needed
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    // Handle the error more specifically if needed
  }
};


    
  return (
    <div>
      <button onClick={temporaryHandleTransfer}>Transfer Playlist to YouTube Music</button>
    </div>
  );
};

export default PlaylistTransferButton;
