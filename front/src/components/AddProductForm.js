import { useEffect, useContext, useRef } from "react";
import {
  Grid,
  GridItem,
  Heading,
  Flex,
  Box,
  Input,
  Button,
  Link,
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
} from "@chakra-ui/react";

import Swal from "sweetalert2";
import { AuthContext } from "context/AuthContext";
import { client, SERVER_URL } from "constants/constants";
import { useQuery, useMutation } from "@apollo/client";
import { addProductMutation } from "graphql/mutations";
import { getAllCategories } from "graphql/queries";

import useForm from "hooks/useForm";
import { isEmpty } from "helpers/helpers";

const AddProductForm = () => {
  const [
    { name, price, description, quantity, selectCategory },
    setFormFields,
  ] = useForm({
    name: "",
    price: 0,
    description: "",
    quantity: 1,
    selectCategory: "",
  });
  const { data: categoryData, loading } = useQuery(getAllCategories);
  const [mutate, { data }] = useMutation(addProductMutation);
  const filesRef = useRef(null);
  const { user, dispatchUser } = useContext(AuthContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = [];

    if (isEmpty(name) || isEmpty(description)) {
      errors.push("Campos vacios");
    }

    if (Number(price) <= 0) {
      errors.push("Precio invalido");
    }

    if (Number(quantity) <= 0) {
      errors.push("cantidad invalida");
    }

    // if (filesRef.current.files.length === 0) {
    //   errors.push("Debes proveer al menos 1 imagen referencial");
    // }

    if (errors.length > 0) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Se encontraron los siguientes errores: " + errors.toString(),
      });
    } else {
      const formData = new FormData();

      for (let file of filesRef.current.files) {
        formData.append("images", file);
      }

      const response = await fetch(`${SERVER_URL}/images/upload/products`, {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      let images = [];

      if (responseData.ok) {
        responseData.data.forEach((image) => {
          images.push(image.filename);
        });
      }

      mutate({
        variables: {
          name,
          price: Number(price),
          description,
          quantity: Number(quantity),
          category: selectCategory,
          seller: user.id,
          images: JSON.stringify(images),
        },
      });
    }
  };

  useEffect(async () => {
    if (data && data.addProduct) {
      await Swal.fire({
        icon: "success",
        text: "Producto guardado!!!",
      });
    }
  }, [data]);

  return (
    <Box m="2rem">
      <Flex direction="column" justify="center" height="100%">
        <form onSubmit={(e) => handleSubmit(e)}>
          <Heading as="h2">Registra un producto</Heading>
          <FormControl mt="1rem">
            <FormLabel>Nombre</FormLabel>
            <Input
              placeholder="Fulanito..."
              name="name"
              value={name}
              onChange={(e) => setFormFields(e)}
            />
          </FormControl>
          <FormControl mt="1rem">
            <FormLabel>Precio</FormLabel>
            <Input
              placeholder="Precio..."
              name="price"
              type="number"
              value={price}
              onChange={(e) => setFormFields(e)}
            />
          </FormControl>
          <FormControl mt="1rem">
            <FormLabel>Descripcion</FormLabel>
            <Textarea
              name="description"
              value={description}
              onChange={(e) => setFormFields(e)}
            />
          </FormControl>
          <FormControl mt="1rem">
            <FormLabel>Cantidad</FormLabel>
            <Input
              placeholder="Cantidad"
              name="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setFormFields(e)}
            />
          </FormControl>
          <FormControl mt="1rem">
            <FormLabel>Categoria</FormLabel>
            <Select
              onChange={setFormFields}
              name="selectCategory"
              value={selectCategory}
            >
              {!loading &&
                categoryData &&
                categoryData.categories &&
                categoryData.categories.map((category, index) => {
                  return (
                    <option key={index} value={category.id}>
                      {category.name}
                    </option>
                  );
                })}
            </Select>
          </FormControl>
          <FormControl mt="1rem">
            <FormLabel>Imagenes</FormLabel>
            <Input
              placeholder="Cantidad"
              name="images"
              type="file"
              multiple
              accept="image/png, image/jpeg"
              ref={filesRef}
            />
          </FormControl>
          <Button mt="1rem" type="submit" bg="#F0C040" color="black" w="100%">
            Enviar
          </Button>
        </form>
      </Flex>
    </Box>
  );
};

export default AddProductForm;
