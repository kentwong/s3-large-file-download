import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import downloadService from "./DownloadService";

// This sets the mock adapter on the default instance
var mock = new MockAdapter(axios);

describe("downloadService", () => {
  beforeEach(() => {
    // Reset the mock before each test
    mock.reset();
  });

  it("should download a file and report progress", async () => {
    // Arrange
    const url = "http://localhost:3001/download";
    const mockBlob = new Blob(["test"], { type: "text/plain" });
    const progressCallback = jest.fn();
    mock.onGet(url).reply(200, mockBlob, { "Content-Length": "4" });

    // Act
    const [downloadPromise, controller] = downloadService(url, progressCallback);

    // Assert
    await expect(downloadPromise).resolves.toEqual(expect.objectContaining({ data: mockBlob }));
    expect(progressCallback).toHaveBeenCalledWith(100);
  });

  it("should abort the download when the abort signal is triggered", async () => {
    // Arrange
    const url = "http://localhost:3001/download";
    const progressCallback = jest.fn();
    mock.onGet(url).reply(() => new Promise((resolve) => setTimeout(() => resolve([200, ""]), 5000)));

    // Act
    const [downloadPromise, controller] = downloadService(url, progressCallback);
    controller.abort();

    // Assert
    await expect(downloadPromise).rejects.toThrow("Request aborted");
    expect(progressCallback).not.toHaveBeenCalled();
  });
});
