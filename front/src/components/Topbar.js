import React, { useContext, useState } from "react";
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,
} from "@chakra-ui/react";
import { DrawerContext } from "../containers/NavigationBar";
import { AuthContext } from "../context/AuthContext";
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
  const [search, setSearch] = useState("");
  const handleChange = (event) => setSearch(event.target.value);

  return (
    <Center>
      <HStack>
        <InputGroup>
          <Input
            color="black"
            bg="white"
            value={search}
            onChange={handleChange}
          />
          <Link
            href={search.length > 0 ? `/search?search=${search}` : "/search"}
          >
            <InputRightElement w="3rem" children={<SearchButton />} />
          </Link>
        </InputGroup>
      </HStack>
    </Center>
  );
};

const UserOptions = () => {
  const { user, dispatchUser } = useContext(AuthContext);

  return (
    <Center>
      <Box color="white" _hover={{ cursor: "pointer" }}>
        {!user.loggedIn ? (
          <Link href="/login">
            <a>Iniciar Sesion</a>
          </Link>
        ) : (
          <Menu>
            <MenuButton>{user.name}</MenuButton>
            <MenuList bg="#131921">
              <MenuItem _hover={{ backgroundColor: "skyblue", color: "black" }}>
                <Link href={`/cart/${user.id}`}>Mi carrito</Link>
              </MenuItem>
              <MenuItem _hover={{ backgroundColor: "skyblue", color: "black" }}>
                <Link href={`/addProduct`}>Registrar producto</Link>
              </MenuItem>
              <MenuItem _hover={{ backgroundColor: "skyblue", color: "black" }}>
                <Link href={`/orderHistory`}>Historial de pedidos</Link>
              </MenuItem>
              <MenuItem _hover={{ backgroundColor: "skyblue", color: "black" }}>
                <Link href={`/userPosts/${user.id}`}>Mis publicaciones</Link>
              </MenuItem>
              <MenuItem _hover={{ backgroundColor: "skyblue", color: "black" }}>
                Perfil
              </MenuItem>
              <MenuItem
                _hover={{ backgroundColor: "skyblue", color: "black" }}
                onClick={() => {
                  dispatchUser({ type: "LOG_OUT" });
                }}
              >
                Salir
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </Box>
    </Center>
  );
};

const Topbar = React.memo(() => {
  return (
    <Box
      bg="#131921"
      w="100%"
      p={4}
      position="fixed"
      zIndex="100"
      color="white"
    >
      <Flex justify="space-between" wrap="wrap">
        <MenuButtonAndLogo />
        <SearchBar />
        <UserOptions />
      </Flex>
    </Box>
  );
});

export default Topbar;
