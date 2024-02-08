import React, { useState } from "react";

export default function TransferSuccess() {
  const playlistUrl = sessionStorage.getItem("createdPlaylistUrl");
  const playlistImageUrl=sessionStorage.getItem("createdPlaylistImageUrl");
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(playlistUrl);
      setIsCopied(true);
    } catch (error) {
      console.error("Unable to copy to clipboard:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-teal-400 to-blue-800 flex items-center justify-center"
      style={{ backgroundImage: `url('https://images.pexels.com/photos/4895620/pexels-photo-4895620.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`, backgroundSize: 'cover' }}
    >
      <div className="max-w-lg bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <img
          className="w-full rounded-t-lg w-full h-40 object-cover"
          src={playlistImageUrl}
          alt=""
        />
        <div className="p-10">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Playlist Transfer Successful</h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Thank You for using Tuneshift!</p>
          <div className="flex items-center mb-3">
            <input
              type="text"
              value={playlistUrl}
              readOnly
              className="flex-grow border rounded-md"
            />
            <button
              onClick={copyToClipboard}
              className="ml-2 px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {isCopied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
