import React, { useContext, useCallback } from "react";
import {
  Drawer as ChakraUIDrawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { DrawerContext } from "../containers/NavigationBar";

const Drawer = React.memo(() => {
  const { drawerState, dispatchDrawerState } = useContext(DrawerContext);
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
        // finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>{/* <Input placeholder="Type here..." /> */}</DrawerBody>

          {/* <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter> */}
        </DrawerContent>
      </ChakraUIDrawer>
    </>
  );
});

export default Drawer;
