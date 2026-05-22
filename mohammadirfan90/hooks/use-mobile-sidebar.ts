"use client";

import { useState, useCallback, useEffect } from "react";

/**
 * Hook to manage mobile sidebar open/close state.
 * Automatically closes the sidebar when the viewport exceeds the
 * mobile breakpoint (768px).
 */
export function useMobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");

    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsOpen(false);
    };

    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return { isOpen, open, close, toggle };
}
