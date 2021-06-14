import {
  Box,
  Heading,
  Text,
  Image,
  Grid,
  GridItem,
  Flex,
  Link,
} from "@chakra-ui/react";
import { SERVER_URL } from "../constants/constants";
import StarRatingRow from "./StarRatingRow";

function ProductCard({
  name,
  price,
  seller,
  mainImage,
  id,
  reviewsCount,
  averageRating,
}) {
  const imgPath = mainImage
    ? `${SERVER_URL}/images/products/${mainImage}`
    : "/images/placeholder.png";

  return (
    <Link href={`/products/${id}`}>
      <Box borderWidth="1px" borderRadius="lg" h="500px">
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
            style={{ objectFit: "cover" }}
            borderRadius="5px"
          />
        </Flex>
        <Box p="0.5rem" h="150px">
          <Grid templateColumns="repeat(2, 50%)">
            <GridItem
              colSpan={2}
              color="blue"
              fontWeight="bold"
              _hover={{ color: "orange", cursor: "pointer" }}
            >
              {name}
            </GridItem>
            <GridItem colSpan={2}>
              <StarRatingRow
                numberOfStars={5}
                checked={Math.floor(averageRating)}
              />
              <span>{reviewsCount} Resenas</span>
            </GridItem>
            <GridItem colSpan={1} fontWeight="bold">
              ${price}
            </GridItem>
            <GridItem colSpan={1} style={{ justifySelf: "end" }}>
              <Box>{seller.name}</Box>
            </GridItem>
          </Grid>
        </Box>
      </Box>
    </Link>
  );
}

export default ProductCard;
