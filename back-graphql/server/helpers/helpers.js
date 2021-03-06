const util = require("util");
const path = require("path");
const fs = require("fs");
const unlink = util.promisify(fs.unlink);

const respondWithErrorMessage = (res, err, statusCode = 500) => {
  return res.status(statusCode).json({
    ok: false,
    err,
  });
};

const deleteFile = (filename, type) => {
  const filePath = path.join(__dirname, `../uploads/${type}/${filename}`);

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

const validateUser = (token) => {
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "Token no valido",
        },
      });
    }

    return decoded;
  });
};

module.exports = {
  respondWithErrorMessage,
  deleteFile,
  checkFileValidation,
  validateUser,
};
