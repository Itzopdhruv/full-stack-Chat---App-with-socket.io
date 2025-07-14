import React, { createContext, useContext, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../features/userSlice.js";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const initialUserState = localStorage.getItem("ChatApp");
   
  // parse the user data and storing in state.
  const [authUser, setAuthUser] = useState(
    initialUserState ? JSON.parse(initialUserState) : undefined
  );

  // Sync with Redux store
  useEffect(() => {
    if (authUser) {
      dispatch(setUser(authUser.user));
    } else {
      dispatch(clearUser());
    }
  }, [authUser, dispatch]);

  // On mount, check if user is still authenticated with backend
  useEffect(() => {
    if (authUser) {
      fetch("/api/user/me", {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Not authenticated");
          // No need to use the data
        })
        .catch(() => {
          // If not authenticated, clear localStorage and state
          localStorage.removeItem("ChatApp");
          setAuthUser(undefined);
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={[authUser, setAuthUser]}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);