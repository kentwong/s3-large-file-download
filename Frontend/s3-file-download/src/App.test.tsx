import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import downloadService from "./services/DownloadService";
import fileDownload from "js-file-download";

jest.mock("./services/DownloadService");
jest.mock("js-file-download");

describe("App", () => {
  beforeEach(() => {
    (downloadService as jest.Mock).mockClear();
    (fileDownload as jest.Mock).mockClear();
  });

  it("should download a file when the download button is clicked", async () => {
    // Arrange
    const mockBlob = new Blob(["test"], { type: "text/plain" });
    const progressCallback = jest.fn();
    (downloadService as jest.Mock).mockReturnValue([Promise.resolve({ data: mockBlob }), new AbortController()]);

    const { getByText } = render(<App />);

    // Act
    fireEvent.click(getByText("Download File"));

    // Assert
    await waitFor(() => expect(fileDownload).toHaveBeenCalledWith(mockBlob, "sample.txt"));
  });

  it("should cancel the download when the cancel button is clicked", async () => {
    // Arrange
    const abortController = new AbortController();
    const spy = jest.spyOn(abortController, "abort");
    (downloadService as jest.Mock).mockReturnValue([new Promise(() => {}), abortController]);

    const { getByText } = render(<App />);

    // Act
    fireEvent.click(getByText("Download File"));
    fireEvent.click(getByText("Cancel Download"));

    // Assert
    expect(spy).toHaveBeenCalled();
  });
});
