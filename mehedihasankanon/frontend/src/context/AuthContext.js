/**
 * AuthContext
 *
 * used for setting up authentication state globally.
 *
 */

"use client";

// create context and use context -> used for global state management
// usestate and useeffect -> used for managing state and side effects
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// router
import { useRouter, useSearchParams } from "next/navigation";

// api call for auth
import api from "@/lib/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // global loading state -> prevents rendering auth page before checking token
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const getSafeNextPath = () => {
    const nextParam = searchParams.get("next");
    if (!nextParam) return null;

    if (nextParam.startsWith("/") && !nextParam.startsWith("//")) {
      return nextParam;
    }

    return null;
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      api
        .get("/auth/profile")
        .then((res) => {
          setUser(res.data?.user ?? null);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
          setupDevBundler(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem("token", res.data.token);

    const nextPath = getSafeNextPath();
    if (nextPath) {
      router.replace(nextPath);
    } else {
      router.push("/dashboard");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/");
  };

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem("token", res.data.token);

    const nextPath = getSafeNextPath();
    if (nextPath) {
      router.replace(nextPath);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// use context hook
// this lets components access auth state and functions
export function useAuth() {
  return useContext(AuthContext);
}
