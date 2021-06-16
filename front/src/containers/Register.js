import Head from "next/head";
import { Grid } from "@chakra-ui/react";
import SignUpForm from "components/SignUpForm";

function Register() {
  return (
    <>
      <Head>
        <title>Registrate</title>
      </Head>
      <Grid
        height="100%"
        templateColumns={{ base: "5% 90% 5%", md: "30% 40% 30%" }}
        m="auto"
        height="88vh"
      >
        <div />
        <SignUpForm />
        <div />
      </Grid>
    </>
  );
}

export default Register;
