"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { ThemeRegistry } from "@/components/providers/ThemeRegistry";

const AUTH_BASE_PATH = "/api/auth";

/**
 * Root client providers. SessionProvider uses an explicit basePath so the client
 * always hits `/api/auth/*` even when NEXTAUTH_URL was omitted at build time.
 */
export function AppProviders({ children }) {
  return (
    <SessionProvider
      basePath={AUTH_BASE_PATH}
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
    >
      <ThemeRegistry>
        <StoreProvider>{children}</StoreProvider>
        <Toaster richColors position="top-center" />
      </ThemeRegistry>
    </SessionProvider>
  );
}
