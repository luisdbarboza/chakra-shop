const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const User = require("../models/users");
const Product = require("../models/products");

const {
  respondWithErrorMessage,
  deleteFile,
  checkFileValidation,
} = require("../helpers/helpers");

const acceptedTypes = ["image/jpeg", "image/png"];

const groups = {
  products: { folder: "Products" },
  users: { folder: "Users" },
  kokoro: { folder: "Kokoro" },
};

//despues
class ChakraShopApi {
  async upload(req, res) {
    try {
      const files = req.files;
      const type = req.params.type;

      if (!groups[type]) {
        throw new Error({
          message: "Tipo inexistente e invalido",
        });
      }

      const filesUploaded = [];

      for (let file of files) {
        const folderPath = path.join(
          __dirname,
          `../uploads/${groups[type].folder}`
        );

        const fileContents = await fs.readFile(file.path);

        await fs.writeFile(path.join(folderPath, file.filename), fileContents);

        await fs.unlink(file.path);

        file.url = `${process.env.API_URL}/images/${groups[type].folder}/${file.filename}`;

        delete file.buffer;
        filesUploaded.push(file);
      }

      res.json({
        ok: true,
        data: filesUploaded,
      });
    } catch (err) {
      for (let file of req.files) {
        deleteFile(file.path);
      }

      respondWithErrorMessage(res, err, 500);
    }
  }

  async sendFile(req, res) {
    const { type, filename } = req.params;

    if (!groups[type]) {
      return res.status(400).json({
        ok: false,
        message: "Tipo invalido",
      });
    }

    res.sendFile(
      path.join(__dirname, `../uploads/${groups[type].folder}/${filename}`)
    );
  }
}

module.exports = new ChakraShopApi();
