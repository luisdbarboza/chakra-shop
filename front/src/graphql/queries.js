import { gql } from "@apollo/client";

const logInQuery = gql`
  query ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        name
        email
        profilePhoto
      }
      token
      status {
        ok
        message
      }
    }
  }
`;

const getAllCategories = gql`
  {
    categories {
      id
      name
    }
  }
`;

const getAllProductsId = gql`
  {
    products {
      id
    }
  }
`;

const getAllProducts = gql`
  {
    products {
      id
      name
      price
      mainImage
      averageRating
      reviewsCount
      seller {
        id
        name
      }
    }
  }
`;

const getSingleProductInfo = gql`
  query ($id: ID!) {
    product(id: $id) {
      id
      name
      price
      description
      mainImage
      images
      status
      quantity
      averageRating
      reviewsCount
      seller {
        id
        name
      }
      reviews {
        id
        author {
          id
          name
        }
        rating
        text
        date
      }
    }
  }
`;

const getSearchResults = gql`
  query searchProducts($filters: String!) {
    search(filters: $filters) {
      id
      name
      price
      averageRating
      reviewsCount
      mainImage
      seller {
        id
        name
      }
    }
  }
`;

const getUserCartInfo = gql`
  query ($id: ID!) {
    user(id: $id) {
      cart {
        id
        quantity
        item {
          id
          name
          mainImage
          quantity
          price
        }
      }
    }
  }
`;

const getUserOrders = gql`
  query ($id: ID!) {
    user(id: $id) {
      id
      orders {
        id
        fullName
        city
        totalItems
        totalAmount
        items {
          item {
            id
            name
          }
          quantity
        }
      }
    }
  }
`;

const getSingleOrder = gql`
  query ($id: ID!) {
    order(id: $id) {
      id
      fullName
      city
      country
      totalItems
      totalAmount
      date
      items {
        quantity
        item {
          name
          mainImage
          price
        }
      }
    }
  }
`;

export {
  logInQuery,
  getAllCategories,
  getAllProducts,
  getAllProductsId,
  getSingleProductInfo,
  getSearchResults,
  getUserCartInfo,
  getUserOrders,
  getSingleOrder,
};
