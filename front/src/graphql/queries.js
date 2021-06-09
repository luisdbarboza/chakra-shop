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

export { logInQuery, getAllCategories, getAllProducts };
