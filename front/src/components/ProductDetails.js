import { useState, useEffect, useContext } from "react";
import {
  Box,
  Grid,
  GridItem,
  Flex,
  HStack,
  Image,
  Heading,
  Select,
  Button,
} from "@chakra-ui/react";
import Swal from "sweetalert2";
import { useQuery, useMutation } from "@apollo/client";
import { SERVER_URL } from "constants/constants";
import { AuthContext } from "context/AuthContext";
import { getUserCartInfo } from "graphql/queries";
import { addItemToCart } from "graphql/mutations";

import StarRatingRow from "components/StarRatingRow";
import useForm from "hooks/useForm";

import Link from "next/link";

function ProductDetails({ product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const { user } = useContext(AuthContext);
  const [{ quantity }, setQuantity] = useForm({
    quantity: "1",
  });
  const { data } = useQuery(getUserCartInfo, {
    variables: {
      id: user.id,
    },
  });
  const [mutate, mutationData] = useMutation(addItemToCart);

  let imageName = product.images[selectedImage];

  const imgPath =
    typeof imageName !== "undefined"
      ? `${SERVER_URL}/images/products/${imageName}`
      : "/images/placeholder.png";

  const SelectAndOptions = () => {
    const options = [];

    for (let i = 1; i <= product.quantity; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }

    return (
      <Select
        name="quantity"
        value={quantity}
        onChange={setQuantity}
        mr="0.5rem"
      >
        {options}
      </Select>
    );
  };

  const isOnCartAlready =
    !data || (!data && !data.user)
      ? false
      : data.user.cart.some((cartProduct) => {
          return cartProduct.item.id === product.id;
        });

  useEffect(async () => {
    if (
      !mutationData.loading &&
      mutationData.data &&
      mutationData.data.addItemToCart.ok
    ) {
      await Swal.fire({
        icon: "success",
        text: mutationData.data.addItemToCart.message,
      });

      mutationData.data.addItemToCart.ok = false;
    }
  }, [mutationData]);

  const handleCartUpdate = () => {
    mutate({
      variables: {
        userId: user.id,
        productId: product.id,
        quantity: Number(quantity),
      },
      refetchQueries: [{ query: getUserCartInfo, variables: { id: user.id } }],
    });
  };

  return (
    <>
      <GridItem
        colSpan={1}
        p="1rem"
        borderWidth="1px"
        borderRadius="5px"
        style={{ alignSelf: "center", justifySelf: "center" }}
        h="500px"
        w="100%"
      >
        <Flex justify="center" align="center" h="100%" w="100%">
          <Image
            src={imgPath}
            m="auto"
            alt={product.name + " " + selectedImage}
            borderRadius="5px"
            h="100%"
          />
        </Flex>
      </GridItem>
      <GridItem colSpan={1} p="1rem">
        <Heading fontSize="2rem" as="h3" mt="1rem">
          {product.name}
        </Heading>
        <HStack>
          <StarRatingRow
            numberOfStars={5}
            checked={Math.floor(product.averageRating)}
          />
          <span>{product.reviewsCount} resenas</span>
        </HStack>
        <Box>Precio: ${product.price}</Box>
        <Box>Descripcion: {product.description}</Box>
        <Grid templateColumns="30% 30% 30%" gap={1}>
          <GridItem colSpan={3}>Imagenes: </GridItem>
          {product.images.map((image, index) => {
            const imgPath = `${SERVER_URL}/images/products/${image}`;

            return (
              <Box
                borderRadius="5px"
                borderWidth="2px"
                w="100%"
                h="100%"
                style={{ display: "flex" }}
                _hover={{ cursor: "pointer", borderWidth: "4px" }}
                key={index}
              >
                <Image
                  src={imgPath}
                  m="auto"
                  alt={product.name + " " + index + 1}
                  onClick={() => setSelectedImage(index)}
                />
              </Box>
            );
          })}
        </Grid>
      </GridItem>
      <GridItem colSpan={1}>
        <Box bg="#F8F8F8" p="1rem" borderRadius="5px" borderWidth="2px">
          <Grid templateColumns="50% 50%" gap={1}>
            <GridItem colSpan={2}>Vendedor:</GridItem>
            <GridItem colSpan={2}>
              <Link href={`/profiles/${product.seller.id}`}>
                <a>{product.seller.name}</a>
              </Link>
            </GridItem>
            <GridItem>Estado</GridItem>
            <GridItem>
              {product.quantity > 0 ? "Disponible" : "Sin Stock"}
            </GridItem>
            <GridItem>Cantidad</GridItem>
            <GridItem>
              {user.loggedIn &&
              user.id !== product.seller.id &&
              !isOnCartAlready &&
              product.quantity > 0 ? (
                <SelectAndOptions />
              ) : (
                <>{product.quantity}</>
              )}
            </GridItem>
            <GridItem colSpan={2}>
              {user.loggedIn &&
                user.id !== product.seller.id &&
                !isOnCartAlready &&
                product.quantity > 0 && (
                  <Button
                    bg="#F0C040"
                    color="black"
                    w="100%"
                    onClick={handleCartUpdate}
                  >
                    Agregar al carrito
                  </Button>
                )}
            </GridItem>
          </Grid>
        </Box>
      </GridItem>
    </>
  );
}

export default ProductDetails;
