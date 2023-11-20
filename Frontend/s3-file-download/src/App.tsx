// Import necessary libraries and components
import React, { useRef, useState } from "react";
import axios from "axios";
import fileDownload from "js-file-download";
import downloadService from "./services/DownloadService";
import "./App.css";
import Draggable from "react-draggable";

// The AbortController needs to persist across re-renders of your component. If you declare it inside your App function, a new AbortController will be created every time your component re-renders, which means you won't be able to cancel a download that started before the last re-render.
// By declaring abortController outside of the App function, you ensure that the same AbortController is used across all re-renders.
// If you want to keep the AbortController inside your component, you can use the useRef hook to persist the AbortController across re-renders:
function App() {
  // useState is a Hook that lets you add React state to function components
  // Here we're creating state variables for downloadProgress and error
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  // Define the handleDownload function
  const handleDownload = () => {
    // When the download Promise resolves, download the file and reset the progress
    // If the Promise is rejected, check if it was cancelled or if an error occurred
    abortControllerRef.current = new AbortController();
    downloadService("http://localhost:3001/download", setDownloadProgress, abortControllerRef.current?.signal)
      .then((response) => {
        fileDownload(response.data, "sample.txt");
        setDownloadProgress(0);
      })
      .catch((error) => {
        // axios.isCancel checks if the error was caused by a cancelled request
        if (axios.isCancel(error)) {
          console.log("Download cancelled");
        } else {
          setError(`Error downloading file: ${error}`);
        }
      });
  };

  // Define the handleCancel function
  const handleCancel = () => {
    // If the AbortController exists, call abort to cancel the download
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setDownloadProgress(0);
    }
  };

  // Render the App component
  return (
    <div className="App">
      <header className="App-header">
        <h1>S3 File Download</h1>
        <button onClick={handleDownload} disabled={downloadProgress !== 0}>
          Download File
        </button>
        {downloadProgress > 0 && (
          // Use the Draggable component to make the download container draggable
          <Draggable>
            <div className="download-container">
              <div>
                Download Progress: {downloadProgress.toFixed(2)}%
                <progress value={downloadProgress} max="100" className="progress-bar"></progress>
              </div>
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel Download
              </button>
            </div>
          </Draggable>
        )}
        {error && <div>Error: {error}</div>}
      </header>
    </div>
  );
}

// Export the App component as the default export
export default App;
