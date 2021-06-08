import {
  Grid,
  GridItem,
  Center,
  Box,
  VStack,
  Heading,
  Select,
} from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../layouts/Layout";
import ProductCard from "../../components/ProductCard";

function search() {
  return (
    <Layout>
      <Head>
        <title>Busqueda: Termino</title>
      </Head>
      <Grid
        templateColumns={{ base: "100%", sm: "20% 80%" }}
        height="4rem"
        wrap="wrap"
        p="0.5rem"
      >
        <Center>
          <Box flex="1">10 Resultados</Box>
        </Center>
        <Center style={{ justifySelf: "end" }}>
          <Box flex="2">
            <span>Ordenar por:</span>
            <Select placeholder="Seleccionar opcion">
              <option value="nuevo">Lo mas nuevo</option>
              <option value="precio-asc">Precio ascendente</option>
              <option value="precio-desc">Precio descendente</option>
            </Select>
          </Box>
        </Center>
      </Grid>
      <Grid
        p="0.5rem"
        templateColumns={{ base: "100%", md: "20% 80%" }}
        height="88vh"
      >
        <Grid templateRows="repeat(3, 150px)">
          <Box>
            <Heading as="h3" size="1.2rem">
              Categoria
            </Heading>
            <VStack align="left" color="blue">
              <Link href="/search/termino">
                <a>Videojuegos</a>
              </Link>
              <Link href="/search/termino">
                <a>Peliculas</a>
              </Link>
              <Link href="/search/termino">
                <a>Computadoras</a>
              </Link>
              <Link href="/search/termino">
                <a>Libros</a>
              </Link>
            </VStack>
          </Box>
          <Box>
            <Heading as="h3" size="1.2rem">
              Precio
            </Heading>
            <VStack align="left" color="blue">
              <Link href="/search/termino">
                <a>De $1 a 10$</a>
              </Link>
              <Link href="/search/termino">
                <a>De $10 a 100$</a>
              </Link>
              <Link href="/search/termino">
                <a>De $100 a $1000</a>
              </Link>
            </VStack>
          </Box>
          <Box>
            <Heading as="h3" size="1.2rem">
              Valoracion
              <VStack></VStack>
            </Heading>
          </Box>
        </Grid>
        <Grid>
          <Grid
            templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
            gap="1rem"
            mt="1rem"
          >
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default search;
