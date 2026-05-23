"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import { useAuthStore } from "@/lib/store";

export default function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const {
    fetchUser,
    isAuthenticated,
  } = useAuthStore();

  const [initialized, setInitialized] =
    useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await fetchUser();
      } catch (err) {
        console.error(err);
      } finally {
        setInitialized(true);
      }
    };

    void init();
  }, [fetchUser]);

  useEffect(() => {
    if (!initialized) return;

    const isAuthRoute =
      pathname?.startsWith("/auth");

    const isProtectedRoute =
      pathname?.startsWith(
        "/dashboard"
      );

    if (
      isAuthenticated &&
      isAuthRoute
    ) {
      router.replace(
        "/dashboard"
      );
    }

    if (
      !isAuthenticated &&
      isProtectedRoute
    ) {
      router.replace(
        "/auth/login"
      );
    }
  }, [
    initialized,
    pathname,
    isAuthenticated,
    router,
  ]);

  // ONLY APP START
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return children;
}