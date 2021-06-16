const express = require("express");

const route = express.Router();

route.get("/", (req, res) => {
  res.send("<h1>API CHAKRA-SHOP</h1>");
});

route.use("/images", require("./images.js"));

module.exports = route;
