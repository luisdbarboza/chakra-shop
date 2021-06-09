import { useEffect, useContext } from "react";
import { useLazyQuery } from "@apollo/client";
import {
  Grid,
  GridItem,
  Heading,
  Flex,
  Box,
  Input,
  Button,
  Link,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { logInQuery } from "../graphql/queries";
import { AuthContext } from "../context/AuthContext";

import Head from "next/head";
import Layout from "../layouts/Layout";
import useForm from "../hooks/useForm";

function LogInForm() {
  const [{ email, password }, setFormFields] = useForm({
    email: "",
    password: "",
  });
  const [attemptLogIn, { loading, data }] = useLazyQuery(logInQuery, {
    variables: {
      email,
      password,
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    attemptLogIn();

    console.log("DATOS ENVIADOS");
  };

  useEffect(() => {
    if (data && data.login) {
      const { status } = data.login;

      if (status.ok) {
        console.log(status.message);
      } else {
        console.log(status.message);
      }
    }
  }, [data]);

  return (
    <Box>
      <Flex direction="column" justify="center" height="100%">
        <form onSubmit={(e) => handleSubmit(e, email, password)}>
          <Heading as="h2">Iniciar sesion</Heading>
          <FormControl mt="1rem">
            <FormLabel>Correo electronico</FormLabel>
            <Input
              placeholder="correo@dominio"
              name="email"
              value={email}
              onChange={(e) => setFormFields(e)}
            />
          </FormControl>
          <FormControl mt="1rem">
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setFormFields(e)}
            />
          </FormControl>
          <Button mt="1rem" type="submit" bg="#F0C040" color="black" w="100%">
            Enviar
          </Button>
          <Box mt="1rem">
            Eres nuevo?{" "}
            <Link href="/register" color="blue">
              Crea tu cuenta
            </Link>
          </Box>
        </form>
      </Flex>
    </Box>
  );
}

function login() {
  return (
    <Layout>
      <Head>
        <title>Iniciar sesion</title>
      </Head>
      <Grid
        height="100%"
        templateColumns={{ base: "5% 90% 5%", md: "30% 40% 30%" }}
        m="auto"
        height="88vh"
      >
        <div />
        <LogInForm />
        <div />
      </Grid>
    </Layout>
  );
}

export default login;
