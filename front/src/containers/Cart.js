import {
  Heading,
  Grid,
  GridItem,
  Box,
  Image,
  Link,
  Select,
  Button,
} from "@chakra-ui/react";

function Cart() {
  return (
    <>
      <Grid
        templateColumns={{ base: "100%", md: "65% 35%" }}
        alignItems="center"
        justifyItems="center"
      >
        <GridItem colSpan={1}>
          <Box p="1rem">
            <Heading size="1rem" mb="1rem">
              Carrito de compras
            </Heading>
            <Grid
              templateColumns="10% 50% 10% 20% 10%"
              alignItems="center"
              justifyItems="center"
            >
              <GridItem>
                <Image src="/images/placeholder.png" alt="item" />
              </GridItem>

              <GridItem>Lacoste pants</GridItem>

              <GridItem>
                <Select>
                  <option>1</option>
                </Select>
              </GridItem>

              <GridItem>$80</GridItem>

              <GridItem>
                <Button>Borrar</Button>
              </GridItem>
            </Grid>
          </Box>
        </GridItem>
        <GridItem
          colSpan={1}
          alignItems="center"
          p="1rem"
          justifyItems="center"
          w={{ base: "50%", md: "100%" }}
        >
          <Box
            bg="#F8F8F8"
            border="1px solid #C0C0C0"
            borderRadius="5px"
            p="1rem"
          >
            <Heading size="1rem">Subtotal (2 items): $80</Heading>
            <Button bg="#F0C040" color="black" w="100%">
              Facturar
            </Button>
          </Box>
        </GridItem>
      </Grid>
    </>
  );
}

export default Cart;
