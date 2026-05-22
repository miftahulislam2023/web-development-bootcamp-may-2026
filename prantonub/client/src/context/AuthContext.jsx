import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sw_user")); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sw_token");
    if (!token) { setLoading(false); return; }
    api.get("/auth/me")
      .then(r => { setUser(r.data.user); localStorage.setItem("sw_user", JSON.stringify(r.data.user)); })
      .catch(() => { localStorage.removeItem("sw_token"); localStorage.removeItem("sw_user"); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("sw_token", token);
    localStorage.setItem("sw_user", JSON.stringify(userData));
    setUser(userData);
  };
  const logout = () => {
    localStorage.removeItem("sw_token");
    localStorage.removeItem("sw_user");
    setUser(null);
  };
  const updateUser = (data) => {
    const u = { ...user, ...data };
    localStorage.setItem("sw_user", JSON.stringify(u));
    setUser(u);
    // Sync dark mode
    if (data.theme) document.documentElement.classList.toggle("dark", data.theme === "dark");
  };

  // Apply theme on load
  useEffect(() => {
    if (user?.theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [user?.theme]);

  return <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth outside AuthProvider");
  return ctx;
};
