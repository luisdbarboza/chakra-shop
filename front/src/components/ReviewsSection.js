import { GridItem, Heading } from "@chakra-ui/react";

import ReviewBox from "components/ReviewBox";
import ReviewForm from "components/ReviewForm";

function ReviewsSection({ product }) {
  const Reviews = () => {
    return product.reviews.map((review, index) => {
      return <ReviewBox key={index} review={review} />;
    });
  };

  return (
    <>
      <GridItem colSpan={{ base: 1, md: 2 }} p="1rem">
        <Heading size="1.5rem" mt="1rem">
          Opiniones
        </Heading>
        {product.reviews.length !== 0 ? (
          <Reviews />
        ) : (
          <div>Todavia no hay reviews...</div>
        )}
      </GridItem>
      <GridItem colSpan={{ base: 1, md: 3 }} p="1rem">
        <ReviewForm product={product} />
      </GridItem>
    </>
  );
}

export default ReviewsSection;
