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
        gutter={12}
        toastOptions={{
          duration: 2600,
          className: "!rounded-2xl !border !border-cyan-400/20 !bg-slate-950/90 !text-slate-100 !shadow-2xl",
          style: {
            border: "1px solid rgba(34, 211, 238, 0.2)",
            background: "rgba(2, 6, 23, 0.92)",
            color: "#e2e8f0",
            borderRadius: "16px",
            padding: "12px 14px",
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.35)",
          },
        }}
      />
    </SessionProvider>
  );
}
