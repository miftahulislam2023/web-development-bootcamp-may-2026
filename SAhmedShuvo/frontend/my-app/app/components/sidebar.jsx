"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowDownCircle,
  ArrowUpCircle,
  CreditCard,
  List,
  LogOut,
  Menu,
  X,
  BarChart2,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Add Expense",
    href: "/add-expense",
    icon: ArrowDownCircle,
    accent: "expense",
  },
  {
    label: "Add Income",
    href: "/add-income",
    icon: ArrowUpCircle,
    accent: "income",
  },
  { label: "Accounts", href: "/account", icon: CreditCard },
  { label: "Monthly Report", href: "/monthly-report", icon: BarChart2 },
  ,
  {
    label: "Recent Transactions",
    href: "/transactions",
    icon: List,
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const close = () => setIsOpen(false);

  return (
    <>
      {/* Overlay — mobile only */}
      {isOpen && (
        <div
          onClick={close}
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px] md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:sticky top-[60px] left-0 z-40
          h-[calc(100vh-60px)] w-[270px] flex-shrink-0
          bg-white border-r border-slate-200
          flex flex-col py-5
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Floating hamburger tab — mobile only, peeks outside sidebar */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle sidebar"
          className="
            md:hidden
            absolute -right-10 top-3
            w-9 h-9 flex items-center justify-center
            bg-white border border-slate-200
            rounded-r-xl shadow-sm
            text-slate-500 hover:bg-slate-50
            transition-colors
          "
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Nav items */}
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={`
                  relative flex items-center gap-3
                  rounded-2xl px-4 py-3 text-[15px]
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600 font-medium"
                      : "text-slate-500"
                  }
                  ${
                    !isActive && !item.accent
                      ? "hover:bg-slate-50 hover:text-slate-800"
                      : ""
                  }
                  ${
                    !isActive && item.accent === "expense"
                      ? "hover:bg-rose-50 hover:text-rose-500"
                      : ""
                  }
                  ${
                    !isActive && item.accent === "income"
                      ? "hover:bg-emerald-50 hover:text-emerald-500"
                      : ""
                  }
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-[18%] h-[64%] w-[3px] rounded-r-full bg-indigo-500" />
                )}
                <Icon size={20} className="flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-500">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-5 my-3 h-px bg-slate-100" />

        {/* Logout */}
        <div className="px-3">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-[15px] text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500"
          >
            <LogOut size={20} className="flex-shrink-0" />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
