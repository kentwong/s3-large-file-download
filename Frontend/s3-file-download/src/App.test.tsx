import React from "react";
import { render, fireEvent } from "@testing-library/react";
import axios from "axios";
import fileDownload from "js-file-download";
import App from "./App";

jest.mock("axios");
jest.mock("js-file-download");

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />);
  });

  it("downloads a file when the download button is clicked", async () => {
    const { getByText } = render(<App />);
    const downloadButton = getByText("Download");

    fireEvent.click(downloadButton);

    // Assert that the download service is called with the correct parameters
    expect(axios.get).toHaveBeenCalledWith("/api/download", {
      responseType: "blob",
    });

    // Simulate a successful file download
    const mockFile = new Blob(["test file"], { type: "text/plain" });
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockFile });

    // Assert that the file is downloaded with the correct name
    expect(fileDownload).toHaveBeenCalledWith(mockFile, "downloaded-file.txt");
  });

  it("displays an error message when the file download fails", async () => {
    const { getByText } = render(<App />);
    const downloadButton = getByText("Download");

    fireEvent.click(downloadButton);

    // Simulate a failed file download
    jest.spyOn(axios, "get").mockRejectedValueOnce(new Error("Download failed"));

    // Assert that the error message is displayed
    const errorMessage = await getByText("Failed to download file");
    expect(errorMessage).toBeInTheDocument();
  });
});
