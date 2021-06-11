import { useState, useEffect, useContext } from "react";
import {
  Box,
  Grid,
  Heading,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  Button,
} from "@chakra-ui/react";

import { AuthContext } from "context/AuthContext";
import useForm from "hooks/useForm";
import Swal from "sweetalert2";
import { useMutation } from "@apollo/client";
import { getSingleProductInfo } from "graphql/queries";
import { addUserReview } from "graphql/mutations";

import Link from "next/link";

function ReviewForm({ product }) {
  const { user } = useContext(AuthContext);
  const [{ reviewTextarea, selectRating }, setFormFields] = useForm({
    reviewTextarea: "",
    selectRating: "1",
  });
  const [mutate, mutationData] = useMutation(addUserReview);

  const handleSubmit = async (e) => {
    const errors = [];

    e.preventDefault();

    if (reviewTextarea.length < 10) {
      errors.push("La review debe tener al menos 10 caracteres");
    }

    if (selectRating < 1 || selectRating > 5) {
      errors.push("La nota es invalida");
    }

    if (errors.length > 0) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Se encontraron los siguientes errores: " + errors.toString(),
      });
    } else {
      mutate({
        variables: {
          authorId: user.id,
          productId: product.id,
          rating: Number(selectRating),
          text: reviewTextarea,
        },
        refetchQueries: [
          {
            query: getSingleProductInfo,
            variables: {
              id: product.id,
            },
          },
        ],
      });
    }
  };

  console.log(mutationData);

  useEffect(async () => {
    if (
      !mutationData.loading &&
      mutationData.data &&
      mutationData.data.addReview.ok
    ) {
      await Swal.fire({
        icon: "success",
        text: mutationData.data.addReview.message,
      });
    }
  }, [mutationData]);

  return (
    <Box p="1rem" pl="0rem" w={{ base: "90%", md: "40%" }} m="auto">
      {user.id === product.seller.id ? null : user.loggedIn ? (
        <form onSubmit={(e) => handleSubmit(e)}>
          <Grid gap={2}>
            <Heading size="1rem">Escribe una review</Heading>

            <FormControl>
              <FormLabel>Puntuacion</FormLabel>
              <Select
                onChange={setFormFields}
                name="selectRating"
                value={selectRating}
              >
                <option value={1}>1 - Malo</option>
                <option value={2}>2 - Decente</option>
                <option value={3}>3 - Bueno</option>
                <option value={4}>4 - Muy Bueno</option>
                <option value={5}>5 - Excelente</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Comenta</FormLabel>
              <Textarea
                value={reviewTextarea}
                name="reviewTextarea"
                onChange={setFormFields}
              />
            </FormControl>

            <Button bg="#F0C040" type="submit" color="black" w="100%">
              Subir
            </Button>
          </Grid>
        </form>
      ) : (
        <Box textAlign="center">
          <Heading m="0.5rem">Escribe una review</Heading>
          <Box>
            <Link href="/login">
              <a>Inicia sesion</a>
            </Link>{" "}
            para poder redactar una review
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default ReviewForm;
