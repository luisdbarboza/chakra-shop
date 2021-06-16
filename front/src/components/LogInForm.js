import { useEffect, useContext } from "react";
import {
  Grid,
  GridItem,
  Heading,
  Flex,
  Box,
  Button,
  Link,
  FormControl,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { FormField } from "@codecraftkit/formfield";
import { isEmpty } from "helpers/helpers";

import Swal from "sweetalert2";
import { logInQuery } from "graphql/queries";
import { AuthContext } from "context/AuthContext";
import { client } from "constants/constants";

import { useRouter } from "next/router";

function LogInForm() {
  const { user, dispatchUser } = useContext(AuthContext);
  const router = useRouter();

  if (user.loggedIn) {
    router.push("/");
  }

  return (
    <Box>
      <Flex direction="column" justify="center" height="100%">
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validate={({ email, password }) => {
            const errors = {};

            if (isEmpty(email)) {
              errors.email = "campo email vacio";
            }
            if (isEmpty(password)) {
              errors.password = "campo password vacio";
            }

            return errors;
          }}
          onSubmit={async (
            { email, password },
            { setSubmitting, resetForm }
          ) => {
            setSubmitting(true);

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
              resetForm();
            } else {
              await Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Email o contrasena incorrectos",
              });
            }

            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Heading as="h2">Iniciar sesion</Heading>
              <FormControl mt="1rem">
                <FormField
                  type="text"
                  required
                  name="email"
                  label="Correo Electronico"
                />
              </FormControl>
              <FormControl mt="1rem">
                <FormField
                  type="password"
                  required
                  name="password"
                  label="Contrasena"
                />
              </FormControl>
              <Button
                mt="1rem"
                type="submit"
                disabled={isSubmitting}
                bg="#F0C040"
                color="black"
                w="100%"
              >
                Enviar
              </Button>
              <Box mt="1rem">
                Eres nuevo?{" "}
                <Link href="/register" color="blue">
                  Crea tu cuenta
                </Link>
              </Box>
            </Form>
          )}
        </Formik>
      </Flex>
    </Box>
  );
}

export default LogInForm;
