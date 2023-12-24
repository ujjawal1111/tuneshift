import React, { useEffect } from 'react';
import axios from 'axios';

const PlaylistTransferButton = () => {
    const spotifyPlaylistName = localStorage.getItem('selectedPlaylistName');
  const handleTransfer = async () => {
    try {
      // Get the stored Spotify playlist ID from local storage
      const spotifyPlaylistName = localStorage.getItem('selectedPlaylistName');

      if (!spotifyPlaylistName) {
        console.error('Spotify playlist ID not found in local storage');
        return;
      }

      // Make a request to your backend to initiate the transfer
      const response = await axios.post(`http://localhost:5005/transfer-to-youtube-music`,{
        playlistName:{spotifyPlaylistName},
      });

     

      console.log('Transfer Response:', response.data);

      // Optional: Handle success or show a notification
    } catch (error) {
      console.error('Error transferring playlist:', error.message);
      // Optional: Handle errors or show an error notification
    }
  };

  
  const temporaryhandleTransfer=async()=>{

      await axios.post(`http://localhost:5005/temp-playlist-create`,{
        pName:spotifyPlaylistName,
      })
  .then(response => {
    console.log('done with playlist transfer');
    // Handle the response data if needed
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error:', error.message);
    // Handle the error
  });

    
  }
  return (
    <div>
      <button onClick={temporaryhandleTransfer}>Transfer Playlist to YouTube Music</button>
    </div>
  );
};

export default PlaylistTransferButton;
