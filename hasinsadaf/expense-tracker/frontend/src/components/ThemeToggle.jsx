"use client";

import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { getTheme, toggleTheme } from "@/lib/theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setTheme(getTheme());
  }, []);

  function handleToggle() {
    const next = toggleTheme();
    setTheme(next);
  }

  return (
    <button
      onClick={handleToggle}
      className="btn btn-ghost icon-btn"
      aria-label="Toggle theme"
    >
      {theme === "dark"
        ? <SunIcon width={18} height={18} />
        : <MoonIcon width={18} height={18} />
      }
    </button>
  );
}
