const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
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

//despues
class ChakraShopApi {
  static uploadOrUpdateUserPhoto(req, res) {
    (async () => {
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
    })();
  }

  static uploadOrUpdateProductImages(req, res) {
    (async () => {
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
    })();
  }

  static sendFile(req, res) {
    const img = req.params.img;
    const pathArchivo = path.resolve(__dirname, `../uploads/${img}`);
    const pathNoEncontrado = path.resolve(__dirname, "../images/no-image.jpg");

    if (!fs.existsSync(pathArchivo)) {
      return res.status(400).sendFile(pathNoEncontrado);
    }

    res.sendFile(pathArchivo);
  }
}

module.exports = ChakraShopApi;
