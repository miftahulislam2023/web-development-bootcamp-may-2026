"use client";

import { ThemeProvider } from "next-themes";

/**
 * next-themes: keep storage key stable; avoid coupling theme state to unrelated keys.
 */
export function ThemeRegistry({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="nexora-studio-theme"
    >
      {children}
    </ThemeProvider>
  );
}
