import { useEffect, useContext } from "react";
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

import Swal from "sweetalert2";
import { logInQuery } from "graphql/queries";
import { AuthContext } from "context/AuthContext";
import { client } from "constants/constants";

import { useRouter } from "next/router";
import useForm from "hooks/useForm";

function LogInForm() {
  const [{ email, password }, setFormFields] = useForm({
    email: "",
    password: "",
  });
  const { user, dispatchUser } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await client.query({
      query: logInQuery,
      variables: {
        email,
        password,
      },
    });

    if (data && data.login && data.login.token) {
      dispatchUser({
        type: "LOG_IN",
        user: data.login.user,
        token: data.login.token,
      });

      await Swal.fire({
        icon: "success",
        text: "Has iniciado sesion, seras redirigido a la pantalla principal",
      });

      router.push("/");
    } else {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Email o contrasena incorrectos",
      });
    }
  };

  if (user.loggedIn) {
    router.push("/");
  }

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

export default LogInForm;
