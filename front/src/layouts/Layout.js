import { Box } from "@chakra-ui/react";
import NavigationBar from "../containers/NavigationBar";

const Layout = ({ children }) => {
  return (
    <>
      <header>
        <NavigationBar />
      </header>
      <main>
        <Box minH="88vh">{children}</Box>
      </main>
    </>
  );
};

export default Layout;
