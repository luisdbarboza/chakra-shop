import { Heading, Box } from "@chakra-ui/react";
import StarRatingRow from "components/StarRatingRow";

function ReviewBox({ review }) {
  return (
    <>
      <Box p="1rem" pl="0rem" borderBottom="1px solid gray">
        <Box>{review.author.name}</Box>
        <Box>{review.date}</Box>
        <StarRatingRow numberOfStars={5} checked={review.rating} />
        <Box pt="0.5rem">{review.text}</Box>
      </Box>
    </>
  );
}

export default ReviewBox;
