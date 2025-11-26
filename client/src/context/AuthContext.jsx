import { createContext, useState, useEffect } from "react";
import api from "../api/client";

// 1) Create the context object
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);


// 2) Provider component that wraps the app
export function AuthProvider({ children }) {
  // user: null or { id, name, email }
  const [user, setUser] = useState(null);

  // token: JWT string or empty
  const [token, setToken] = useState(() => {
    // Try to read token from localStorage on first load
    return localStorage.getItem("token") || "";
  });

  const [authLoading, setAuthLoading] = useState(false);

  // 3) When token changes, set or remove Authorization header on api
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  // 4) Login function
  async function login(email, password) {
    setAuthLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });

      const { user, token } = response.data;

      setUser(user);
      setToken(token);

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      let message = "Login failed";
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      return { success: false, message };
    } finally {
      setAuthLoading(false);
    }
  }

  // 5) Register function
  async function register(name, email, password) {
    setAuthLoading(true);
    try {
      const response = await api.post("/auth/register", { name, email, password });

      const { user, token } = response.data;

      setUser(user);
      setToken(token);

      return { success: true };
    } catch (error) {
      console.error("Register error:", error);
      let message = "Registration failed";
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      return { success: false, message };
    } finally {
      setAuthLoading(false);
    }
  }

  // 6) Logout function
  function logout() {
    setUser(null);
    setToken("");
  }

  const value = {
    user,
    token,
    authLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
