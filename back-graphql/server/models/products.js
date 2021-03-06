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
    required: true,
  },
  rating: {
    type: Number,
    validate: {
      validator: (rating) => rating > 0 && rating < 6 && rating % 1 === 0,
      message: "Valoracion invalida",
      required: true,
    },
  },
  text: {
    type: String,
    validate: {
      validator: (review) => review.length > 20,
      message: "Tu resena debe tener mas de 20 caracteres",
      required: true,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
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

productSchema.virtual("mainImage").get(function () {
  return this.images.length > 0 ? this.images[0] : null;
});

productSchema.virtual("reviewsCount").get(function () {
  return this.reviews.length;
});

productSchema.virtual("averageRating").get(function () {
  let sum = this.reviews.reduce((sum, review, index) => {
    return sum + review.rating;
  }, 0);

  return this.reviews.length === 0 ? 0 : Math.floor(sum / this.reviews.length);
});

productSchema.plugin(uniqueValidator, {
  message: "{PATH} debe ser unico",
});

module.exports = mongoose.model("Product", productSchema);
