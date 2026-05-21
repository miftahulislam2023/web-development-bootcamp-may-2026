"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("chat_token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        // Only trust a proper JSON 200 response
        if (!r.ok) return null;
        return r.json().catch(() => null);
      })
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        } else if (data !== null) {
          // Server responded but no user — token is invalid
          localStorage.removeItem("chat_token");
        }
        // If data is null (server error/crash), keep the token and stay logged in
      })
      .catch(() => {
        // Network error — don't log out, just continue
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    localStorage.setItem("chat_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const signup = async (name, username, email, password) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Signup failed");
    localStorage.setItem("chat_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    const token = localStorage.getItem("chat_token");
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
    localStorage.removeItem("chat_token");
    setUser(null);
    router.push("/login");
  };

  const updateUser = (data) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
