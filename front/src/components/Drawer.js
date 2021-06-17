import React, { useContext, useCallback } from "react";
import {
  Drawer as ChakraUIDrawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Heading,
  Text,
  Box,
  IconButton,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { DrawerContext } from "../containers/NavigationBar";
import { AuthContext } from "../context/AuthContext";
import { RiArrowRightSLine } from "react-icons/ri";
import { getAllCategories } from "../graphql/queries";

const Drawer = React.memo(() => {
  const { data, loading, error } = useQuery(getAllCategories);
  const { drawerState, dispatchDrawerState } = useContext(DrawerContext);
  const { user } = useContext(AuthContext);
  const { isOpen } = drawerState;

  const onClose = useCallback(() => {
    dispatchDrawerState({ type: "TOGGLE_DRAWER" });
  }, []);

  return (
    <>
      <ChakraUIDrawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        zIndex="200"
        // finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {user.loggedIn ? "Hola " + user.name : "Hola Usuario"}
          </DrawerHeader>

          <DrawerBody>
            {loading || !data || !data.categories ? (
              <Text>Cargando...</Text>
            ) : (
              <>
                {data.categories.map((category, index) => {
                  return (
                    <Box mb="1rem" key={index}>
                          <Flex align="center">
                            <Box
                              _hover={{
                                color: "blue",
                                textDecoration: "underline",
                              }}
                            >
                              {category.name}
                            </Box>
                            <Spacer />
                            <IconButton
                              isRound
                              aria-label={`See all products from ${category.name} category`}
                              icon={<RiArrowRightSLine />}
                            />
                          </Flex>
                    </Box>
                  );
                })}
              </>
            )}
          </DrawerBody>
        </DrawerContent>
      </ChakraUIDrawer>
    </>
  );
});

export default Drawer;
