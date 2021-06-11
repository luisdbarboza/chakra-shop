import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  GridItem,
  HStack,
  VStack,
  Image,
  Heading,
  Select,
  Button,
} from "@chakra-ui/react";
import Layout from "layouts/Layout";
import { client, SERVER_URL } from "constants/constants";
import { getAllProductsId, getSingleProductInfo } from "graphql/queries";
import StarRatingRow from "components/StarRatingRow";

import Head from "next/head";
import Link from "next/link";

export async function getStaticPaths() {
  const { data } = await client.query({
    query: getAllProductsId,
  });

  return {
    paths: data.products.map((product) => {
      return { params: { id: product.id } };
    }),
    fallback: false,
  };
}

function product({ data }) {
  const [selectedImage, setSelectedImage] = useState(0);

  let imageName = data.images[selectedImage].split("/");
  imageName = imageName[imageName.length - 1];

  const imgPath = `${SERVER_URL}/images/${imageName}`;

  const SelectAndOptions = () => {
    const options = [];

    for (let i = 1; i <= data.quantity; i++) {
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
      <Head>
        <title>{data.name} - ChakraShop</title>
      </Head>
      <Grid templateColumns={{ base: "2fr", md: "2fr 1fr 1fr" }} mt="1rem">
        <Box
          p="1rem"
          borderWidth="1px"
          borderRadius="5px"
          style={{ alignSelf: "center", justifySelf: "center" }}
        >
          <Image src={imgPath} alt={data.name + " " + selectedImage} />
        </Box>
        <GridItem p="1rem">
          <Heading fontSize="2rem" as="h3" mt="1rem">
            {data.name}
          </Heading>
          <HStack>
            <StarRatingRow
              numberOfStars={5}
              checked={Math.floor(data.averageRating)}
            />
            <span>{data.reviewsCount} resenas</span>
          </HStack>
          <Box>Precio: ${data.price}</Box>
          <Box>Descripcion: {data.description}</Box>
          <Grid templateColumns="30% 30% 30%" gap={1}>
            <GridItem colSpan={3}>Imagenes: </GridItem>
            {data.images.map((image, index) => {
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
                    alt={data.name + " " + index + 1}
                    onClick={() => setSelectedImage(index)}
                  />
                </Box>
              );
            })}
          </Grid>
        </GridItem>
        <GridItem>
          <Box bg="#F8F8F8" p="1rem" borderRadius="5px" borderWidth="2px">
            <Grid templateColumns="50% 50%" gap={1}>
              <GridItem colSpan={2}>Vendedor:</GridItem>
              <GridItem colSpan={2}>
                <Link href={`/profiles/${data.seller.id}`}>
                  <a>{data.seller.name}</a>
                </Link>
              </GridItem>
              <GridItem>Estado</GridItem>
              <GridItem>{data.status}</GridItem>
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
      </Grid>
    </>
  );
}

export async function getStaticProps({ params }) {
  const { data } = await client.query({
    query: getSingleProductInfo,
    variables: {
      id: params.id,
    },
  });

  return {
    props: {
      data: data.product,
    },
  };
}

export default product;
