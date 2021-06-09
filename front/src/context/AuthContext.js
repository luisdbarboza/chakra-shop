import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

let userObj = {
  loggedIn: false,
  name: "",
  email: "",
  profilePicture: "",
  cartItems: [],
};

const userReducer = (state, action) => {
  switch (action.type) {
    case "LOG_IN":
      const { email, name, profilePicture, cartItems } = action.user;
      const token = action.token;

      action.user.loggedIn = true;

      if (typeof window !== "undefined") {
        localStorage.setItem("chakra_shop_user", JSON.stringify(action.user));
        localStorage.setItem("chakra_shop_user_token", JSON.stringify(token));
      }

      return { loggedIn: true, name, email, profilePicture, cartItems };
    case "LOG_OUT":
      if (typeof window !== "undefined") {
        localStorage.removeItem("chakra_shop_user");
        localStorage.removeItem("chakra_shop_user_token");
      }

      return {
        loggedIn: false,
        name: "",
        email: "",
        profilePic: "",
        cartItems: [],
      };
    default:
      return state;
  }
};

const AuthContextProvider = ({ children }) => {
  const [user, dispatchUser] = useReducer(userReducer, userObj);

  useEffect(() => {
    let storedUser = localStorage.getItem("chakra_shop_user");

    console.log(storedUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, dispatchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
