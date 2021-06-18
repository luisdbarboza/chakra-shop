import {useState, useEffect, useContext} from "react";
import {AuthContext} from "context/AuthContext";
import {getUserPosts, getAllCategories} from "graphql/queries";
import {Table} from "@codecraftkit/core";
import {MdDelete} from "react-icons/md";
import {FaRegEdit, FaEye} from "react-icons/fa";
import {Modal} from "@codecraftkit/core";
import {useQuery, useMutation} from "@apollo/client";
import {removeProduct, updateProduct} from "graphql/mutations";
import Swal from "sweetalert2";
import {isEmpty} from "helpers/helpers";
//import {useRouter} from "next/router";
import {
  Grid,
  Heading,
  Flex,
  Box,
  Button,
  FormControl,
  useDisclosure
} from "@chakra-ui/react";
import {SERVER_URL} from "constants/constants";


import {Form, Formik} from "formik";
import {FormField} from "@codecraftkit/formfield";


function userPosts() {
  const {isOpen, onOpen, onClose} = useDisclosure();
  //const router = useRouter();
  const {user} = useContext(AuthContext);
  const {data: postsData, loading: loadingPosts, error: postsError} = useQuery(getUserPosts, {
    variables: {
      sellerId: user.id,
    },
  });
  const [refresh, setRefresh] = useState(false);

  const [list, setList] = useState([]);
  const head = ["name", "price", "description", "quantity"];
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const actions = (row) => [
    {
      color: "blue",
      label: "Editar",
      icon: <FaRegEdit />,
      handler: (user) => {
        setSelectedProduct(row);
        setSelectedMode("Edit");
        onOpen();
      },
    },
    {
      color: "red",
      label: "Borrar",
      icon: <MdDelete />,
      handler: () => {
        setSelectedProduct(row);
        setSelectedMode("Delete");
        onOpen();
      },
    },
  ];

  const DeleteView = () => {
    const [removeMutate, {data: removeData, error}] = useMutation(removeProduct);
    
    return (
      <Flex p="1rem" justify="center" align="center">
        <Button
          bg="red"
          color="white"
          mr="1rem"
          onClick={() => {
            console.log(user.id, getUserPosts);

              removeMutate({
                variables: {
                  id: selectedProduct._id,
                },
                refetchQueries: [
                  {
                    query: getUserPosts,
                    variables: {sellerId: user.id}
                  }
                ],
              })
              .then(() => {
                Swal.fire({
                  icon: "success",
                  text: "Producto borrado!!!",
                });
                onClose();
                setRefresh(true);
              })
              .catch(err => {
                console.log(error);
                Swal.fire({
                  icon: "error",
                  text: err,
                });
              })
          }}
        >
          Borrar
        </Button>
        <Button bg="skyblue" color="white" onClick={onClose}>
          Cancelar
        </Button>
      </Flex>
    )
  }

  const EditView = () => {
    const [updateMutate, {data: updateData}] = useMutation(updateProduct);
    const {data: categoryData, loading} = useQuery(getAllCategories);
    const [categories, setCategories] = useState([]);


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
      if (updateData && updateData.updateProduct) {
        await Swal.fire({
          icon: "success",
          text: "Producto actualizado!!!",
        });
      }
    }, [updateData]);

    return (
      <Formik
        initialValues={{
          name: selectedProduct.name,
          price: selectedProduct.price,
          description: selectedProduct.description,
          quantity: selectedProduct.quantity,
          category: selectedProduct.category,
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

          if (errors.length > 0) {
            await Swal.fire({
              icon: "error",
              title: "Oops...",
              text:
                "Se encontraron los siguientes errores: " + errors.toString(),
            });
          } else {
            const formData = new FormData();

            if(images.length > 0) {
              for (let file of images) {
                formData.append("images", file);
              }
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

            const data = JSON.stringify({name, price, description, category, images: imagesUploaded});

            updateMutate({
              variables: {
                id: selectedProduct._id,
                data
              },
              refetchQueries: [
                {query: getUserPosts, variables: {sellerId: user.id}}
              ]
            });

            setRefresh(true);
            resetForm();
          }

          setSubmitting(false);
        }}
      >
        {({isSubmitting}) => (
          <Form>
            <Heading as="h2">Editar</Heading>
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
    )
  };


  useEffect(() => {
    const newList = [];
    if (!loadingPosts && postsData || refresh) {
      postsData.posts.forEach((post) => {
        newList.push({
          _id: post.id,
          name: post.name,
          price: post.price,
          description: post.description,
          quantity: post.quantity,
        });
      });

      setList(newList);
      setRefresh(false);
    }
  }, [loadingPosts, refresh]);

  return list.length > 0 ? (
    <Box p="2rem" w="100%" h="100%">
      <Table list={list} head={head} actionsWithRow={actions} />
      <Modal
        title={
          selectedMode === "Delete"
            ? `Estas seguro de borrar ${selectedProduct.name}?`
            : ""
        }
        buttonText="New"
        body={
          <Grid
            h={!selectedMode ? "500px" : selectedMode === "Delete" ? "200px" : selectedMode === "Edit" && "max-content"}
          >
            {selectedMode === "Delete" ? <DeleteView /> : selectedMode === "Edit" ? <EditView /> : <div>-_-</div>}
          </Grid>
        }
        closeOnOverlayClick={false}
        onOpen={onOpen}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Box>
  ) : loadingPosts ? (
    <div>loading...</div>
  ) : (
    list.length === 0 && <div>Sin productos publicados</div>
  );
}

export default userPosts;
