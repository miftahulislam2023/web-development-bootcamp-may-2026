"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { signOut } from "next-auth/react";
import { customToast } from "./customToast";
import {
  User,
  ArrowLeftRight,
  PieChart,
  BarChart3,
  Target,
  LogOut,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserDropdownProps {
  user: {
    name: string;
    email: string;
    image?: string;
    role: string;
  };
  className?: string;
}

export default function UserDropdown({ user, className }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Transactions", href: "/dashboard/transactions", icon: ArrowLeftRight },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { label: "Budgets", href: "/dashboard/budgets", icon: PieChart },
    { label: "Goals", href: "/dashboard/goals", icon: Target },
    { label: "Profile", href: "/dashboard/profile", icon: User },
  ];

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-muted/50 border border-transparent hover:border-border transition-all duration-300 group"
      >
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 overflow-hidden group-hover:scale-105 transition-transform duration-300">
          {user.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-5 h-5" />
          )}
        </div>
        <div className="hidden sm:flex flex-col items-start leading-none gap-1 mr-1">
          <span className="text-sm font-black text-foreground">
            {user.name}
          </span>
          <span className="text-[10px] text-primary font-black uppercase tracking-widest">
            {user.role}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-300",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute right-0 mt-3 w-64 bg-card border border-border rounded-3xl shadow-sm overflow-hidden z-100"
          >
            <div className="p-5 border-b border-border bg-muted/20">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 overflow-hidden">
                  {user.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6" />
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-base font-black text-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-2">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 group"
                >
                  <item.icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="p-2 border-t border-border bg-muted/10">
              <button
                onClick={() => {
                  setIsOpen(false);
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
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-all duration-200 group"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
