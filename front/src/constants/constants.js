import { ApolloClient, InMemoryCache } from "@apollo/client";

const SERVER_URL = "http://localhost:8000";
const GRAPHQL_SERVER_URL = `${SERVER_URL}/graphql`;

const client = new ApolloClient({
  uri: GRAPHQL_SERVER_URL,
  cache: new InMemoryCache(),
});

export { SERVER_URL, GRAPHQL_SERVER_URL, client };
