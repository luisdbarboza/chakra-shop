import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Button,
  Grid,
  GridItem,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";

import Swal from "sweetalert2";
import useForm from "../hooks/useForm";
import { useMutation } from "@apollo/client";
import { addOrder } from "graphql/mutations";
import { getUserCartInfo } from "graphql/queries";
import { isEmpty } from "helpers/helpers";
import { useRouter } from "next/router";

function PurchaseCart({ cartData, userData }) {
  const [showForm, setShowForm] = useState(false);
  const [{ fullName, address, city, country }, setFormFields] = useForm({
    fullName: "",
    address: "",
    city: "",
    country: "",
  });
  const [mutate, { data }] = useMutation(addOrder);
  const router = useRouter();

  const totalAmount = cartData.reduce((sum, entry, index) => {
    return entry.quantity * entry.item.price + sum;
  }, 0);

  const totalItems = cartData.reduce((sum, entry, index) => {
    return entry.quantity + sum;
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let orderData = {
      items: [],
      userId: userData.id,
      totalAmount,
      totalItems,
      fullName,
      address,
      city,
      country,
    };
    const errors = [];

    if (
      isEmpty(fullName) ||
      isEmpty(address) ||
      isEmpty(city) ||
      isEmpty(country)
    ) {
      errors.push("Campos vacios");
    }

    if (errors.length > 0) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Se encontraron los siguientes errores: " + errors.toString(),
      });
    } else {
      cartData.forEach((orderEntry, index) => {
        orderData.items.push({
          item: orderEntry.item.id,
          quantity: orderEntry.quantity,
        });
      });

      mutate({
        variables: {
          order: JSON.stringify(orderData),
        },
        refetchQueries: [
          {
            query: getUserCartInfo,
            variables: {
              id: userData.id,
            },
          },
        ],
      });
    }
  };

  useEffect(async () => {
    if (data && data.addOrder) {
      if (data.addOrder.ok) {
        await Swal.fire({
          icon: "success",
          text: data.addOrder.message,
        });

        router.push("/orderHistory");
      } else if (!data.addUser.ok) {
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ocurrio un error",
        });
      }
    }
  }, [data]);

  return (
    <Box bg="#F8F8F8" border="1px solid #C0C0C0" borderRadius="5px" p="1rem">
      <Heading size="1rem">
        Subtotal ({totalItems} items): ${totalAmount.toFixed(2)}
      </Heading>
      {!showForm ? (
        <Button
          bg="#F0C040"
          color="black"
          w="100%"
          onClick={() => setShowForm(true)}
        >
          Facturar
        </Button>
      ) : (
        <form onSubmit={handleSubmit}>
          <GridItem p="1rem">
            <Grid gap={3}>
              <Heading>Ingresa tus datos:</Heading>
              <FormControl>
                <FormLabel>Nombre completo</FormLabel>
                <Input
                  name="fullName"
                  onChange={setFormFields}
                  value={fullName}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Direccion</FormLabel>
                <Input
                  name="address"
                  onChange={setFormFields}
                  value={address}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Ciudad</FormLabel>
                <Input name="city" onChange={setFormFields} value={city} />
              </FormControl>
              <FormControl>
                <FormLabel>Pais</FormLabel>
                <Input
                  name="country"
                  onChange={setFormFields}
                  value={country}
                />
              </FormControl>
              <Button bg="#F0C040" type="submit" color="black" w="100%">
                Pagar
              </Button>
            </Grid>
          </GridItem>
        </form>
      )}
    </Box>
  );
}

export default PurchaseCart;
