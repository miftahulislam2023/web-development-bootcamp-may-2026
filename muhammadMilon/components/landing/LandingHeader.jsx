"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

import { Logo } from "@/components/common/Logo";

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Templates", href: "/templates" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
];

const ADMIN_EMAIL = "admin@nexora-studio.com";

export function LandingHeader({ session }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl shadow-lg shadow-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Logo size="md" />

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            >
              {link.label}
            </Link>
          ))}
          {session?.user?.email === ADMIN_EMAIL && (
            <Link
              href="/admin"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-violet-500 transition-colors hover:bg-violet-500/10"
            >
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session?.user ? (
            <Button size="sm" href="/dashboard">
              Dashboard →
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" href="/login" className="hidden sm:inline-flex">
                Sign in
              </Button>
              <Button size="sm" href="/register">
                Start for free
              </Button>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2">
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            ) : (
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2">
                <path d="M2 4h12M2 8h12M2 12h12" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--background)]/95 px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              >
                {link.label}
              </Link>
            ))}
            {session?.user?.email === ADMIN_EMAIL && (
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-violet-500 transition-colors hover:bg-violet-500/10"
              >
                Admin Panel
              </Link>
            )}
            <div className="mt-3 flex gap-2 border-t border-[var(--border)] pt-3">
              <Button variant="outline" size="sm" href="/login" className="flex-1">Sign in</Button>
              <Button size="sm" href="/register" className="flex-1">Get started</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
