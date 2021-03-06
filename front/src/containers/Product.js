import {Grid} from "@chakra-ui/react";
import {SERVER_URL} from "constants/constants";

import {getSingleProductInfo} from "graphql/queries";

import ProductDetails from "components/ProductDetails";
import ReviewsSection from "components/ReviewsSection";

import Head from "next/head";

import {useQuery, useMutation} from "@apollo/client";
import {useRouter} from "next/router";

function Product({id}) {
  //const router = useRouter();
  //const { id } = router.query;
  const {data, loading} = useQuery(getSingleProductInfo, {
    variables: {
      id: id,
    },
  });

  if (loading || !data) {
    return <div>Cargando...</div>;
  } else if (data && data.product) {
    return (
      <>
        <Head>
          <title>{data.product.name} - ChakraShop</title>
        </Head>
        <Grid templateColumns={{base: "100%", md: "0.5fr 3fr 1.5fr"}} gap={2} mt="1rem">
          <ProductDetails product={data.product} />
          <ReviewsSection product={data.product} />
        </Grid>
      </>
    );
  }
}

export default Product;
