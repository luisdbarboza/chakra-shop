import { useContext, useState, useEffect } from "react";
import { Heading, Grid, GridItem, Box, Image, Button } from "@chakra-ui/react";
import CartItem from "components/CartItem";
import PurchaseCart from "components/PurchaseCart";

import Swal from "sweetalert2";

import { getUserCartInfo } from "graphql/queries";
import { AuthContext } from "context/AuthContext";
import { SERVER_URL } from "constants/constants";
import { useQuery, useMutation } from "@apollo/client";

function Cart() {
  const { user } = useContext(AuthContext);
  const { data, loading, error } = useQuery(getUserCartInfo, {
    variables: {
      id: user.id,
    },
  });
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (!loading && data) {
      setCartData(data.user.cart);
    }
  }, [data, loading]);

  return (
    <>
      {!loading && data ? (
        <>
          <Heading size="1rem" m="1rem" mt="2rem">
            Carrito de compras
          </Heading>
          {data.user.cart.length > 0 ? (
            <Grid
              templateColumns={{ base: "100%" }}
              alignItems="center"
              justifyItems="center"
            >
              {data.user.cart.map((item, index) => {
                const quantity = item.quantity;
                item = item.item; //ya es muy tarde como para cambiar esto 0.0

                const imgPath = `${SERVER_URL}/images/products/${item.mainImage}`;

                return (
                  <GridItem key={index}>
                    <CartItem
                      item={item}
                      quantity={quantity}
                      user={user}
                      imgPath={imgPath}
                      setCartData={setCartData}
                    />
                  </GridItem>
                );
              })}
              <GridItem
                alignItems="center"
                p="1rem"
                justifyItems="center"
                w={{ base: "90%", md: "50%" }}
              >
                <PurchaseCart cartData={cartData} />
              </GridItem>
            </Grid>
          ) : (
            <Box m="1rem" mt="2rem">
              Actualmente no tienes items en tu carrito de compras
            </Box>
          )}
        </>
      ) : (
        <Box>
          <Heading>Carrgando</Heading>
        </Box>
      )}
    </>
  );
}

export default Cart;
