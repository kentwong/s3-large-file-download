// Import necessary libraries and types
import axios, { AxiosResponse } from "axios";

// Define a type for the progress callback function
type ProgressCallback = (progress: number) => void;

// Define the downloadService function
const downloadService = (
  url: string,
  onProgress: ProgressCallback,
  signal: AbortSignal
): Promise<AxiosResponse<Blob>> => {
  // Create a promise for the axios request
  const downloadPromise = axios({
    method: "get",
    url: url,
    responseType: "blob",
    signal: signal,
    // Add a progress event handler to the axios request
    // When the 'progress' event is triggered, calculate the progress and call the onProgress callback
    onDownloadProgress: (progressEvent) => {
      if (progressEvent.total !== undefined && progressEvent.total !== 0) {
        const progress = (progressEvent.loaded * 100) / progressEvent.total;
        onProgress(progress);
      }
    },
  });

  // Return the axios promise and the AbortController
  return downloadPromise;
};

// Export the downloadService function as the default export
export default downloadService;
