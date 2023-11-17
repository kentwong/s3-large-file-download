import axios, { AxiosResponse, AxiosError, CancelTokenSource } from "axios";

type ProgressCallback = (progress: number) => void;

// The shorthand method for a GET request with axios is axios.get(url, config).
// However, the shorthand method does not support the onDownloadProgress option.
// This option is only available in the full axios(config) method.

const downloadService = (
  url: string,
  onProgress: ProgressCallback
): [Promise<AxiosResponse<Blob>>, CancelTokenSource] => {
  const cancelTokenSource = axios.CancelToken.source();

  // In this code, downloadService is a function that takes a URL and
  // a callback function for handling download progress.
  // It returns a Promise that resolves with the response from the axios call.
  // The ProgressCallback type is a function that takes a number
  // (the download progress as a percentage) and doesn't return anything.
  const downloadPromise = axios({
    method: "get",
    url: url,
    responseType: "blob",
    cancelToken: cancelTokenSource.token,
    onDownloadProgress: (progressEvent) => {
      if (progressEvent.total !== undefined && progressEvent.total !== 0) {
        const progress = (progressEvent.loaded * 100) / progressEvent.total;
        onProgress(progress);
      }
    },
  });

  return [downloadPromise, cancelTokenSource];
};

export default downloadService;
