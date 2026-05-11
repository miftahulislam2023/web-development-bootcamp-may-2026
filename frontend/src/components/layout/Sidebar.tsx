// src/components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuthStore();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Transactions", href: "/transactions", icon: Wallet },
    { label: "Budgets", href: "/budgets", icon: PieChart },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-border bg-background h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">FinanceApp</h1>
        <p className="text-sm text-muted-foreground">
          Personal Finance Dashboard
        </p>
      </div>

      <nav className="px-4 py-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
        <button
          onClick={async () => {
            await logout();
            window.location.href = "/auth/login";
          }}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted transition"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
