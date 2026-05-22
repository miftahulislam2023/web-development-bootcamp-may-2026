"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/Button";

/**
 * Avoids hydration mismatch: `useTheme().resolvedTheme` differs between server
 * and first client paint. Render a stable placeholder until mounted.
 */
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = (theme === "system" ? resolvedTheme : theme) === "dark";

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-9 px-0"
        aria-label="Toggle theme"
        disabled
        tabIndex={-1}
      >
        <Moon className="size-4 opacity-0" aria-hidden />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="w-9 px-0"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
    </Button>
  );
}
