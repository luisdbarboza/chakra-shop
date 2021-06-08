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
import Head from "next/head";
import Layout from "../layouts/Layout";

import React from "react";

function LogInForm() {
  return (
    <Box>
      <Flex direction="column" justify="center" height="100%">
        <form>
          <Heading as="h2">Iniciar sesion</Heading>
          <FormControl mt="1rem">
            <FormLabel>Correo electronico</FormLabel>
            <Input placeholder="correo@dominio" />
          </FormControl>
          <FormControl mt="1rem">
            <FormLabel>Password</FormLabel>
            <Input placeholder="password" type="password" />
          </FormControl>
          <Button mt="1rem" bg="#F0C040" color="black" w="100%">
            Enviar
          </Button>
          <Box mt="1rem">
            Eres nuevo?{" "}
            <Link href="/register" color="blue">
              <a>Crea tu cuenta</a>
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
