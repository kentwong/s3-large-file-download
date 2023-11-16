import React, { useState } from "react";
import fileDownload from "js-file-download";

function App() {
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      const response = await fetch("http://localhost:3001/download");
      const contentLengthHeader = response.headers.get("Content-Length");
      const contentLength = contentLengthHeader ? parseInt(contentLengthHeader, 10) : 0;

      if (!contentLength) {
        throw new Error("Content-Length header is missing or invalid");
      }

      const reader = response.body!.getReader();
      let receivedLength = 0;

      // Create a new ReadableStream to handle the data
      const rs = new ReadableStream({
        async start(controller) {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              // Reset download progress
              setDownloadProgress(0);
              controller.close();
              break;
            }

            receivedLength += value.length;
            // Enqueue the next data chunk into our stream
            controller.enqueue(value);
            // Calculate download progress
            const progress = (receivedLength / contentLength) * 100;
            setDownloadProgress(progress);
          }
        },
      });

      // Create a new Response object from the stream
      const streamResponse = new Response(rs);
      // Create a blob from the response
      const blob = await streamResponse.blob();

      fileDownload(blob, "sample.txt");
    } catch (error) {
      setError(`Error downloading file: ${error}`);
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
