import { ChakraProvider } from "@chakra-ui/react";
import AuthContextProvider from "../context/AuthContext";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { GRAPHQL_SERVER_URL } from "../constants/constants";

//configuracion apollo client
const client = new ApolloClient({
  uri: GRAPHQL_SERVER_URL,
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider CSSReset>
      <AuthContextProvider>
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
      </AuthContextProvider>
    </ChakraProvider>
  );
}
export default MyApp;
