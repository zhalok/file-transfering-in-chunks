const express = require("express");
const multer = require("multer");
const fs = require("fs");
const app = express();
const upload = multer();
const multerMiddleware = require("./multerMiddleware");
const cors = require("cors");
const data = require("./database.json");
app.use(cors());
app.use(express.json());

app.post("/api/upload", upload.single("chunk"), (req, res) => {
  const { index, chunks, ext } = req.body;

  data.push({
    name: req.body.name,
    index: req.body.index,
    chunk: req.file.buffer.toString("base64"),
  });

  if (index == chunks - 1) {
    const filedata = data
      .filter((item) => item.name == req.body.name)
      .sort((a, b) => a.index - b.index)
      .map((item) => item.chunk)
      .join("");
    const buffer = Buffer.from(filedata, "base64");
    fs.writeFileSync(`./uploads/${req.body.name}.${ext}`, buffer);
  }

  res.json({
    message: "File uploaded successfully",
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
