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
  let mainImageName = mainImage.split("/");

  mainImageName = mainImageName[mainImageName.length - 1];

  const imgPath = `${SERVER_URL}/images/${mainImageName}`;

  return (
    <Link href={`/products/${id}`}>
      <Box borderWidth="1px" borderRadius="lg" h="max-content">
        <Image src={imgPath} alt={`${name} cover`} />
        <Box p="0.5rem">
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
