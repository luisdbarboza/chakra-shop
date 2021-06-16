import React from "react";
import {
  Box,
  Grid,
  GridItem,
  Image,
  Heading,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  List,
  ListItem,
  ListIcon,
  UnorderedList,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { getSingleOrder } from "graphql/queries";
import { SERVER_URL } from "constants/constants";

function orderDetails() {
  const router = useRouter();
  const { orderId } = router.query;

  const { data, loading, error } = useQuery(getSingleOrder, {
    variables: {
      id: orderId,
    },
  });

  return (
    <>
      {loading || !data || !data.order ? (
        <Box>Cargando...</Box>
      ) : (
        <Box w="100%" h="100%" p="1.5rem">
          <Heading fontSize="2rem">Orden ${data.order.id}</Heading>
          <Grid
            templateColumns={{ base: "1fr", md: "3fr 1fr" }}
            mt="1rem"
            gap={2}
          >
            <GridItem>
              <Grid gap={3}>
                <Box
                  bg="#F8F8F8"
                  borderRadius="5px"
                  border="1px solid gray"
                  p="1rem"
                >
                  <Heading fontSize="1rem">Envio</Heading>
                  <UnorderedList>
                    <ListItem>
                      <b>Nombre</b>: {data.order.fullName}
                    </ListItem>
                    <ListItem>
                      <b>Ciudad:</b> {data.order.city}
                    </ListItem>
                    <ListItem>
                      <b>Pais:</b> {data.order.country}
                    </ListItem>
                  </UnorderedList>
                </Box>
                <Box
                  bg="#F8F8F8"
                  borderRadius="5px"
                  border="1px solid gray"
                  p="1rem"
                >
                  <Heading fontSize="1rem" m="1rem">
                    Productos
                  </Heading>
                  <Grid
                    templateColumns="1fr 1fr 1fr"
                    alignItems="center"
                    justifyItems="center"
                    gap={2}
                  >
                    {data.order.items.map((item, index) => {
                      const quantity = item.quantity;
                      item = item.item; //-_- NO GOD PLEASE NO, NOOOO, NOOOOOOOOOOOOOO

                      const image = item.mainImage;
                      const imgPath = image
                        ? `${SERVER_URL}/images/products/${image}`
                        : "/images/placeholder.png";
                      return (
                        <React.Fragment key={index}>
                          <Image
                            src={imgPath}
                            h="100px"
                            w="100px"
                            style={{ objectFit: "cover" }}
                            alt="placeholder"
                          />
                          <Box>{item.name}</Box>
                          <Box>
                            {quantity} x ${item.price} = {item.price * quantity}
                          </Box>
                        </React.Fragment>
                      );
                    })}
                  </Grid>
                </Box>
              </Grid>
            </GridItem>
            <GridItem>
              <Box
                bg="#F8F8F8"
                borderRadius="5px"
                border="1px solid gray"
                p="1rem"
              >
                <Heading fontSize="1rem">Resumen del pedido</Heading>
                <Grid templateColumns="1fr 1fr" mt="1rem">
                  <GridItem>Precio Total</GridItem>
                  <GridItem style={{ justifySelf: "end" }}>
                    {data.order.totalAmount}
                  </GridItem>
                  <GridItem>Numero de productos</GridItem>
                  <GridItem style={{ justifySelf: "end" }}>
                    {data.order.totalItems}
                  </GridItem>
                </Grid>
              </Box>
            </GridItem>
          </Grid>
        </Box>
      )}
    </>
  );
}

export default orderDetails;
