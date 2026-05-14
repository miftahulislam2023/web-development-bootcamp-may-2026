import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import NotificationBell from "./NotificationBell";

const NAV = [
  { to: "/", label: "Dashboard", icon: "📊", exact: true },
  { to: "/transactions", label: "Transactions", icon: "💳" },
  { to: "/budgets", label: "Budgets", icon: "🎯" },
  { to: "/recurring", label: "Recurring", icon: "🔄" },
  { to: "/analytics", label: "Analytics", icon: "📈" },
  { to: "/notifications", label: "Notifications", icon: "🔔" },
  { to: "/export", label: "Export & Reports", icon: "📄" },
  { to: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Layout() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleTheme = async () => {
    const newTheme = user?.theme === "dark" ? "light" : "dark";
    updateUser({ theme: newTheme });
    try {
      await api.put("/user/profile", { theme: newTheme });
    } catch {}
  };

  const NavItem = ({ to, label, icon, exact }) => (
    <NavLink
      to={to}
      end={exact}
      onClick={() => setSidebarOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
        }`
      }
    >
      <span className="text-lg w-6 text-center">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <img src="/favicon.png" alt="FinanceHub" className="w-6 h-6" />
          </div>

          <div>
            <span className="text-black font-bold text-xl block">
              FinanceHub
            </span>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Expense Tracker
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      {/* User + controls */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-all duration-200"
        >
          <span className="text-lg w-6 text-center">
            {user?.theme === "dark" ? "☀️" : "🌙"}
          </span>
          <span className="hidden sm:inline">
            {user?.theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </button>

        {/* User info */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
            {user?.avatar ? (
              <img
                src={user.avatar}
                className="w-full h-full rounded-full object-cover"
                alt=""
              />
            ) : (
              user?.name?.charAt(0)?.toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0 hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {user?.name?.split(" ")[0]}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-95 transition-all duration-200"
        >
          <span className="text-lg w-6 text-center">🚪</span>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 flex-shrink-0 border-r border-gray-100 dark:border-gray-800">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden animate-fade-in"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden animate-slide-in">
            <Sidebar />
          </div>
        </>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex-shrink-0 shadow-subtle">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-all text-gray-700 dark:text-gray-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
              S
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-sm">
              FH
            </span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <NotificationBell />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-all text-lg"
            >
              {user?.theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
