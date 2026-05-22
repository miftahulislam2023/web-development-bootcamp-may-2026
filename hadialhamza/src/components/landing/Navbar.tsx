"use client";

import { useState } from "react";
import { Menu, LogIn } from "lucide-react";
import { useSession } from "next-auth/react";
import Logo from "@/components/ui/Logo";
import NavLink from "@/components/ui/NavLink";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import MobileMenu from "./MobileMenu";
import Link from "next/link";
import UserDropdown from "@/components/ui/UserDropdown";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Analytics", href: "/analytics" },
  { label: "About Us", href: "/about-us" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isLoggedIn = status === "authenticated";

  const dynamicNavItems = isLoggedIn
    ? [...NAV_ITEMS, { label: "Dashboard", href: "/dashboard" }]
    : NAV_ITEMS;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-4 py-2 transition-all duration-300 bg-background/70 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Logo className="transition-transform duration-300 hover:scale-[1.02]" />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-10">
            {dynamicNavItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                className="text-[15px] tracking-tight font-semibold"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />

            {isLoggedIn ? (
              <UserDropdown
                user={{
                  name: session.user?.name || "User",
                  email: session.user?.email || "",
                  role:
                    session.user?.role === "admin"
                      ? "Administrator"
                      : "Free Plan",
                  image: session.user?.image || undefined,
                }}
              />
            ) : (
              <Link href="/login">
                <Button
                  variant="primary"
                  className="px-8"
                  icon={<LogIn className="w-4 h-4" />}
                >
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="icon"
            className="lg:hidden h-10 w-10"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={dynamicNavItems}
      />
    </>
  );
}
