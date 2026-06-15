import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (formData) => {
    const res = await api.post("/auth/register", formData);
    setUser(res.data.user);
    toast.success(res.data.message || "Account created successfully");
    return res.data;
  };

  const login = async (formData) => {
    const res = await api.post("/auth/login", formData);
    setUser(res.data.user);
    toast.success(res.data.message || "Login successful");
    return res.data;
  };

  const logout = async () => {
    const res = await api.post("/auth/logout");
    setUser(null);
    toast.success(res.data.message || "Logged out successfully");
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};