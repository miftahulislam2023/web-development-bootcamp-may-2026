"use client";

import { Toaster } from "@socialIO/ui/components/sonner";

import { QueryProvider } from "./providers/query-provider";
import { AuthProvider } from "./providers/auth-provider";
import { WSProvider } from "./providers/ws-provider";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <WSProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </WSProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
