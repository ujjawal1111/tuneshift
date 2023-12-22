import React, { useState, useEffect } from "react";
import axios from "axios";

export default function PlaylistLinkButton() {
  const [playlistLink, setPlaylistLink] = useState('');
  const [playlistID, setPlaylistID] = useState('');
  const [playlistDetails, setPlaylistDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const getPlaylistIdFromLink = (playlistLink) => {
    const parts = playlistLink.split('/');
    const playlistIndex = parts.indexOf('playlist');

    if (playlistIndex !== -1 && parts[playlistIndex + 1]) {
      return parts[playlistIndex + 1];
    }

    return null;
  };

  useEffect(() => {
    const pId = getPlaylistIdFromLink(playlistLink);
    setPlaylistID(pId);
  }, [playlistLink]);

  const playlistHandler = (ev) => {
    setPlaylistLink(ev.target.value);
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    // Fetch playlist details when the form is submitted
    fetchPlaylistDetails();
  };

  const fetchPlaylistDetails = async () => {
    try {
      if (playlistID) {
        const response = await axios.get(`http://localhost:5005/get-playlist-details/${playlistID}`);
        setPlaylistDetails(response.data);
      }
    } catch (error) {
      console.error('Error fetching playlist information:', error.message);
    }
  };

  const transferToYTM = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`http://localhost:5005/transfer-to-youtube-music/${playlistID}`);
      console.log('Transfer response:', response.data);
      // You can handle the response as needed, such as showing a success message.
    } catch (error) {
      console.error('Error transferring playlist to YouTube Music:', error.message);
      // You can handle the error, such as showing an error message.
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Enter Playlist Link'
          value={playlistLink}
          onChange={playlistHandler}
        />
        <button type="submit">Submit</button>
      </form>

      {playlistDetails && (
        <div>
          <h2>Playlist Details:</h2>
          <p>Playlist Name: {playlistDetails.name}</p>

          {/* Display playlist image if available */}
          {playlistDetails.images && playlistDetails.images.length > 0 && (
            <img
              src={playlistDetails.images[0].url}
              alt={playlistDetails.name}
              style={{ width: '300px', height: '300px' }}
            />
          )}

          
        </div>
      )}

    </>
  );
}
