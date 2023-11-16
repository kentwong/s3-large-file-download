const express = require("express");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

const app = express();
const port = 3001;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const s3Client = new S3Client({
  region: "ap-southeast-2",
  credentials: {
    accessKeyId: "REDACTED",
    secretAccessKey: "REDACTED",
  },
});

const fileName = "dummyfile_2gb.txt";
app.get("/download", async (req, res) => {
  const params = {
    Bucket: "REDACTED",
    Key: fileName,
  };

  try {
    const data = await s3Client.send(new GetObjectCommand(params));

    // Set Content-Length header based on the length of the S3 object's data
    res.setHeader("Content-Length", data.ContentLength.toString());
    res.setHeader("Content-disposition", `attachment; filename=${fileName}`);
    res.setHeader("Content-type", "application/octet-stream");

    data.Body.pipe(res);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
