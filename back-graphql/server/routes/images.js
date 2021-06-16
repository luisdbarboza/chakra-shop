const express = require("express");
const { v4: uuidv4 } = require("uuid");
const upload = require("../config/multer");
const path = require("path");

const ChakraShopApi = require("../classes/ChakraShopApi");

const route = express.Router();

route.get("/:type/:filename", ChakraShopApi.sendFile);

route.post("/upload/:type", upload.array("images"), ChakraShopApi.upload);

module.exports = route;
