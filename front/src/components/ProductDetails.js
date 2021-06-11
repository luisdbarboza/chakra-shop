import { useState, useEffect, useContext } from "react";
import {
  Box,
  Grid,
  GridItem,
  HStack,
  Image,
  Heading,
  Select,
  Button,
} from "@chakra-ui/react";
import { SERVER_URL } from "constants/constants";

import StarRatingRow from "components/StarRatingRow";

import Link from "next/link";

function ProductDetails({ product }) {
  const [selectedImage, setSelectedImage] = useState(0);

  let imageName = product.images[selectedImage].split("/");
  imageName = imageName[imageName.length - 1];

  const imgPath = `${SERVER_URL}/images/${imageName}`;

  const SelectAndOptions = () => {
    const options = [];

    for (let i = 1; i <= product.quantity; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }

    return <Select mr="0.5rem">{options}</Select>;
  };

  return (
    <>
      <GridItem
        colSpan={1}
        p="1rem"
        borderWidth="1px"
        borderRadius="5px"
        style={{ alignSelf: "center", justifySelf: "center" }}
      >
        <Image src={imgPath} alt={product.name + " " + selectedImage} />
      </GridItem>
      <GridItem colSpan={1} p="1rem">
        <Heading fontSize="2rem" as="h3" mt="1rem">
          {product.name}
        </Heading>
        <HStack>
          <StarRatingRow
            numberOfStars={5}
            checked={Math.floor(product.averageRating)}
          />
          <span>{product.reviewsCount} resenas</span>
        </HStack>
        <Box>Precio: ${product.price}</Box>
        <Box>Descripcion: {product.description}</Box>
        <Grid templateColumns="30% 30% 30%" gap={1}>
          <GridItem colSpan={3}>Imagenes: </GridItem>
          {product.images.map((image, index) => {
            let imageName = image.split("/");

            imageName = imageName[imageName.length - 1];

            const imgPath = `${SERVER_URL}/images/${imageName}`;

            return (
              <Box
                borderRadius="5px"
                borderWidth="2px"
                w="100%"
                h="100%"
                style={{ justifySelf: "center", alignSelf: "center" }}
                _hover={{ cursor: "pointer", borderWidth: "4px" }}
                key={index}
              >
                <Image
                  src={imgPath}
                  m="auto"
                  alt={product.name + " " + index + 1}
                  onClick={() => setSelectedImage(index)}
                />
              </Box>
            );
          })}
        </Grid>
      </GridItem>
      <GridItem colSpan={1}>
        <Box bg="#F8F8F8" p="1rem" borderRadius="5px" borderWidth="2px">
          <Grid templateColumns="50% 50%" gap={1}>
            <GridItem colSpan={2}>Vendedor:</GridItem>
            <GridItem colSpan={2}>
              <Link href={`/profiles/${product.seller.id}`}>
                <a>{product.seller.name}</a>
              </Link>
            </GridItem>
            <GridItem>Estado</GridItem>
            <GridItem>{product.status}</GridItem>
            <GridItem>Cantidad</GridItem>
            <GridItem>
              <SelectAndOptions />
            </GridItem>
            <GridItem colSpan={2}>
              <Button bg="#F0C040" color="black" w="100%">
                Agregar al carrito
              </Button>
            </GridItem>
          </Grid>
        </Box>
      </GridItem>
    </>
  );
}

export default ProductDetails;
