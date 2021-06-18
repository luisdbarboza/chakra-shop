import {
  Grid,
  Input,
  Box,
  VStack,
  HStack,
  Heading,
} from "@chakra-ui/react";

import {useQuery} from "@apollo/client";
import {getAllCategories} from "graphql/queries";
import StarRatingRow from "components/StarRatingRow";

function SearchFilters({filters, setFilters}) {
  const {data: categoriesData, loading: loadingCategories} =
    useQuery(getAllCategories);
  const priceRanges = [
    [1, 10],
    [10, 100],
    [100, 1000],
  ];

  return (
    <>
      {Object.keys(filters).map((filter, index) => {
        return (
          <Box m="0.5rem" key={index} _hover={{backgroundColor: "pink", cursor: "pointer"}}
            onClick={() => {
              setFilters(oldFilters => {
                const filtersCopy = {...oldFilters};

                filtersCopy[filter] = null;
                return filtersCopy;
              })
            }}
          >
            {filter} : {filters[filter]}
          </Box>
        )
      })}
      <Grid templateRows="repeat(3, 150px)" gap={1}>
        <Box>
          <Heading as="h3" size="1.2rem">
            Nombre del producto
          </Heading>
          <Input placeholder="Nombre del producto..."
            onChange={(e) => {
              setFilters(filters => {
                const filtersCopy = {...filters};
                filtersCopy.name = e.target.value;

                return filtersCopy;
              });
            }}
          />
        </Box>
        <Box>
          <Heading as="h3" size="1.2rem">
            Categoria
          </Heading>
          <VStack align="left" color="blue">
            {!loadingCategories && categoriesData && (
              <>
                {categoriesData.categories.map((category, index) => {
                  return (
                    <Box color="blue" _hover={{cursor: "pointer", color: "skyblue"}} key={index}
                      onClick={() => {
                        setFilters(filters => {
                          const filtersCopy = {...filters};
                          filtersCopy.category = category.id;

                          return filtersCopy;
                        });
                      }}
                    >
                      <a>{category.name}</a>
                    </Box>
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
                <Box color="blue" _hover={{cursor: "pointer", color: "skyblue"}} key={index}
                  onClick={() => {
                    setFilters(filters => {
                      const filtersCopy = {...filters};
                      filtersCopy.range = JSON.stringify(range);

                      return filtersCopy;
                    })
                  }}
                >
                  De ${range[0]} a ${range[1]}
                </Box>
              );
            })}
          </VStack>
        </Box>
        <Box>
          <Heading as="h3" size="1.2rem">
            Opinión media de los clientes
          </Heading>
          <VStack align="left">
            {[4, 3, 2, 1].map((stars, index) => {
              return (
                <HStack
                  key={index}
                  _hover={{color: "skyblue", cursor: "pointer"}}
                  onClick={() => {
                    setFilters(filters => {
                      const filtersCopy = {...filters};
                      filtersCopy.minStarRating = stars;

                      return filtersCopy;
                    });
                  }}
                >
                  <StarRatingRow numberOfStars={5} key={index} checked={stars} />
                  <Box color="blue"> o mas</Box>
                </HStack>
              )
            })}
          </VStack>
        </Box>
      </Grid>
    </>
  );
}

export default SearchFilters;
