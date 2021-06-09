import { Box, Heading, Text, Image, Grid, GridItem } from "@chakra-ui/react";
import Head from "next/head";
import Layout from "../layouts/Layout";
import ProductCard from "../components/ProductCard";
import { useQuery } from "@apollo/client";
import { getAllProducts } from "../graphql/queries";

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

const FeaturedProducts = () => {
  const { data, loading } = useQuery(getAllProducts);

  console.log(data);

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

function Home() {
  return (
    <Layout>
      <Head>
        <title>Chakra Shop Vnzla, Las mejores compras</title>
      </Head>
      <HeroSection />
      <FeaturedProducts />
    </Layout>
  );
}

export default Home;
