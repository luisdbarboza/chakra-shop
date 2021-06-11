import { Box, Heading, Grid } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import ProductCard from "components/ProductCard";
import { getAllProducts } from "graphql/queries";

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
        {loading ? (
          <Heading size="1rem">Cargando</Heading>
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
