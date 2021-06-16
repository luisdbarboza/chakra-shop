import { useEffect } from "react";
import {
  Heading,
  Flex,
  Box,
  Input,
  Button,
  FormControl,
} from "@chakra-ui/react";
import Swal from "sweetalert2";
import Link from "next/link";
import { useRouter } from "next/router";
import { Form, Formik } from "formik";
import { FormField } from "@codecraftkit/formfield";

import { useMutation } from "@apollo/client";
import { addUserMutation } from "graphql/mutations";
import { client } from "constants/constants";
import { isEmpty } from "helpers/helpers";

function SignUpForm() {
  const [mutate, { data }] = useMutation(addUserMutation);
  const router = useRouter();

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
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            passwordRepeat: "",
          }}
          validate={({ name, email, password, passwordRepeat }) => {
            const errors = {};

            if (isEmpty(name)) {
              errors.name = "campo nombre vacio";
            }
            if (isEmpty(email)) {
              errors.email = "campo email vacio";
            }
            if (isEmpty(passwordRepeat)) {
              errors.passwordRepeat = "campo repetir pasword vacio";
            }
            if (isEmpty(password)) {
              errors.password = "campo password vacio";
            }

            return errors;
          }}
          onSubmit={async (
            { name, email, password, passwordRepeat },
            { setSubmitting, resetForm }
          ) => {
            setSubmitting(true);

            const errors = [];

            if (password !== passwordRepeat)
              errors.push("Las Passwords no coinciden");
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
                text:
                  "Se encontraron los siguientes errores: " + errors.toString(),
              });
            } else {
              mutate({
                variables: { name, email, password },
              });

              resetForm();
            }

            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Heading as="h3">Crear cuenta</Heading>
              <FormControl mt="1rem">
                <FormField label="Nombre" name="name" required type="text" />
              </FormControl>
              <FormControl mt="1rem">
                <FormField
                  type="email"
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
              <FormControl mt="1rem">
                <FormField
                  type="password"
                  required
                  name="passwordRepeat"
                  label="Repite tu contrasena"
                />
              </FormControl>
              <Button
                mt="1rem"
                bg="#F0C040"
                disabled={isSubmitting}
                type="submit"
                color="black"
                w="100%"
              >
                Enviar
              </Button>
              <Box mt="1rem">
                Ya tienes cuenta?{" "}
                <Link href="/login" color="blue">
                  <a>Inicia sesion</a>
                </Link>
              </Box>
            </Form>
          )}
        </Formik>
      </Flex>
    </Box>
  );
}

export default SignUpForm;
