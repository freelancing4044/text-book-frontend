import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  // base API url (change if your server runs elsewhere)
  // const url = import.meta.env.VITE_BACKEND_URL || "https://text-book-backend.vercel.app/"
  const url =  "https://text-book-backend.onrender.com";

  // load saved auth from localStorage
  const [token, setTokenState] = useState(localStorage.getItem("token") || "");
  const [user, setUserState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  // keep axios default header in sync
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // set auth (token + optional user)
  const setAuth = (newToken, newUser = null) => {
    setTokenState(newToken || "");
    if (newUser) setUserState(newUser);
  };

  // clear auth (logout)
  const clearAuth = () => {
    setTokenState("");
    setUserState(null);
  };

  const contextValue = {
    url,
    token,
    user,
    setAuth,
    clearAuth,
  };

  return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>;
};

export default StoreContextProvider;
