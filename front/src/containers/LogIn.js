import { useEffect, useContext } from "react";
import { Grid } from "@chakra-ui/react";
import Head from "next/head";

import LogInForm from "components/LogInForm";

function LogIn() {
  return (
    <>
      <Head>
        <title>Iniciar sesion</title>
      </Head>
      <Grid
        height="100%"
        templateColumns={{ base: "5% 90% 5%", md: "30% 40% 30%" }}
        m="auto"
        height="88vh"
      >
        <div />
        <LogInForm />
        <div />
      </Grid>
    </>
  );
}

export default LogIn;
