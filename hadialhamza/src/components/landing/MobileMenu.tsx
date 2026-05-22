"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, LogIn, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import NavLink from "@/components/ui/NavLink";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { customToast } from "@/components/ui/customToast";
import Logo from "@/components/ui/Logo";
import Link from "next/link";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: { label: string; href: string }[];
}

export default function MobileMenu({
  isOpen,
  onClose,
  navItems,
}: MobileMenuProps) {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  const handleLogout = () => {
    onClose();
    customToast.confirm(
      "Sign Out",
      "Are you sure you want to log out of your account?",
      () => {
        customToast.success(
          "Signed Out",
          "You have been successfully logged out.",
        );
        signOut({ callbackUrl: "/" });
      },
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
          />

          {/* Slide-in panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-72 bg-card border-l border-border p-6 shadow-2xl lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between mb-10">
                <Link
                  href="/"
                  className="scale-90 origin-left"
                  onClick={onClose}
                >
                  <Logo />
                </Link>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <Button
                    variant="icon"
                    onClick={onClose}
                    className="h-10 w-10"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex flex-col gap-2 mb-8">
                {navItems.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="text-base py-3 border-b border-border/50 last:border-0"
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              {/* Actions */}
              <div className="mt-auto flex flex-col gap-3">
                {isLoggedIn ? (
                  <Button
                    variant="outline"
                    className="w-full text-rose-500 border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-600"
                    icon={<LogOut className="w-4 h-4" />}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                ) : (
                  <Link href="/login" onClick={onClose}>
                    <Button
                      variant="primary"
                      className="w-full"
                      icon={<LogIn className="w-4 h-4" />}
                    >
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
