const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const validStatuses = {
  values: ["Disponible", "Sin Stock"],
  message: "{VALUE} no es un estatus valido",
};

const ReviewsSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  rating: {
    type: Number,
    validate: {
      validator: (rating) => rating > 0 && rating < 6 && rating % 1 === 0,
      message: "Valoracion invalida",
    },
  },
  text: {
    type: String,
    validate: {
      validator: (review) => review.length > 20,
      message: "Tu resena debe tener mas de 20 caracteres",
    },
  },
  date: Date,
});

const productSchema = new Schema({
  name: {
    type: String,
    validate: {
      validator: (name) => name.length > 0,
      message: (props) => `El nombre no es valido`,
    },
    required: [true, "El campo nombre es obligatorio"],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, "El precio del producto es obligatorio"],
  },
  images: [],
  description: {
    type: String,
    default: "Sin descripcion",
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    default: "Disponible",
    enum: validStatuses,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  reviews: [ReviewsSchema],
});

productSchema.plugin(uniqueValidator, {
  message: "{PATH} debe ser unico",
});

module.exports = mongoose.model("Product", productSchema);
