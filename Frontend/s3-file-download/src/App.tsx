import React, { useRef, useState } from "react";
import axios, { CancelTokenSource } from "axios";
import fileDownload from "js-file-download";
import downloadService from "./services/DownloadService";
import "./App.css";

function App() {
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // cancelTokenSourceRef is a ref that holds the CancelTokenSource.
  // When the cancel button is clicked, handleCancel checks if
  // cancelTokenSourceRef.current is not null, and if it's not, it calls cancel on it.
  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null);

  const handleDownload = () => {
    const [downloadPromise, cancelTokenSource] = downloadService("http://localhost:3001/download", setDownloadProgress);
    cancelTokenSourceRef.current = cancelTokenSource;

    // The second argument to downloadService is a callback function that updates the download progress state.
    downloadPromise
      .then((response) => {
        fileDownload(response.data, "sample.txt");
        setDownloadProgress(0);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Download cancelled");
        } else {
          setError(`Error downloading file: ${error}`);
        }
      });
  };

  const handleCancel = () => {
    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel("Download cancelled by the user");
      setDownloadProgress(0);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>S3 File Download</h1>
        <button onClick={handleDownload} disabled={downloadProgress !== 0}>
          Download File
        </button>
        {downloadProgress > 0 && (
          <div className="download-container">
            Download Progress: {downloadProgress.toFixed(2)}%<progress value={downloadProgress} max="100"></progress>{" "}
            <button className="cancel-icon" onClick={handleCancel}>
              Cancel Download
            </button>
          </div>
        )}
        {error && <div>Error: {error}</div>}
      </header>
    </div>
  );
}

export default App;
