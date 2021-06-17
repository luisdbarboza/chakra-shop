import {useState, useEffect, useContext} from "react";
import {AuthContext} from "context/AuthContext";
import {getUserPosts} from "graphql/queries";
import {Table} from "@codecraftkit/core";
import {MdDelete} from "react-icons/md";
import {FaRegEdit, FaEye} from "react-icons/fa";
import {Modal} from "@codecraftkit/core";
import {useQuery, useMutation} from "@apollo/client";
import {removeProduct} from "graphql/mutations";
import Swal from "sweetalert2";
import {isEmpty} from "helpers/helpers";
//import {useRouter} from "next/router";
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
  useDisclosure
} from "@chakra-ui/react";


import {Form, Formik} from "formik";
import {FormField} from "@codecraftkit/formfield";


function userPosts() {
  const [removeMutate, {data: removeData}] = useMutation(removeProduct);
  const {isOpen, onOpen, onClose} = useDisclosure();
  //const router = useRouter();
  const {user} = useContext(AuthContext);
  const {data: postsData, loading} = useQuery(getUserPosts, {
    variables: {
      sellerId: user.id,
    },
  });
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

  const DeleteView = () => (
    <Flex p="1rem" justify="center" align="center">
      <Button
        bg="red"
        color="white"
        mr="1rem"
        onClick={() => {
          try {
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
            });
          } catch(err) {
            console.log(err);
          }
          onClose();
        }}
      >
        Borrar
      </Button>
      <Button bg="skyblue" color="white" onClick={onClose}>
        Cancelar
      </Button>
    </Flex>
  );

  const EditView = () => (
    <Formik
      initialValues={{
        name: selectedProduct.name,
        price: selectedProduct.price,
        description: selectedProduct.description,
        quantity: selectedProduct.quantity,
        category: selectedProduct.category,
        images: selectedProduct.images,
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
          {/*<FormControl mt="1rem">
          <FormField
            type="select"
            name="category"
            label="Categoria"
            placeholder="Selecciona una categoria"
            data={categories}
          />
        </FormControl>*/}
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
  );

  //verifica si los datos de una eliminacion son correctos
  useEffect(async () => {
    if (removeData && removeData.removeProduct && removeData.removeProduct.id) {
      await Swal.fire({
        icon: "success",
        text: "Producto borrado!!!",
      });
    }
  }, [removeData]);

  useEffect(() => {
    const newList = [];
    if (!loading && list.length === 0) {
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
    }
  }, [loading]);

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
  ) : loading ? (
    <div>loading...</div>
  ) : (
    list.length === 0 && <div>Sin productos publicados</div>
  );
}

export default userPosts;
