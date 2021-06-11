import {
  Grid,
  GridItem,
  Center,
  Box,
  VStack,
  Heading,
  Select,
} from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "layouts/Layout";
import ProductCard from "components/ProductCard";
import StarRatingRow from "components/StarRatingRow";
import { getSearchResults, getAllCategories } from "graphql/queries";

function search() {
  const router = useRouter();
  const { search, category, range } = router.query;
  const priceRanges = [
    [1, 10],
    [10, 100],
    [100, 1000],
  ];

  const filters = JSON.stringify({ name: search, category, range });

  const { data, loading, error } = useQuery(getSearchResults, {
    variables: {
      filters,
    },
  });
  const { data: categoriesData, loading: loadingCategories } =
    useQuery(getAllCategories);

  return (
    <>
      <Head>
        <title>Busqueda: {search}</title>
      </Head>
      <Grid
        templateColumns={{ base: "100%", sm: "20% 80%" }}
        height="4rem"
        wrap="wrap"
        p="0.5rem"
      >
        {!loading && data && (
          <Center>
            <Box flex="1">{data.search.length} Resultados</Box>
          </Center>
        )}
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
        <Grid templateRows="repeat(3, 150px)" gap="1rem">
          <Box>
            <Heading as="h3" size="1.2rem">
              Categoria
            </Heading>
            <VStack align="left" color="blue">
              {!loading && categoriesData && (
                <>
                  {categoriesData.categories.map((category, index) => {
                    return (
                      <Link
                        key={index}
                        href={`/search?category=${category.id}`}
                      >
                        <a>{category.name}</a>
                      </Link>
                    );
                  })}
                </>
              )}
            </VStack>
          </Box>
          <Box>
            <Heading as="h3" size="1.2rem">
              Precio
            </Heading>
            <VStack align="left" color="blue">
              {priceRanges.map((range, index) => {
                return (
                  <Link
                    key={index}
                    href={`/search?range=${JSON.stringify(range)}`}
                  >
                    <a>
                      De ${range[0]} a ${range[1]}
                    </a>
                  </Link>
                );
              })}
            </VStack>
          </Box>
          <Box>
            <Heading as="h3" size="1.2rem">
              Opinión media de los clientes
            </Heading>
            <VStack align="left">
              <Box>
                <StarRatingRow numberOfStars={5} checked={4} /> o mas{" "}
              </Box>
              <Box>
                <StarRatingRow numberOfStars={5} checked={3} /> o mas{" "}
              </Box>
              <Box>
                <StarRatingRow numberOfStars={5} checked={2} /> o mas{" "}
              </Box>
              <Box>
                <StarRatingRow numberOfStars={5} checked={1} /> o mas{" "}
              </Box>
            </VStack>
          </Box>
        </Grid>
        {!loading && data ? (
          <Grid
            templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
            gap="1rem"
            mt="1rem"
          >
            {data.search.map((product, index) => {
              return (
                <ProductCard
                  key={index}
                  name={product.name}
                  price={product.price}
                  seller={product.seller}
                  mainImage={product.mainImage}
                  id={product.id}
                  reviewsCount={product.reviewsCount}
                  averageRating={product.averageRating}
                />
              );
            })}
          </Grid>
        ) : (
          <Box>
            <Heading>Cargando...</Heading>
          </Box>
        )}
      </Grid>
    </>
  );
}

export default search;
