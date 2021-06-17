import {Box, HStack} from "@chakra-ui/react";
import {FaStar} from "react-icons/fa";

const StarRatingRow = ({numberOfStars, checked}) => {
  const stars = [];

  for (let i = 0; i < numberOfStars; i++) {
    if (checked > 0) {
      stars.push(<FaStar color="yellow" />);
      checked -= 1;
    } else {
      stars.push(<FaStar />);
    }
  }

  return (
    <HStack>
      {stars.map((star, index) => (
        <span key={index}>{star}</span>
      ))}
    </HStack>
  );
};

export default StarRatingRow;
