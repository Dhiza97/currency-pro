import { createContext, useState, useCallback, useRef, useEffect } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const accessTokenRef = useRef(null);

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
      const { data } = await API.post(
        "/auth/refresh",
        {},
        {
          withCredentials: true,
        },
      );
      accessTokenRef.current = data.accessToken;
      return data.accessToken;
    } catch {
      accessTokenRef.current = null;
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const rehydrate = async () => {
      try {
        const { data: refreshData } = await API.post(
          "/auth/refresh",
          {},
          {
            withCredentials: true, // 👈 add this
          },
        );
        accessTokenRef.current = refreshData.accessToken;

        const { data: profileData } = await API.get("/auth/profile", {
          headers: { Authorization: `Bearer ${refreshData.accessToken}` },
        });

        setUser(profileData.user);
      } catch {
        accessTokenRef.current = null;
        setUser(null);
      } finally {
        setAuthReady(true);
      }
    };

    rehydrate();
  }, []);

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0f]">
        <p className="text-gray-500 animate-pulse tracking-widest text-sm">
          LOADING...
        </p>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, getAccessToken, refreshAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
