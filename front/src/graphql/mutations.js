import { gql } from "@apollo/client";

const addUserMutation = gql`
  mutation ($name: String!, $email: String!, $password: String!) {
    addUser(name: $name, email: $email, password: $password) {
      ok
      message
    }
  }
`;

const addUserReview = gql`
  mutation ($authorId: ID!, $productId: ID!, $rating: Int!, $text: String!) {
    addReview(
      authorId: $authorId
      productId: $productId
      rating: $rating
      text: $text
    ) {
      ok
      message
    }
  }
`;

const addProductMutation = gql`
  mutation (
    $name: String!
    $category: ID!
    $price: Float!
    $quantity: Int!
    $description: String!
    $seller: ID!
    $images: String!
  ) {
    addProduct(
      name: $name
      category: $category
      price: $price
      quantity: $quantity
      description: $description
      seller: $seller
      images: $images
    ) {
      id
    }
  }
`;

const addItemToCart = gql`
  mutation ($userId: ID!, $productId: ID!, $quantity: Int!) {
    addItemToCart(userId: $userId, productId: $productId, quantity: $quantity) {
      ok
      message
    }
  }
`;

const removeProductFromCart = gql`
  mutation ($userId: ID!, $productId: ID!) {
    removeProductFromCart(userId: $userId, productId: $productId) {
      ok
      message
    }
  }
`;

export {
  addUserMutation,
  addUserReview,
  addProductMutation,
  addItemToCart,
  removeProductFromCart,
};
