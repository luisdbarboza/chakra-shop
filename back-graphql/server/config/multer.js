const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const acceptedTypes = ["image/jpeg", "image/png"];

//configuracion por defecto para archivos

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFolder = path.join(__dirname, `../uploads`);

    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const filenameArray = file.originalname.split(".");
    const extension = filenameArray[filenameArray.length - 1];

    cb(null, file.filename + Date.now() + uuidv4() + "." + extension);
  },
});

const fileFilter = (req, file, cb) => {
  req.fileValidationErrors = false;

  if (acceptedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    req.fileValidationErrors = true;
    cb(null, false);
  }
};

const limits = {
  fileSize: 7000000,
};

module.exports = multer({
  storage,
  fileFilter,
  limits,
});
