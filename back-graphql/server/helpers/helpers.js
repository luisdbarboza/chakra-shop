const util = require("util");
const fs = require("fs");
const unlink = util.promisify(fs.unlink);

const respondWithErrorMessage = (res, err, statusCode = 500) => {
  return res.status(statusCode).json({
    ok: false,
    err,
  });
};

const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.exists(filePath, async (exist) => {
      if (exist) {
        await unlink(filePath);
        resolve(true);
      } else {
        reject(false);
      }
    });
  });
};

const checkFileValidation = (req, res, acceptedTypes) => {
  if (req.fileValidationErrors) {
    const customError = {
      message:
        "Solo se aceptan archivos de los siguientes formatos " +
        acceptedTypes.toString(),
    };

    respondWithErrorMessage(res, customError, 400);

    return false;
  }

  return true;
};

module.exports = {
  respondWithErrorMessage,
  deleteFile,
  checkFileValidation,
};
