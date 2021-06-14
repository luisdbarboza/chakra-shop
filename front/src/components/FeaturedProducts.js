import { Box, Heading, Grid, GridItem } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import ProductCard from "components/ProductCard";
import { getAllProducts } from "graphql/queries";
import { ProductIcon } from "components/Icons/Icons";
import SkeletonIcon from "components/SkeletonIcons/SkeletonIcon";

const FeaturedProducts = () => {
  const { data, loading } = useQuery(getAllProducts);

  return (
    <Box p="1rem">
      <Heading
        size="lg"
        as="h2"
        mb="1rem"
        textAlign={{ base: "center", sm: "left" }}
      >
        Productos destacados
      </Heading>
      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap="1rem">
        {loading || !data || !data.products ? (
          <>
            <Box w="100%" h="100px">
              <SkeletonIcon icon={ProductIcon} loading={true} duration={3} />
            </Box>
            <Box w="100%" h="100px">
              <SkeletonIcon icon={ProductIcon} loading={true} duration={2} />
            </Box>
            <Box w="100%" h="100px">
              <SkeletonIcon icon={ProductIcon} loading={true} duration={1} />
            </Box>

            <Box w="100%" h="100px">
              <SkeletonIcon icon={ProductIcon} loading={true} duration={4} />
            </Box>
          </>
        ) : (
          <>
            {data.products.map((product, index) => {
              return (
                <ProductCard
                  key={index}
                  name={product.name}
                  price={product.price}
                  seller={product.seller}
                  mainImage={product.mainImage}
                  averageRating={product.averageRating}
                  id={product.id}
                  reviewsCount={product.reviewsCount}
                />
              );
            })}
          </>
        )}
      </Grid>
    </Box>
  );
};

export default FeaturedProducts;
