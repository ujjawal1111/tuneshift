// PlaylistComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PlaylistComponent.css'; // Import your CSS file

const PlaylistComponent = () => {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get('http://localhost:5005/user-playlists', {
        
        });

        setPlaylists(response.data);
        console.log(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching playlists:', error.message);
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handlePlaylistClick = async (playlist) => {
  try {
    // Make a request to fetch the details of the selected playlist
    const response = await axios.get(`http://localhost:5005/get-playlist-details/${playlist.id}`);
    
    const selectedPlaylistDetails = response.data; // Assuming the API returns relevant details

    // Store the selected playlist details in local storage
    localStorage.setItem('selectedPlaylistDetails', JSON.stringify(selectedPlaylistDetails));
    localStorage.setItem('selectedPlaylistName', playlist.name);

    // Navigate to the Google Login page with the selected playlist ID
    navigate(`/google-login/`);
  } catch (error) {
    console.error('Error fetching playlist details:', error.message);
  }
};


  return (
    <div className="playlist-container">
      {isLoading ? (
        <p>Loading playlists...</p>
      ) : (
        <div className="card-container">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="card" onClick={() => handlePlaylistClick(playlist)}>
              <img
                src={playlist.images.length > 0 ? playlist.images[0].url : 'default-image-url'}
                alt={`Playlist: ${playlist.name}`}
              />
              <p className="playlist-name">{playlist.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistComponent;
