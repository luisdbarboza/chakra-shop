import {
  Box,
  Heading,
  Text,
  Image,
  Grid,
  GridItem,
  Link,
} from "@chakra-ui/react";

function ProductCard({ productId, name, price, image, averageRating }) {
  return (
    <Box borderWidth="1px" borderRadius="lg">
      <Image src="/images/persona5_cover.jpg" alt="Persona 5 cover" />
      <Box bg="lightgray" p="0.5rem">
        <Grid templateColumns="repeat(2, 50%)">
          <GridItem
            colSpan={2}
            color="blue"
            fontWeight="bold"
            _hover={{ color: "orange", cursor: "pointer" }}
          >
            Persona 5 Royal
          </GridItem>
          <GridItem colSpan={2}>10 Resenas</GridItem>
          <GridItem colSpan={1} fontWeight="bold">
            $60
          </GridItem>
          <GridItem colSpan={1} style={{ justifySelf: "end" }}>
            <Link color="blue">
              <a>Luis B</a>
            </Link>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
}

export default ProductCard;
