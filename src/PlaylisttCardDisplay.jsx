import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PlaylistComponent.css';
import ModalComponent from './ModalComponent';

const PlaylistCardDisplay = () => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get('/view-youtube-playlists');
        setPlaylists(response.data.items);
      } catch (error) {
        console.error('Error fetching playlists:', error.message);
      }
    };

    fetchPlaylists();
  }, []);

  const handleCardClick = (playlist) => {
    // Store the selected playlist in state
    setSelectedPlaylist(playlist);

    // Save the playlist ID and name to local storage
    sessionStorage.setItem('youtubePlaylistId', playlist.id);
    sessionStorage.setItem('youtubePlaylistName', playlist.snippet.title);
  };

  const handleCloseModal = () => {
    // Clear the selected playlist when the modal is closed
    setSelectedPlaylist(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-teal-400 to-blue-800">
      <div className="playlist-container">
        {/* Render playlists as cards using the playlists state */}
        <div className="card-container">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="card" onClick={() => handleCardClick(playlist)}>
              {/* Use the styles from PlaylistComponent.css */}
              <img src={playlist.snippet.thumbnails.medium.url} alt={playlist.snippet.title} className="card-img" />
              <p className="playlist-name">{playlist.snippet.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Render the ModalComponent when a playlist is selected */}
      {selectedPlaylist && (
        <ModalComponent showModal={true} onClose={handleCloseModal} playlist={selectedPlaylist} />
      )}
    </div>
  );
};

export default PlaylistCardDisplay;