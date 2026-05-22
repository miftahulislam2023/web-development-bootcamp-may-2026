"use client";

import { useEffect } from "react";

import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/stores/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      setSession(data);
    });

    const onFocus = () => {
      authClient.getSession().then(({ data }) => {
        setSession(data);
      });
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [setSession]);

  return <>{children}</>;
}
