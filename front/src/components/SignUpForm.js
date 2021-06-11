import { useEffect } from "react";
import {
  Heading,
  Flex,
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import Swal from "sweetalert2";
import Link from "next/link";
import useForm from "../hooks/useForm";
import { useRouter } from "next/router";

import { useQuery, useMutation } from "@apollo/client";
import { addUserMutation } from "graphql/mutations";
import { client } from "constants/constants";
import { isEmpty } from "helpers/helpers";

function SignUpForm() {
  const [{ name, email, password, passwordRepeat }, setFormFields] = useForm({
    name: "",
    email: "",
    password: "",
    passwordRepeat: "",
  });
  const [mutate, { data }] = useMutation(addUserMutation);
  const router = useRouter();

  const handleSubmit = async (e) => {
    const errors = [];

    e.preventDefault();

    if (password !== passwordRepeat) errors.push("Las Passwords no coinciden");
    if (
      isEmpty(name) ||
      isEmpty(email) ||
      isEmpty(password) ||
      isEmpty(passwordRepeat)
    ) {
      errors.push("Campos vacios");
    }

    if (errors.length > 0) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Se encontraron los siguientes errores: " + errors.toString(),
      });
    } else {
      mutate({
        variables: { name, email, password },
      });
    }
  };

  useEffect(async () => {
    if (data) {
      if (data.addUser.ok) {
        await Swal.fire({
          icon: "success",
          text: data.addUser.message,
        });

        router.push("/login");
      } else if (!data.addUser.ok) {
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.addUser.message,
        });
      }
    }
  }, [data]);

  return (
    <Box>
      <Flex direction="column" justify="center" height="100%">
        <form onSubmit={handleSubmit}>
          <Heading as="h3">Crear cuenta</Heading>
          <FormControl mt="1rem">
            <FormLabel>Nombre</FormLabel>
            <Input
              placeholder="Ingresa tu nombre"
              name="name"
              value={name}
              onChange={setFormFields}
            />
          </FormControl>
          <FormControl mt="1rem">
            <FormLabel>Correo Electronico</FormLabel>
            <Input
              placeholder="correo@dominio"
              type="email"
              name="email"
              value={email}
              onChange={setFormFields}
            />
          </FormControl>
          <FormControl mt="1rem">
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              type="password"
              name="password"
              value={password}
              onChange={setFormFields}
            />
          </FormControl>
          <FormControl mt="1rem">
            <FormLabel>Repite tu password</FormLabel>
            <Input
              placeholder="repite tu password"
              type="password"
              name="passwordRepeat"
              value={passwordRepeat}
              onChange={setFormFields}
            />
          </FormControl>
          <Button mt="1rem" bg="#F0C040" type="submit" color="black" w="100%">
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

export default SignUpForm;
