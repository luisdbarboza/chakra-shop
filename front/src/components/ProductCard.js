import {useState, useEffect, useContext} from "react";
import {
  Box,
  Button,
  Image,
  Grid,
  GridItem,
  Flex,
  Link,
  useDisclosure
} from "@chakra-ui/react";
import Swal from "sweetalert2";

import {useQuery, useMutation} from "@apollo/client";
import {AuthContext} from "context/AuthContext";
import {SERVER_URL} from "../constants/constants";
import StarRatingRow from "./StarRatingRow";
import {addItemToCart} from "graphql/mutations";
import {getUserCartInfo} from "graphql/queries";

import {Modal} from "@codecraftkit/core";
import ProductContainer from "containers/Product";

function ProductCard({
  name,
  price,
  seller,
  mainImage,
  id,
  reviewsCount,
  averageRating,
}) {
  const {user} = useContext(AuthContext);
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [mutate, mutationData] = useMutation(addItemToCart);
  const {data} = useQuery(getUserCartInfo, {
    variables: {
      id: user.id,
    },
  });
  const imgPath = mainImage
    ? `${SERVER_URL}/images/products/${mainImage}`
    : "/images/placeholder.png";

  const handleCartUpdate = () => {
    mutate({
      variables: {
        userId: user.id,
        productId: id,
        quantity: 1,
      },
      refetchQueries: [{query: getUserCartInfo, variables: {id: user.id}}],
    });
  };

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

  const isOnCartAlready =
    !user.loggedIn || !data || !data.user
      ? false
      : data.user.cart.some((cartProduct) => {
        return cartProduct.item.id === id;
      });

  return (
    <>
      <Box borderWidth="1px" borderRadius="lg" h="500px"
        _hover={{boxShadow: "0px 0px 5px gray", cursor: "pointer"}}
        onClick={() => onOpen()}
      >
        <Flex
          justify="center"
          align="center"
          w="90%"
          m="auto"
          p="1rem"
          h="350px"
        >
          <Image
            src={imgPath}
            alt={`${name} cover`}
            h="100%"
            style={{objectFit: "cover"}}
            borderRadius="5px"
          />
        </Flex>
        <Box p="0.5rem" h="150px">
          <Grid templateColumns="repeat(2, 50%)">
            <GridItem
              colSpan={2}
              color="blue"
              fontWeight="bold"
              _hover={{color: "orange", cursor: "pointer"}}
            >
              {name}
            </GridItem>
            <GridItem colSpan={1}>
              <StarRatingRow
                numberOfStars={5}
                checked={Math.floor(averageRating)}
              />
              <span>{reviewsCount} Resenas</span>
            </GridItem>
            {user.loggedIn && user.id !== seller.id && !isOnCartAlready && (
              <GridItem colSpan={1}>
                <Box
                  onClick={(e) => {
                    e.preventDefault();
                    handleCartUpdate();
                  }}
                  _hover={{textDecoration: "underline", color: "orange"}}
                >Agregar al carrito</Box>
              </GridItem>
            )}
            <GridItem gridColumn="2/-1" fontWeight="bold">
              ${price}
            </GridItem>
            <GridItem gridColumn="2/-1" style={{justifySelf: "end"}}>
              <Box>{seller.name}</Box>
            </GridItem>
          </Grid>
        </Box>
      </Box>
      <Modal
        boxSize="95%"
        body={<ProductContainer id={id} />}
        closeOnOverlayClick={false}
        onOpen={onOpen}
        isOpen={isOpen}
        onClose={onClose} />
    </>
  );
}

export default ProductCard;
