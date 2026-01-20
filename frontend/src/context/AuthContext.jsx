import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // LOGIN
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    setUser(res.data); // backend returns user directly
  };

  // REGISTER
  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    setUser(res.data);
  };

  // LOGOUT
  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  // LOAD USER FROM COOKIE
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // 🔑 THIS LINE IS THE FIX
  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


