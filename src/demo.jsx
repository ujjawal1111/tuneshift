import React, { useState } from 'react';
import './App.css';
import axios from 'axios';


function App() {


     const [token, setToken] = useState("");
     
     const CLIENT_ID = "608f93ae25dd4fd6be9ac36ee761a8ef"
    const REDIRECT_URI = "http://localhost:3001"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"


    
  const [playlistLink, setPlaylistLink] = useState('');
  const [playlistId, setPlaylistId] = useState(null);
  const [playlistDetails, setPlaylistDetails] = useState(null);

  function extractPlaylistIdFromLink(link) {
    try {
      const url = new URL(link);
      const pathnameParts = url.pathname.split('/');
      const extractedPlaylistId = pathnameParts[pathnameParts.length - 1];

      // Validate that the extracted ID is non-empty and alphanumeric
      if (extractedPlaylistId && /^[a-zA-Z0-9]+$/.test(extractedPlaylistId)) {
        setPlaylistId(extractedPlaylistId);
        
      } else {
        throw new Error('Invalid playlist link format');
      }
    } catch (error) {
      console.error('Error extracting playlist ID:', error.message);
      setPlaylistId(null);
    }
  }

  const handleSubmit = async(event) => {
    event.preventDefault();
    extractPlaylistIdFromLink(playlistLink);
    setPlaylistLink('');

     try {
      const response = await axios.get(`http://localhost:3000/getPlaylistDetails/${playlistLink}`);
      
      // Axios automatically checks for response.ok
      const data = response.data;
      setPlaylistDetails(data);
    } catch (error) {
      console.error('Error fetching playlist details:', error);
    } 
  };

  function spotifylogin(){

  }

  function logout(){

  }

  return (
    <div className="App">
      
      <h1 className="text-4xl text-center mb-4">tuneShift</h1>

      {!{token} ?
                    <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
                        to Spotify</a>
                    : <button onClick={logout}>Logout</button>}

                {/* {{token} ?
                    <form onSubmit={searchArtists}>
                        <input type="text" onChange={e => setSearchKey(e.target.value)}/>
                        <button type={"submit"}>Search</button>
                    </form>

                    : <h2>Please login</h2>
                } */}
    
      {/* <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Paste the link here..."
          value={playlistLink}
          onChange={(e) => setPlaylistLink(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form> */}

      {playlistId && (
        <div>
          <p>Extracted Playlist ID: {playlistId}</p>
          {/* Perform additional actions with the extracted playlist ID */}
        </div>
      )}
    </div>
  );
}

export default App;
