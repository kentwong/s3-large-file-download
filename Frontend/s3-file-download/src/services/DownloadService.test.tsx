// Import necessary libraries and types
import axios from "axios";
import downloadService from "./DownloadService";

// Define a type for the progress callback function
type ProgressCallback = (progress: number) => void;

// Mock the axios library
jest.mock("axios");

describe("downloadService", () => {
  const url = "https://example.com/file";
  const onProgress: ProgressCallback = jest.fn();
  const abortSignal = new AbortController().signal;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should download the file successfully", async () => {
    // Mock the axios response
    const response = {
      data: new Blob(),
    };
    (axios.get as jest.Mock).mockResolvedValue(response);

    // Call the downloadService function
    const result = await downloadService(url, onProgress, abortSignal);

    // Verify the axios.get function is called with the correct arguments
    expect(axios.get).toHaveBeenCalledWith(url, {
      responseType: "blob",
      onDownloadProgress: expect.any(Function),
      cancelToken: expect.any(Object),
    });

    // Verify the onProgress callback is called with the correct progress value
    expect(onProgress).toHaveBeenCalledWith(100);

    // Verify the result is the expected response
    expect(result).toEqual(response);
  });

  it("should handle download errors", async () => {
    // Mock the axios error
    const error = new Error("Download failed");
    (axios.get as jest.Mock).mockRejectedValue(error);

    // Call the downloadService function
    await expect(downloadService(url, onProgress, abortSignal)).rejects.toThrow(error);

    // Verify the axios.get function is called with the correct arguments
    expect(axios.get).toHaveBeenCalledWith(url, {
      responseType: "blob",
      onDownloadProgress: expect.any(Function),
      cancelToken: expect.any(Object),
    });

    // Verify the onProgress callback is called with the correct progress value
    expect(onProgress).toHaveBeenCalledWith(0);
  });
});
