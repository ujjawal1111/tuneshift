import React, { useState } from 'react';
import { useContext } from 'react';
import { Button, Modal } from 'flowbite-react';
import axios from 'axios'; // Import Axios
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import SmartLinkContext from './context/SmartLinkContext';




const ModalComponent = ({ showModal, onClose, playlist }) => {
  const [isloading,setloading]=useState(false);
  const navigate = useNavigate();

  const{playlistData,setPlaylistData}=useContext(SmartLinkContext);

  const onCreateLink = async ({ playlist }) => {
   try {
      const response = await axios.post('create-yt-link', {
        playlistId: sessionStorage.getItem('youtubePlaylistId'),
        playlistName: sessionStorage.getItem('youtubePlaylistName'),
        playlistImageUrl: sessionStorage.getItem('youtubePlaylistImage')
      });

      const linkCreated = response.data.linkCreated;
      console.log(linkCreated);
      setPlaylistData(linkCreated);
      sessionStorage.setItem("linkCreated",linkCreated);

      // Use navigate function to redirect to "/share-your-link"
      window.location.href='/share-your-link';
    } catch (error) {
      console.error('Error during link creation:', error.message);
      // Handle error
      toast.error('An error occurred while creating link');
    }
  };
  const onConvert = async () => {
  try {
    // Make an API call to your backend using Axios
    
    let spotifyUserId = sessionStorage.getItem("spotifyUserId");
    if (spotifyUserId === null) {
      toast("Please login to your Spotify Account"); // Corrected the syntax here
    }

    setloading(true);
    
    const response = await axios.post('transfer-to-spotify', {
      playlistId: sessionStorage.getItem("youtubePlaylistId"),
      playlistName: sessionStorage.getItem("youtubePlaylistName"),
      spotifyUserId: sessionStorage.getItem("spotifyUserId")
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
      setloading(false);

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
    <Modal dismissible show={showModal} onClose={onClose}>
      <Modal.Header>{playlist.snippet.title}</Modal.Header>
      <Modal.Body>
        
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            Explore the magic of this playlist:
          </p>
          <h2 className="text-2xl font-bold text-blue-500 dark:text-blue-300 mb-4">
            {playlist.snippet.title}
          </h2>
          <img
            src={playlist.snippet.thumbnails.medium.url}
            alt={playlist.snippet.title}
            className="w-1/2 h-auto rounded-lg mx-auto"  // Set width to 50%
          />
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400 mt-4">
            Immerse yourself in the enchanting melodies and let the music tell its story.
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onConvert}>Convert Now!</Button>
       <Button onClick={onCreateLink}>Create Link</Button>
        <Button onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalComponent;
