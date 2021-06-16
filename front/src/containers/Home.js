import Head from "next/head";
import HeroSection from "components/HeroSection";
import FeaturedProducts from "components/FeaturedProducts";

function Home() {
  return (
    <>
      <Head>
        <title>Chakra Shop Vnzla, Las mejores compras</title>
      </Head>
      <HeroSection />
      <FeaturedProducts />
    </>
  );
}

export default Home;
