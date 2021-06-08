import React, { useContext } from "react";
import Link from "next/link";
import {
  Box,
  Flex,
  HStack,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Center,
} from "@chakra-ui/react";
import { DrawerContext } from "../containers/NavigationBar";
import { AiOutlineMenu, AiOutlineSearch } from "react-icons/ai";

const MenuButtonAndLogo = () => {
  const { dispatchDrawerState } = useContext(DrawerContext);

  return (
    <Center>
      <Box>
        <HStack>
          <Button
            colorScheme="#131921"
            onClick={() => dispatchDrawerState({ type: "TOGGLE_DRAWER" })}
          >
            <AiOutlineMenu style={{ color: "white", fontSize: "2rem" }} />
          </Button>
          <Box p="0.5rem" fontSize={{ base: "1rem", md: "1.2rem" }}>
            <Link href="/">
              <a>ChakraShop</a>
            </Link>
          </Box>
        </HStack>
      </Box>
    </Center>
  );
};

const SearchButton = () => {
  return (
    <Button bg="#F0C040">
      <AiOutlineSearch style={{ color: "black", fontSize: "10rem" }} />
    </Button>
  );
};

const SearchBar = () => {
  return (
    <Center>
      <HStack>
        <InputGroup>
          <Input bg="white" />
          <Link href="/search/termino">
            <a>
              <InputRightElement w="3rem" children={<SearchButton />} />
            </a>
          </Link>
        </InputGroup>
      </HStack>
    </Center>
  );
};

const UserOptions = () => {
  return (
    <Center>
      <Box color="white" _hover={{ color: "orange", cursor: "pointer" }}>
        <Link href="/login">
          <a>Iniciar Sesion</a>
        </Link>
      </Box>
    </Center>
  );
};

const Topbar = React.memo(() => {
  return (
    <Box bg="#131921" w="100%" p={4} height="12vh" color="white">
      <Flex justify="space-between" wrap="wrap">
        <MenuButtonAndLogo />
        <SearchBar />
        <UserOptions />
      </Flex>
    </Box>
  );
});

export default Topbar;
