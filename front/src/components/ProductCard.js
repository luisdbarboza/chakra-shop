import {
  Box,
  Heading,
  Text,
  Image,
  Grid,
  GridItem,
  Link,
} from "@chakra-ui/react";
import { SERVER_URL } from "../constants/constants";

function ProductCard({ name, price, seller, mainImage, id, reviewsCount }) {
  return (
    <Box borderWidth="1px" borderRadius="lg">
      <Image src={`${SERVER_URL}/images/${mainImage}`} alt={`${name} cover`} />
      <Box bg="lightgray" p="0.5rem">
        <Grid templateColumns="repeat(2, 50%)">
          <GridItem
            colSpan={2}
            color="blue"
            fontWeight="bold"
            _hover={{ color: "orange", cursor: "pointer" }}
          >
            {name}
          </GridItem>
          <GridItem colSpan={2}>{reviewsCount} Resenas</GridItem>
          <GridItem colSpan={1} fontWeight="bold">
            ${price}
          </GridItem>
          <GridItem colSpan={1} style={{ justifySelf: "end" }}>
            <Link color="blue" href={`/users/${seller.id}`}>
              <a>{seller.name}</a>
            </Link>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
}

export default ProductCard;
