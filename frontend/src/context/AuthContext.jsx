import { createContext, useState, useCallback, useRef } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const accessTokenRef    = useRef(null);

  const login = (data) => {
    accessTokenRef.current = data.accessToken;
    setUser(data.user);
  };

  const logout = async () => {
    await API.post("/auth/logout").catch(() => {});
    accessTokenRef.current = null;
    setUser(null);
  };

  const getAccessToken = () => accessTokenRef.current;

  // Called by axios interceptor when 401 is received
  const refreshAccessToken = useCallback(async () => {
    try {
      const { data } = await API.post("/auth/refresh"); // cookie sent automatically
      accessTokenRef.current = data.accessToken;
      return data.accessToken;
    } catch {
      accessTokenRef.current = null;
      setUser(null);
      return null;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, getAccessToken, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};