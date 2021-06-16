import { createContext, useReducer } from "react";
import { Box } from "@chakra-ui/react";
import Topbar from "../components/Topbar";
import Drawer from "../components/Drawer";

export const DrawerContext = createContext();

const drawerReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_DRAWER":
      return { isOpen: !state.isOpen };
    default:
      return state;
  }
};

const DrawerContextProvider = ({ children }) => {
  const [drawerState, dispatchDrawerState] = useReducer(drawerReducer, {
    isOpen: false,
  });

  return (
    <DrawerContext.Provider value={{ drawerState, dispatchDrawerState }}>
      {children}
    </DrawerContext.Provider>
  );
};

function NavigationBar() {
  return (
    <>
      <DrawerContextProvider>
        <Topbar />
        <Drawer />
      </DrawerContextProvider>
    </>
  );
}

export default NavigationBar;
