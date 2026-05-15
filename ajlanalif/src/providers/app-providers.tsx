"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            border: "1px solid #e5e7eb",
            background: "#ffffff",
            color: "#111827",
          },
        }}
      />
    </SessionProvider>
  );
}
