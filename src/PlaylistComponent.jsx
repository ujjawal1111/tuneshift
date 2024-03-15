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
    sessionStorage.setItem('selectedPlaylistDetails', JSON.stringify(selectedPlaylistDetails));
    sessionStorage.setItem('selectedPlaylistName', playlist.name);
    sessionStorage.setItem('selectedPlaylistImage', playlist.images.length > 0 ? playlist.images[0].url : '');


    
    navigate(`/transfer-to-youtube`);
  } catch (error) {
    console.error('Error fetching playlist details:', error.message);
  }
};

return (
    <div className="playlist-container bg-gradient-to-r from-amber-200 to-yellow-100">
      {isLoading ? (
        <p>Loading playlists...</p>
      ) : (
        
        <div className="card-container mt-8">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="card" onClick={() => handlePlaylistClick(playlist)}>
              <img
                src={playlist.images.length > 0 ? playlist.images[0].url : 'default-image-url'}
                alt={'https://images.pexels.com/photos/5077396/pexels-photo-5077396.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
              />
              <div className="card-content ">
                <p className="playlist-name p">{playlist.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistComponent;