const multer = require("multer");
const multerMiddleware = () => {
  var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
      callBack(null, "./uploads/");
    },
    filename: (req, file, callBack) => {
      callBack(null, file.originalname);
    },
  });
  return multer({ storage: storage });
};

module.exports = multerMiddleware;
