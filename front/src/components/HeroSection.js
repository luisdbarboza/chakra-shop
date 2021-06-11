import { Box, Heading, Text, Image, Grid } from "@chakra-ui/react";

const HeroSection = () => {
  return (
    <Box bg="linear-gradient(to bottom, #45ACCF, #FFF)" h="30rem">
      <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))">
        <Box m={{ base: "5rem auto auto auto", sm: "auto" }}>
          <Heading
            fontSize={{ base: "6vw", md: "4vw" }}
            style={{ textAlign: "center" }}
          >
            Bienvenido a Chakra Shop
          </Heading>
        </Box>
        <Box h="30rem">
          <Image
            h="100%"
            p="2rem"
            src="/images/Hero.svg"
            alt="online shopping cart"
          />
        </Box>
      </Grid>
    </Box>
  );
};
export default HeroSection;
