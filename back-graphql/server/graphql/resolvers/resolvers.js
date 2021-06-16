const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/users");
const Product = require("../../models/products");
const Category = require("../../models/categories");
const { respondWithErrorMessage } = require("../../helpers/helpers");

module.exports = {
  Query: {
    user: (_, { id }) => User.findById(id),
    product: (_, { id }) => Product.findById(id),
    category: (_, { id }) => Category.findById(id),
    order: async (_, { id }) => {
      let user = await User.findOne({ "orders._id": id });

      return user.orders.filter((order) => order.id === id)[0];
    },
    users: () => User.find({}),
    products: () => Product.find({}),
    categories: () => Category.find({}),
    login: async (parent, { email, password }) => {
      const errorObject = {
        status: {
          ok: false,
          message: "Email o password invalidos",
        },
      };

      const foundUser = await User.findOne({ email });

      if (foundUser) {
        const arePaswordsTheSame = await bcrypt.compare(
          password,
          foundUser.password
        );

        if (arePaswordsTheSame) {
          delete foundUser.password;

          const token = jwt.sign(
            {
              user: foundUser,
            },
            process.env.SECRET_KEY,
            {
              expiresIn: "365d",
            }
          );

          return {
            user: foundUser,
            token,
            status: {
              ok: true,
              message: "Sesion iniciada!!",
            },
          };
        } else return errorObject;
      } else {
        return errorObject;
      }
    },
    search: async (parent, { filters }) => {
      const filter = JSON.parse(filters);
      let filterCount = 0;
      const search = {};

      if (filter.name && filter.name.length > 0) {
        search.name = new RegExp(filter.name, "i");
        filterCount++;
      }

      if (filter.category) {
        search.category = filter.category;
        filterCount++;
      }

      if (filter.range) {
        filter.range = JSON.parse(filter.range);

        search.price = {
          $gte: filter.range[0],
          $lte: filter.range[1],
        };
        filterCount++;
      }

      if (filter.minStarRating) {
        // search.reviews = { rating: { $gte: filter.minStarRating } };
        // filterCount++;
      }

      let query = {
        $or: [
          {
            name: search.name ? search.name : null,
          },
          {
            category: search.category ? search.category : null,
          },
          {
            price: search.price ? search.price : null,
          },
        ],
      };

      if (filterCount === 0) query = {};

      const results = await Product.find(query);

      return results;
    },
  },
  Mutation: {
    addUser: async (_, { name, email, password, profilePhoto = "" }) => {
      const customError = "Error, un usuario con ese email ya tiene cuenta";

      try {
        const saltRounds = 10;
        let hashedPassword = await bcrypt.hash(password, saltRounds);

        const found = await User.find({ email });

        if (found.length === 0) {
          const user = new User({
            name,
            email,
            password: hashedPassword,
            profilePhoto,
          });

          await user.save();

          return {
            ok: true,
            message: "Cuenta creada",
          };
        } else {
          throw new Error(customError);
        }
      } catch (err) {
        return {
          ok: false,
          message: err.message,
        };
      }
    },
    addCategory: async (_, { name }) => {
      try {
        const category = new Category({
          name,
        });

        return await category.save();
      } catch (err) {
        console.log(err);
      }
    },
    addProduct: async (
      _,
      { name, price, quantity, description, seller, category, images }
    ) => {
      const product = new Product({
        name: name,
        price: price,
        quantity: quantity,
        description: description,
        seller: seller,
        category: category,
        images: JSON.parse(images),
      });

      await Category.update(
        { _id: category },
        { $push: { products: product._id } }
      );

      return product.save();
    },
    addReview: async (_, { authorId, productId, rating, text }) => {
      let review = {
        author: authorId,
        rating: rating,
        text: text,
      };

      await Product.update({ _id: productId }, { $push: { reviews: review } });

      return {
        ok: true,
        message: "Review agregada",
      };
    },
    addItemToCart: async (_, { userId, productId, quantity }) => {
      let cartItem = {
        item: productId,
        quantity: quantity,
      };

      await User.update({ _id: userId }, { $push: { cart: cartItem } });

      return {
        ok: true,
        message: "Item agregado al carrito",
      };
    },
    addOrder: async (_, { order }) => {
      order = JSON.parse(order);
      order.date = Date.now();

      const user = await User.findById(order.userId);

      delete order.userId;

      user.orders.push(order);

      order.items.forEach(async (item, index) => {
        await Product.updateOne(
          { _id: item.item },
          { $inc: { quantity: item.quantity * -1 } }
        );
      });

      user.cart = [];

      await user.save();

      return {
        ok: true,
        message: "Pedido agregado",
      };
    },
    removeUser: async (_, { id }) => {
      return User.findByIdAndRemove(id);
    },
    removeCategory: async (_, { id }) => {
      await Category.deleteOne({ _id: id });
      await Product.deleteMany({ category: id });

      return {
        ok: true,
        message: "Categoria borrada",
      };
    },
    removeProduct: (parent, { id }) => {
      return Product.findByIdAndRemove(id);
    },
    removeProductFromCart: async (parent, { userId, productId }) => {
      await User.updateOne(
        { _id: userId },
        { $pull: { cart: { item: productId } } }
      );

      return {
        ok: true,
        message: "Item borrado del carrito de compra",
      };
    },
  },
  User: {
    cart: (parent, args) => {
      return parent.cart;
    },
    orders: (parent, args) => {
      return parent.orders;
    },
  },
  Product: {
    seller: (parent, args) => {
      return User.findById(parent.seller);
    },
    category: (parent, args) => {
      return Category.findById(parent.category);
    },
  },
  Category: {
    products: (parent, args) => {
      return Product.find({ category: parent.id });
    },
  },
  Review: {
    author: (parent, args) => {
      return User.findById(parent.author);
    },
  },
  CartItem: {
    item: (parent, args) => {
      return Product.findById(parent.item);
    },
  },
  Order: {
    items: (parent, args) => {
      return parent.items;
    },
  },
  OrderItem: {
    item: async (parent, args) => {
      const item = await Product.findById(parent.item);

      return item;
    },
  },
};
