import React, { useState } from "react";
import axios from "../utils/axios";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";

export default function FileUpload() {
  const chunkSize = 10 * 1024;
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);
  const [fileName, setFilename] = useState("");
  const [fileUri, setFileUri] = useState("");

  const [currentChunkIndex, setCurrentChunkIndex] = useState(null);

  function uploadChunk(readerEvent) {
    const data = readerEvent.target.result;
    const headers = { "Content-Type": "application/octet-stream" };

    axios
      .post("/upload", data, {
        headers,
        params: {
          name: fileName,
          size: file.size,
          currentChunkIndex: currentChunkIndex,
          totalChunks: Math.ceil(file.size / chunkSize),
        },
      })
      .then((response) => {
        const filesize = file.size;
        const chunks = Math.ceil(filesize / chunkSize) - 1;
        setProgress(((currentChunkIndex + 1) / chunks) * 100);
        const isLastChunk = currentChunkIndex === chunks;
        if (isLastChunk) {
          file.finalFilename = response.data.finalFilename;

          setCurrentChunkIndex(null);
        } else {
          setCurrentChunkIndex(currentChunkIndex + 1);
        }
      });
  }

  function readAndUploadCurrentChunk() {
    const reader = new FileReader();
    if (!file) {
      return;
    }
    const from = currentChunkIndex * chunkSize;
    const to = from + chunkSize;
    const blob = file.slice(from, to);
    reader.onload = (e) => uploadChunk(e);
    reader.readAsDataURL(blob);
  }

  const handleUpload = async () => {
    setCurrentChunkIndex(0);
  };

  const fileChangeHandler = (e) => {
    setFile(e.target.files[0]);

    setFileUri(URL.createObjectURL(e.target.files[0]));
  };

  useEffect(() => {
    if (file) {
      const name = uuidv4();
      const ext = file.name.split(".").pop();

      setFilename(`${name}.${ext}`);
    }
  }, [file]);

  useEffect(() => {
    if (currentChunkIndex !== null) {
      readAndUploadCurrentChunk();
    }
  }, [currentChunkIndex]);

  return (
    <div className="container">
      <h1>File Upload</h1>
      <img src={fileUri} />
      <progress value={progress} max={100}></progress>
      <div className="fileuploadbutton">
        <input type="file" onChange={fileChangeHandler} />
        <button onClick={handleUpload}>Upload</button>
      </div>
    </div>
  );
}
