const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const User = require("../models/users");
const Product = require("../models/products");
const ChakraShopApi = require("../classes/ChakraShopApi");

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

route.get("/", (req, res) => {
  res.send("<h1>API CHAKRA-SHOP</h1>");
});

route.put("/upload/users/:id", upload.single("profilePhoto"), (req, res) => {
  ChakraShopApi.uploadOrUpdateUserPhoto(req, res);
});

route.put(
  "/upload/products/:id",
  upload.array("images", 5),
  async (req, res) => {
    ChakraShopApi.uploadOrUpdateProductImages(req, res);
  }
);

route.get("/images/:img", (req, res) => {
  ChakraShopApi.sendFile(req, res);
});

module.exports = route;
