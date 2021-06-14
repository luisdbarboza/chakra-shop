import {
  Grid,
  GridItem,
  Center,
  Box,
  VStack,
  Heading,
  Select,
} from "@chakra-ui/react";

import Link from "next/link";
import { useQuery } from "@apollo/client";
import { getAllCategories } from "graphql/queries";
import StarRatingRow from "components/StarRatingRow";

function SearchFilters() {
  const { data: categoriesData, loading: loadingCategories } =
    useQuery(getAllCategories);
  const priceRanges = [
    [1, 10],
    [10, 100],
    [100, 1000],
  ];

  return (
    <Grid templateRows="repeat(3, 150px)" gap="1rem">
      <Box>
        <Heading as="h3" size="1.2rem">
          Categoria
        </Heading>
        <VStack align="left" color="blue">
          {!loadingCategories && categoriesData && (
            <>
              {categoriesData.categories.map((category, index) => {
                return (
                  <Link key={index} href={`/search?category=${category.id}`}>
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
              <Link key={index} href={`/search?range=${JSON.stringify(range)}`}>
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
  );
}

export default SearchFilters;
