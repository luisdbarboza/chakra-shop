import { useEffect, useContext } from "react";
import { Grid } from "@chakra-ui/react";
import Head from "next/head";

import AddProductForm from "components/AddProductForm";

function AddProduct() {
  return (
    <>
      <Head>
        <title>Registrar producto</title>
      </Head>
      <Grid
        height="100%"
        templateColumns={{ base: "5% 90% 5%", md: "30% 40% 30%" }}
        m="auto"
        height="88vh"
      >
        <div />
        <AddProductForm />
        <div />
      </Grid>
    </>
  );
}

export default AddProduct;
