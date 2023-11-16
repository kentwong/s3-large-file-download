import React, { useState } from "react";
import axios from "axios";
import fileDownload from "js-file-download";

function App() {
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = () => {
    axios({
      method: "get",
      url: "http://localhost:3001/download",
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        if (progressEvent.total !== undefined && progressEvent.total !== 0) {
          setDownloadProgress((progressEvent.loaded * 100) / progressEvent.total);
        }
      },
    })
      .then((response) => {
        fileDownload(response.data, "sample.txt");
        setDownloadProgress(0);
      })
      .catch((error) => {
        setError(`Error downloading file: ${error}`);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>S3 File Download</h1>
        <button onClick={handleDownload} disabled={downloadProgress !== 0}>
          Download File
        </button>
        {downloadProgress > 0 && (
          <div>
            Download Progress: {downloadProgress.toFixed(2)}%<progress value={downloadProgress} max="100"></progress>
          </div>
        )}
        {error && <div>Error: {error}</div>}
      </header>
    </div>
  );
}

export default App;
