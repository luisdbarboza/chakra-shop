import {useState, useEffect, useContext} from "react";
import {
  Heading,
  Flex,
  Box,
  Button,
  FormControl,
} from "@chakra-ui/react";

import Swal from "sweetalert2";
import {AuthContext} from "context/AuthContext";
import {client, SERVER_URL} from "constants/constants";
import {useQuery, useMutation} from "@apollo/client";
import {addProductMutation} from "graphql/mutations";
import {getAllCategories, getAllProducts} from "graphql/queries";

import {isEmpty} from "helpers/helpers";

import {Form, Formik} from "formik";
import {FormField} from "@codecraftkit/formfield";

const AddProductForm = () => {
  const [categories, setCategories] = useState([]);
  const {data: categoryData, loading} = useQuery(getAllCategories);
  const [mutate, {data}] = useMutation(addProductMutation);
  const {user, dispatchUser} = useContext(AuthContext);

  useEffect(() => {
    if (!loading && categoryData && categoryData.categories) {
      const categoriesArray = [];

      categoryData.categories.forEach((category) => {
        categoriesArray.push({label: category.name, value: category.id});
      });

      setCategories(categoriesArray);
    }
  }, [categoryData]);

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
        <Formik
          initialValues={{
            name: "",
            price: 0,
            description: "",
            quantity: 1,
            category: "",
            images: [],
          }}
          validate={({name, price, description, quantity, category}) => {
            const errors = {};

            if (isEmpty(name)) errors.name = "El campo nombre es obligatorio";
            if (isEmpty(description))
              errors.description = "Es necesaria una descripcion del producto";
            if (Number(price) <= 0) errors.price = "Precio invalido";
            if (Number(quantity) <= 0) errors.quantity = "Cantidad invalida";
            if (category === "")
              errors.category = "Debes escoger una categoria";

            return errors;
          }}
          onSubmit={async (
            {name, price, description, quantity, category, images},
            {setSubmitting, resetForm}
          ) => {
            setSubmitting(true);
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
                text:
                  "Se encontraron los siguientes errores: " + errors.toString(),
              });
            } else {
              // console.log(filesRef.current.files);
              const formData = new FormData();

              for (let file of images) {
                formData.append("images", file);
              }

              const response = await fetch(
                `${SERVER_URL}/images/upload/products`,
                {
                  method: "POST",
                  body: formData,
                }
              );

              const responseData = await response.json();

              let imagesUploaded = [];

              if (responseData.ok) {
                responseData.data.forEach((image) => {
                  imagesUploaded.push(image.filename);
                });
              }

              mutate({
                variables: {
                  name,
                  price: Number(price),
                  description,
                  quantity: Number(quantity),
                  category,
                  seller: user.id,
                  images: JSON.stringify(imagesUploaded),
                },
                refetchQueries: [
                  {
                    query: getAllProducts,
                  }
                ],
              });

              resetForm();
            }

            setSubmitting(false);
          }}
        >
          {({isSubmitting}) => (
            <Form>
              <Heading as="h2">Registra un producto</Heading>
              <FormControl mt="1rem">
                <FormField label="Nombre" name="name" required type="text" />
              </FormControl>
              <FormControl mt="1rem">
                <FormField type="number" name="price" label="Precio:" min={0} />
              </FormControl>
              <FormControl mt="1rem">
                <FormField
                  type="textarea"
                  name="description"
                  label="Descripcion"
                />
              </FormControl>
              <FormControl mt="1rem">
                <FormField
                  type="number"
                  name="quantity"
                  label="Cantidad:"
                  min={0}
                />
              </FormControl>
              <FormControl mt="1rem">
                <FormField
                  type="select"
                  name="category"
                  label="Categoria"
                  placeholder="Selecciona una categoria"
                  data={categories}
                />
              </FormControl>
              <FormControl mt="1rem">
                <FormField
                  type="image"
                  height="200px"
                  name="images"
                  label="Imagenes referenciales"
                  placeholder="Selecciona imagenes"
                  multiple
                //stackImages
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
            </Form>
          )}
        </Formik>
      </Flex>
    </Box>
  );
};

export default AddProductForm;
