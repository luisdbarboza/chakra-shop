import { useState, useEffect } from "react";
import { Grid, GridItem, Box, Image, Select, Button } from "@chakra-ui/react";

import Swal from "sweetalert2";

import { removeProductFromCart } from "graphql/mutations";
import { getUserCartInfo } from "graphql/queries";
import { useMutation } from "@apollo/client";
import useForm from "hooks/useForm";

const SelectAndOptions = ({ product, defaultQuantity, setCartData }) => {
  const options = [];
  const [{ selectQuantity }, setSelectQuantity] = useForm({
    selectQuantity: defaultQuantity,
  });

  useEffect(() => {
    setCartData((oldCartData) => {
      const newCartData = JSON.parse(JSON.stringify(oldCartData));

      newCartData.forEach((record) => {
        if (record.item.id === product.id) {
          record.quantity = Number(selectQuantity);
        }
      });

      return newCartData;
    });
  }, [selectQuantity]);

  for (let i = 1; i <= product.quantity; i++) {
    options.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }

  return (
    <Select
      mr="0.5rem"
      name="selectQuantity"
      value={selectQuantity}
      onChange={setSelectQuantity}
    >
      {options}
    </Select>
  );
};

function CartItem({ item, quantity, user, imgPath, setCartData }) {
  const [removeMutate, removeMutationData] = useMutation(removeProductFromCart);

  const handleRemove = (userId, productId) => {
    removeMutate({
      variables: {
        userId,
        productId,
      },
      refetchQueries: [{ query: getUserCartInfo, variables: { id: user.id } }],
    });
  };

  useEffect(async () => {
    if (removeMutationData && removeMutationData.data) {
      const data = removeMutationData.data;

      if (data.removeProductFromCart && data.removeProductFromCart.ok) {
        await Swal.fire({
          icon: "success",
          text: data.removeProductFromCart.message,
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ocurrio un error, intentelo mas tarde",
        });
      }
    }
  }, [removeMutationData]);

  return (
    <Box p="1rem">
      <Grid
        templateColumns="1fr 5fr 1fr 2fr 1fr"
        alignItems="center"
        justifyItems="center"
      >
        <GridItem>
          <Image src={imgPath} alt={item.name} w="100%" h="100%" />
        </GridItem>

        <GridItem>{item.name}</GridItem>

        <GridItem>
          <SelectAndOptions
            product={item}
            defaultQuantity={quantity}
            setCartData={setCartData}
          />
        </GridItem>

        <GridItem>${item.price}</GridItem>

        <GridItem>
          <Button onClick={() => handleRemove(user.id, item.id)}>Borrar</Button>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default CartItem;
