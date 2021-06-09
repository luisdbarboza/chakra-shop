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
  let mainImageName = mainImage.split("/");

  mainImageName = mainImageName[mainImageName.length - 1];

  const imgPath = `${SERVER_URL}/images/${mainImageName}`;

  return (
    <Box borderWidth="1px" borderRadius="lg">
      <Image src={imgPath} alt={`${name} cover`} />
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
              {seller.name}
            </Link>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
}

export default ProductCard;
