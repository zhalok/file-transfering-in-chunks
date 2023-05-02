const express = require("express");
const multer = require("multer");
const fs = require("fs");
const app = express();
const multerMiddleware = require("./multerMiddleware");
const cors = require("cors");
const data = require("./database.json");
const mongoose = require("mongoose");
const File = require("./models/File");

app.use(cors());
app.use(express.json());
app.use(express.raw({ type: "application/octet-stream", limit: "100mb" }));

mongoose
  .connect("mongodb://localhost:27017/fileuploadchunk", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

const allchunks = [];
app.post("/api/upload", async (req, res) => {
  const { name, currentChunkIndex, totalChunks } = req.query;
  console.log(`chunk ${currentChunkIndex} uploaded`);
  const firstChunk = parseInt(currentChunkIndex) === 0;
  const lastChunk = parseInt(currentChunkIndex) === parseInt(totalChunks) - 1;
  const ext = name.split(".").pop();
  const data = req.body.toString().split(",")[1];
  const buffer = Buffer.from(data, "base64");
  // const tmpFilename = "tmp_" + md5(name + req.ip) + "." + ext;
  const tmpFilename = name;
  if (firstChunk && fs.existsSync("./uploads/" + tmpFilename)) {
    fs.unlinkSync("./uploads/" + tmpFilename);
  }
  fs.appendFileSync("./uploads/" + tmpFilename, buffer);
  if (lastChunk) {
    const finalFilename = md5(Date.now()).substr(0, 6) + "." + ext;
    fs.renameSync("./uploads/" + tmpFilename, "./uploads/" + finalFilename);
    res.json({ finalFilename });
  } else {
    res.json("ok");
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
