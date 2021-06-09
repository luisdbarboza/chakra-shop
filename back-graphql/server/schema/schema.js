const graphql = require("graphql");
const {
  GraphQLSchema,
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
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
    mainImage: {
      type: GraphQLString,
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
    reviewsCount: {
      type: GraphQLInt,
    },
    averageRating: {
      type: GraphQLInt,
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
    profilePhoto: {
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

const LogInType = new GraphQLObjectType({
  name: "LogInType",
  fields: () => ({
    user: {
      type: UserType,
    },
    token: {
      type: GraphQLString,
    },
    status: {
      type: NotificationType,
    },
  }),
});

const NotificationType = new GraphQLObjectType({
  name: "NotificationType",
  fields: () => ({
    ok: {
      type: GraphQLBoolean,
    },
    message: {
      type: GraphQLString,
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
    login: {
      type: LogInType,
      args: {
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        const { email, password } = args;
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
    },
    search: {
      type: GraphQLList(ProductType),
      args: { filters: { type: GraphQLString } },
      async resolve(parent, args) {
        const filter = JSON.parse(args.filters);
        let filterCount = 0;
        const search = {};

        if (filter.text && filter.text.length > 0) {
          search.name = new RegExp(filter.text, "i");
          filterCount++;
        }

        if (filter.category) {
          search.category = filter.category;
          filterCount++;
        }

        if (filter.priceRange) {
          search.price = {
            $gte: filter.priceRange[0],
            $lte: filter.priceRange[1],
          };
          filterCount++;
        }

        if (filter.averageRating) {
          search["review.rating"] = { $gte: filter.averageRating };
          filterCount++;
        }

        const query = {
          $or: [
            {
              name: search.name,
            },
            {
              category: search.category,
            },
            {
              price: search.price,
            },
            {
              "review.rating": search["review.rating"],
            },
          ],
        };
        const results = await Product.find(query);

        return results;
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
        status: { type: GraphQLString },
        description: { type: GraphQLNonNull(GraphQLString) },
        seller: { type: GraphQLNonNull(GraphQLID) },
        category: { type: GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        const product = new Product({
          name: args.name,
          price: args.price,
          quantity: args.quantity,
          description: args.description,
          seller: args.seller,
          category: args.category,
        });

        await Category.update(
          { _id: args.category },
          { $push: { products: product._id } }
        );

        return product.save();
      },
    },
    removeUser: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findByIdAndRemove(args.id);
      },
    },
    removeCategory: {
      type: NotificationType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        await Category.deleteOne({ _id: args.id });
        await Product.deleteMany({ category: args.id });

        return {
          ok: true,
          message: "Categoria borrada",
        };
      },
    },
    removeProduct: {
      type: ProductType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Product.findByIdAndRemove(args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
