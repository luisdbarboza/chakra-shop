import { ChakraProvider } from "@chakra-ui/react";
import AuthContextProvider from "../context/AuthContext";
import { ApolloProvider } from "@apollo/client";
import { client } from "../constants/constants";
import Layout from "../layouts/Layout";
import "./app.css";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider CSSReset>
      <AuthContextProvider>
        <ApolloProvider client={client}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ApolloProvider>
      </AuthContextProvider>
    </ChakraProvider>
  );
}
export default MyApp;
