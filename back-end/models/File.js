const mongoose = require("mongoose");
const FileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  extension: {
    type: String,
    required: true,
  },
  totalChunks: {
    type: Number,
    required: true,
  },
  chunk: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("File", FileSchema);
