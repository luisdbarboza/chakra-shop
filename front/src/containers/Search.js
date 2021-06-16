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
import { getSearchResults } from "graphql/queries";
import SearchFilters from "components/SearchFilters";
import SearchResults from "components/SearchResults";

function Search() {
  const router = useRouter();
  const { search, category, range } = router.query;

  const filters = JSON.stringify({ name: search, category, range });

  const { data, loading, error } = useQuery(getSearchResults, {
    variables: {
      filters,
    },
  });

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
        <SearchFilters />
        {!loading && data ? (
          <SearchResults data={data} />
        ) : (
          <Box>
            <Heading>Cargando...</Heading>
          </Box>
        )}
      </Grid>
    </>
  );
}

export default Search;
