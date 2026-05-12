"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  Tags,
  Sprout,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuthStore();

  const items = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/transactions", label: "Transactions", icon: Wallet },
    { href: "/dashboard/budgets", label: "Budgets", icon: PieChart },
    { href: "/dashboard/categories", label: "Categories", icon: Tags },
    { href: "/dashboard/savings", label: "Savings Goals", icon: Sprout },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-background sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">FinanceApp</h1>
        <p className="text-sm text-muted-foreground">
          Personal Finance Dashboard
        </p>
      </div>
      <nav className="flex-1 space-y-2 px-4">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                "flex items-center gap-3 rounded-lg px-4 py-2 transition " +
                (active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted")
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4">
        <button
          onClick={async () => {
            await logout();
            window.location.href = "/auth/login";
          }}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-muted-foreground hover:bg-muted"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
