import React, { useState } from "react";
import { useLocation } from "react-router-dom";

export default function TransferSuccess() {
  const location = useLocation();
  const playlistUrl = location.state && location.state.playlistUrl;
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
    <div className="mt-10 mb-10 ml-10 mr-10">
      <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <img className="rounded-t-lg" src="/docs/images/blog/image-1.jpg" alt="" />
        <div className="p-5">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Playlist Transfer Successful</h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Thank You for using Tuneshift!</p>
          <div className="flex items-center mb-3">
            <input
              type="text"
              value={playlistUrl}
              readOnly
              className="flex-grow border p-2 rounded-md"
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
