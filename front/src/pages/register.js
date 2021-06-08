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

function SignUpForm() {
  return (
    <Box>
      <Flex direction="column" justify="center" height="100%">
        <form>
          <Heading as="h3">Crear cuenta</Heading>
          <FormControl mt="1rem">
            <FormLabel>Nombre</FormLabel>
            <Input placeholder="Ingresa tu nombre" />
          </FormControl>
          <FormControl mt="1rem">
            <FormLabel>Correo Electronico</FormLabel>
            <Input placeholder="correo@dominio" type="email" />
          </FormControl>
          <FormControl mt="1rem">
            <FormLabel>Password</FormLabel>
            <Input placeholder="password" type="password" />
          </FormControl>
          <FormControl mt="1rem">
            <FormLabel>Repite tu password</FormLabel>
            <Input placeholder="repite tu password" type="password" />
          </FormControl>
          <Button mt="1rem" bg="#F0C040" color="black" w="100%">
            Enviar
          </Button>
          <Box mt="1rem">
            Ya tienes cuenta?{" "}
            <Link href="/login" color="blue">
              <a>Inicia sesion</a>
            </Link>
          </Box>
        </form>
      </Flex>
    </Box>
  );
}

function register() {
  return (
    <Layout>
      <Head>
        <title>Registrate</title>
      </Head>
      <Grid
        height="100%"
        templateColumns={{ base: "5% 90% 5%", md: "30% 40% 30%" }}
        m="auto"
        height="88vh"
      >
        <div />
        <SignUpForm />
        <div />
      </Grid>
    </Layout>
  );
}

export default register;
