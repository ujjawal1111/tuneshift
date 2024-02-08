// SpotifyModalComponent.js
import React from 'react';
import { Button, Modal } from 'flowbite-react';

const SpotifyModalComponent = ({ showModal, onClose, playlist }) => {
  // Handle the Spotify playlist click without the conversion logic
  const handlePlaylistClick = () => {
    // Perform any actions or update UI based on the playlist click
    console.log(`Clicked on Spotify playlist: ${playlist.name}`);
  };
  let spotifyPlaylist=sessionStorage.getItem("selectedSpotifyPlaylist");

  return (
    <Modal dismissible show={showModal} onClose={onClose}>
      <Modal.Header>{spotifyPlaylist.snippet.title}</Modal.Header>

      <Modal.Body>
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            Explore the magic of this playlist:
          </p>
          <h2 className="text-2xl font-bold text-blue-500 dark:text-blue-300 mb-4">
            {playlist.name}
          </h2>
          <img
            src={playlist.images.length > 0 ? playlist.images[0].url : 'default-image-url'}
            alt={playlist.name}
            className="w-1/2 h-auto rounded-lg mx-auto"  // Set width to 50%
          />
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400 mt-4">
            Immerse yourself in the enchanting melodies and let the music tell its story.
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {/* Remove the "Convert Now!" button and handle the playlist click */}
        <Button onClick={handlePlaylistClick}>Close</Button>
        <Button onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SpotifyModalComponent;