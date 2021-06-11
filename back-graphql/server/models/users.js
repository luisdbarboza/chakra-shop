const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  item: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    validate: {
      validator: (number) => number > 0,
      message: "Tienes que pedir 1 producto o mas",
    },
    default: 0,
  },
});

const userSchema = new Schema({
  name: {
    type: String,
    validate: {
      validator: (name) => name.length > 0,
      message: (props) => `El nombre no es valido`,
    },
    required: [true, "El campo nombre es obligatorio"],
  },
  email: {
    type: String,
    validate: {
      validator: (email) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email),
      message: (props) => `${props.value} no es un correo valido`,
    },
    required: [true, "El campo email es obligatorio"],
    unique: true,
  },
  profilePhoto: {
    type: String,
    default: "placeholder.png",
  },
  password: {
    type: String,
    required: [true, "El campo password es obligatorio"],
  },
  cart: [cartItemSchema],
});

userSchema.methods.toJSON = function () {
  let user = this;
  let userObj = user.toObject();
  delete userObj.password;

  return userObj;
};

userSchema.plugin(uniqueValidator, {
  message: "{PATH} debe ser unico",
});

module.exports = mongoose.model("User", userSchema);
