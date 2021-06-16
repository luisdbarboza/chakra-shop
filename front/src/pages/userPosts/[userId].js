import { useState, useEffect, useContext } from "react";
import { AuthContext } from "context/AuthContext";
import { getUserPosts } from "graphql/queries";
import { Table } from "@codecraftkit/core";
import { Box, Grid, Flex, Button } from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";
import { FaRegEdit, FaEye } from "react-icons/fa";
import { useDisclosure } from "@chakra-ui/react";
import { Modal } from "@codecraftkit/core";
import { useQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { removeProduct } from "graphql/mutations";
import Swal from "sweetalert2";
// import { getAllCategories, getAllProducts } from "graphql/queries";

function userPosts() {
  const [removeMutate, { data: removeData }] = useMutation(removeProduct);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { data: postsData, loading } = useQuery(getUserPosts, {
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
      color: "teal",
      label: "Detalles",
      icon: <FaEye />,
      isLink: { route: `/products` },
    },
    {
      color: "blue",
      label: "Editar",
      icon: <FaRegEdit />,
      handler: (user) => alert("edit " + user.name),
    },
    {
      color: "red",
      label: "Borrar",
      icon: <MdDelete />,
      handler: (user) => {
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
          removeMutate({
            variables: {
              id: selectedProduct._id,
            },
            refetchQueries: [{ query: getUserPosts }],
          });
        }}
      >
        Borrar
      </Button>
      <Button bg="skyblue" color="white" onClick={onClose}>
        Cancelar
      </Button>
    </Flex>
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
    if (!user.loggedIn) {
      router.push("/login");
    } else if (!loading && list.length === 0) {
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
          selectedProduct
            ? `Estas seguro de borrar ${selectedProduct.name}?`
            : "Modal title"
        }
        buttonText="New"
        body={
          <Grid
            h={!selectedMode ? "500px" : selectedMode === "Delete" && "200px"}
          >
            {selectedMode === "Delete" ? <DeleteView /> : <div>-_-</div>}
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
