const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    validate: {
      validator: (name) => name.length > 0,
      message: (props) => `El nombre no es valido`,
    },
    required: [true, "El campo nombre es obligatorio"],
    unique: true,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

categorySchema.plugin(uniqueValidator, {
  message: "{PATH} debe ser unico",
});

module.exports = mongoose.model("Category", categorySchema);
