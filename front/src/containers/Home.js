import {useState} from "react";
import Head from "next/head";
import HeroSection from "components/HeroSection";
//import FeaturedProducts from "components/FeaturedProducts";
import {Grid, GridItem, Box, Heading} from "@chakra-ui/react";
import SearchFilters from "components/SearchFilters";
import SearchResults from "components/SearchResults";
import {useQuery} from "@apollo/client";
import {getSearchResults} from "graphql/queries";

function Home() {
  const [filters, setFilters] = useState({
    name: null,
    category: null,
    range: null,
    minStarRating: null
  });
  const {data: searchData, loading} = useQuery(getSearchResults, {
    variables: {
      filters: JSON.stringify(filters)
    }
  });

  return (
    <>
      <Head>
        <title>Chakra Shop Vnzla, Las mejores compras</title>
      </Head>
      <HeroSection />
      <Grid templateColumns={{base: "30% 60%", md: "15% 20% 50% 15%"}} justifyContent="space-between" w="100%">
        <GridItem gridColumn={{base: "1/-1", md: "2/-1"}} p="1rem">
          <Heading>Productos destacados</Heading>
        </GridItem>
        <Box gridColumn="1/2" display={{base: "none", md: "block"}} />
        <GridItem gridColumn={{base: "1/2", md: "2/3"}} p="1rem">
          <SearchFilters filters={filters} setFilters={setFilters} />
        </GridItem>
        <GridItem gridColumn={{base: "2/3", md: "3/4"}} p="1rem">
          {searchData && searchData.search && !loading ? (
            <SearchResults data={searchData.search} />
          ) : (
            <Box>Sin resultados</Box>
          )}
        </GridItem>
        <Box gridColumn="4/5" display={{base: "none", md: "block"}} />
      </Grid>
    </>
  );
}

export default Home;
