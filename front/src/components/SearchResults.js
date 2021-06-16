import { Grid } from "@chakra-ui/react";
import ProductCard from "components/ProductCard";

function SearchResults({ data }) {
  return (
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
  );
}

export default SearchResults;
