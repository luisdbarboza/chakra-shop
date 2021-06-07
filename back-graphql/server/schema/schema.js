const graphql = require("graphql");
const {
  GraphQLSchema,
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
} = graphql;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const Product = require("../models/products");
const Category = require("../models/categories");
const { respondWithErrorMessage } = require("../helpers/helpers");

const ReviewType = new GraphQLObjectType({
  name: "Review",
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    author: {
      type: UserType,
      resolve(parent, args) {},
    },
    rating: {
      type: GraphQLInt,
    },
    text: {
      type: GraphQLString,
    },
    date: {
      type: GraphQLString,
    },
  }),
});

const ProductType = new GraphQLObjectType({
  name: "Product",
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    price: {
      type: GraphQLFloat,
    },
    images: {
      type: GraphQLList(GraphQLString),
    },
    description: {
      type: GraphQLString,
    },
    seller: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.seller);
      },
    },
    status: {
      type: GraphQLString,
    },
    quantity: {
      type: GraphQLInt,
    },
    category: {
      type: CategoryType,
      resolve(parent, args) {
        return Category.findById(parent.category);
      },
    },
    reviews: {
      type: GraphQLList(ReviewType),
    },
  }),
});

const CartItemType = new GraphQLObjectType({
  name: "CartItem",
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    item: {
      type: ProductType,
      resolve(parent, args) {},
    },
    quantity: {
      type: GraphQLInt,
    },
  }),
});

const CategoryType = new GraphQLObjectType({
  name: "Category",
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    products: {
      type: GraphQLList(ProductType),
      resolve(parent, args) {
        return Product.find({ category: parent.id });
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    password: {
      type: GraphQLString,
    },
    cart: {
      type: GraphQLList(CartItemType),
      resolve(parent, args) {
        return parent.cart;
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findById(args.id);
      },
    },
    product: {
      type: ProductType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Product.findById(args.id);
      },
    },
    category: {
      type: CategoryType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Category.findById(args.id);
      },
    },
    users: {
      type: GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({});
      },
    },
    products: {
      type: GraphQLList(ProductType),
      resolve(parent, args) {
        return Product.find({});
      },
    },
    categories: {
      type: GraphQLList(CategoryType),
      resolve(parent, args) {
        return Category.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "MutationType",
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        try {
          const { name, email, password } = args;
          const saltRounds = 10;
          let hashedPassword = await bcrypt.hash(password, saltRounds);

          const user = new User({
            name,
            email,
            password: hashedPassword,
          });

          return await user.save();
        } catch (err) {
          console.log(err);
        }
      },
    },
    addCategory: {
      type: CategoryType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        try {
          const { name } = args;

          const category = new Category({
            name,
          });

          return await category.save();
        } catch (err) {
          console.log(err);
        }
      },
    },
    addProduct: {
      type: ProductType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        price: { type: GraphQLNonNull(GraphQLFloat) },
        quantity: { type: GraphQLNonNull(GraphQLInt) },
        status: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        images: { type: GraphQLNonNull(GraphQLList(GraphQLString)) },
        seller: { type: GraphQLNonNull(GraphQLID) },
        category: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {},
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
