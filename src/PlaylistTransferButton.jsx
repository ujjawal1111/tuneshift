import React, { useEffect } from 'react';
import axios from 'axios';

const PlaylistTransferButton = () => {
  const handleTransfer = async () => {
    try {
      // Get the stored Spotify playlist ID from local storage
      const spotifyPlaylistId = localStorage.getItem('selectedPlaylistId');

      if (!spotifyPlaylistId) {
        console.error('Spotify playlist ID not found in local storage');
        return;
      }

      // Make a request to your backend to initiate the transfer
      const response = await axios.post(`http://localhost:5005/transfer-to-youtube-music/${spotifyPlaylistId}`);

      console.log('Transfer Response:', response.data);

      // Optional: Handle success or show a notification
    } catch (error) {
      console.error('Error transferring playlist:', error.message);
      // Optional: Handle errors or show an error notification
    }
  };

  useEffect(() => {
    // Optional: You can perform additional actions when the component mounts
    // For example, you might want to check if the user is logged in or has the required permissions
  }, []);

  return (
    <div>
      <button onClick={handleTransfer}>Transfer Playlist to YouTube Music</button>
    </div>
  );
};

export default PlaylistTransferButton;
