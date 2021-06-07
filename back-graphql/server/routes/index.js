const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const User = require("../models/users");
const Product = require("../models/products");

const {
  respondWithErrorMessage,
  deleteFile,
  checkFileValidation,
} = require("../helpers/helpers");

const route = express.Router();

const acceptedTypes = ["image/jpeg", "image/png"];

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

const upload = multer({ storage, fileFilter, limits });

const uploadFolder = route.put(
  "/upload/users/:id",
  upload.single("profilePhoto"),
  async (req, res) => {
    try {
      //chequea si el archivo es invalido
      let isValid = checkFileValidation(req, res, acceptedTypes);

      if (!isValid) return;

      const customError = "Usuario inexistente";

      const user = await User.findById(req.params.id);

      if (user.profilePhoto && user.profilePhoto !== "placeholder.png") {
        const oldProfilePicturePath =
          path.join(__dirname, "../uploads") + "/" + user.profilePhoto;

        await deleteFile(oldProfilePicturePath);
      }

      user.profilePhoto = req.file.filename;

      await user.save();

      res.json({
        ok: true,
        user,
      });
    } catch (err) {
      respondWithErrorMessage(res, err, 500);
    }
  }
);

route.put(
  "/upload/products/:id",
  upload.array("images", 5),
  async (req, res) => {
    try {
      const images = req.files.map((imageObj) => imageObj.path);

      //chequea si cada archivo es invalido
      for (let file of req.files) {
        req.file = file;

        let isValid = checkFileValidation(req, res, acceptedTypes);

        if (!isValid) throw new Error("Formatos de archivos invalidos");
      }

      const customError = "Producto inexistente";

      const product = await Product.findById(req.params.id);

      if (product.images.length === 0) {
        product.images = images;
      } else {
        for (let image of product.images) {
          console.log(image);
          await deleteFile(image);
        }

        product.images = images;
      }

      await product.save();

      res.json({
        ok: true,
        product,
      });
    } catch (err) {
      console.log(err);
      respondWithErrorMessage(res, err, 500);
    }
  }
);

module.exports = route;
