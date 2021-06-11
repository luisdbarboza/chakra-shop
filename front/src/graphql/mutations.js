import { gql } from "@apollo/client";

const addUserMutation = gql`
  mutation ($name: String!, $email: String!, $password: String!) {
    addUser(name: $name, email: $email, password: $password) {
      ok
      message
    }
  }
`;

export { addUserMutation };
