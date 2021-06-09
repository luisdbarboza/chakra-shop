import React from "react";
import { Box } from "@chakra-ui/react";
import NavigationBar from "../containers/NavigationBar";

const Layout = React.memo(({ children }) => {
  return (
    <>
      <header>
        <NavigationBar />
      </header>
      <main>
        <Box minH="88vh" pt="4.5rem">
          {children}
        </Box>
      </main>
    </>
  );
});

export default Layout;
