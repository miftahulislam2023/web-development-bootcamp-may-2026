import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import ThemeToggle from "../components/ThemeToggle/ThemeToggle";
import {
  LayoutDashboard,
  Film,
  Heart,
  PlusSquare,
  LogOut,
  Menu,
  X,
  User,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import Swal from "sweetalert2";
import useRole from "../hooks/useRole";
import { LazyLoadImage } from "react-lazy-load-image-component";

const DashboardLayout = () => {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();
  const { role, isLoading } = useRole();

  // State for Mobile Drawer & Desktop Collapse
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    Swal.fire({
      title: "Log out?",
      text: "Are you sure you want to sign out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Log out",
    }).then((result) => {
      if (result.isConfirmed) {
        signOutUser();
        navigate("/");
      }
    });
  };

  const isAdmin = role?.role === "admin";

  const navLinks = [
    { name: "Overview", path: "/dashboard", icon: LayoutDashboard, end: true },

    ...(isAdmin
      ? [
          { name: "Add Movie", path: "/dashboard/add-movie", icon: PlusSquare },
          { name: "My Movies", path: "/dashboard/my-movies", icon: Film },
        ]
      : []),
    { name: "Profile", path: "/dashboard/profile", icon: User },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-bars loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 flex relative overflow-hidden transition-colors duration-300 max-w-7xl mx-auto">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-125 h-125 bg-primary/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* ==================== 1. SIDEBAR (Desktop & Mobile) ==================== */}

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static top-0 h-screen bg-base-100/95 backdrop-blur-xl border-r border-base-content/5 z-50 
          transition-all duration-300 ease-in-out flex flex-col justify-between shadow-2xl lg:shadow-none
          ${
            isMobileOpen
              ? "translate-x-0 w-72"
              : "-translate-x-full lg:translate-x-0"
          }
          ${isCollapsed ? "lg:w-24" : "lg:w-72"}
        `}
      >
        <div>
          {/* Logo Header */}
          <div
            className={`flex items-center h-20 px-6 border-b border-base-content/5 ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            <NavLink to="/" className="group flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-primary text-white shadow-lg shadow-primary/40 transition-all duration-300 group-hover:scale-105 group-hover:shadow-primary/60">
                <div className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-white/20 blur-md"></div>
                <div className="absolute -bottom-2 -left-2 h-8 w-8 rounded-full bg-black/10 blur-md"></div>

                <Sparkles className="relative z-10 h-6 w-6 fill-white text-white transition-transform duration-500 group-hover:rotate-12" />

                <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              </div>

              {!isCollapsed && (
                <div className="transition-opacity duration-300">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-bold tracking-tight leading-none whitespace-nowrap text-base-content">
                      Movie <span className="text-primary">Master</span>
                    </span>

                    <span className="flex items-center justify-center rounded-md border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[0.6rem] font-black tracking-widest text-primary">
                      PRO
                    </span>
                  </div>
                  <span className="text-[0.65rem] font-medium tracking-wide text-base-content/50">
                    Pro Admin
                  </span>
                </div>
              )}
            </NavLink>

            {/* <div className="flex items-center gap-3 overflow-hidden">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-linear-to-br from-primary to-red-600 flex items-center justify-center text-white shadow-lg shadow-primary/30">
                <Film size={20} />
              </div>
              {!isCollapsed && (
                <div className="transition-opacity duration-300">
                  <h1 className="text-xl font-black tracking-tight leading-none whitespace-nowrap">
                    MovieMaster
                  </h1>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    Pro Admin
                  </p>
                </div>
              )}
            </div> */}
            {/* Mobile Close Button */}
            <button
              className="lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          {/* Nav Menu */}
          <nav className="p-4 space-y-2 mt-4 overflow-y-auto max-h-[calc(100vh-180px)]">
            {!isCollapsed && (
              <p className="px-4 text-xs font-bold text-base-content/40 uppercase tracking-widest mb-2">
                Main Menu
              </p>
            )}

            {navLinks.map((link) => (
              <SidebarItem
                key={link.name}
                link={link}
                isCollapsed={isCollapsed}
                onClick={() => setIsMobileOpen(false)}
              />
            ))}
          </nav>
        </div>

        {/* Sidebar Footer (Collapse Toggle) */}
        <div className="hidden lg:flex p-4 border-t border-base-content/5 justify-end">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg bg-base-200 hover:bg-base-300 text-base-content/60 hover:text-primary transition-all"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>
      </aside>

      {/* ==================== 2. MAIN AREA ==================== */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* --- Top Navbar --- */}
        <header className="h-20 sticky top-0 z-30 bg-base-100/80 backdrop-blur-xl border-b border-base-content/5 px-4 md:px-8 flex items-center justify-between">
          {/* Left: Mobile Toggle & Search */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-base-200"
            >
              <Menu size={24} />
            </button>

            {/* Global Search Bar */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full bg-base-200/50 border border-base-content/5 focus-within:border-primary/50 focus-within:bg-base-100 transition-all w-64 lg:w-96">
              <Search size={18} className="text-base-content/40" />
              <input
                type="text"
                placeholder="Search anything..."
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-base-content/40"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Notification Bell */}
            <button className="relative p-2 rounded-full hover:bg-base-200 text-base-content/60 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-base-100"></span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Vertical Divider */}
            <div className="h-8 w-px bg-base-content/10 hidden sm:block"></div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 focus:outline-none"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold leading-none">
                    {user?.displayName}
                  </p>
                  <p className="text-[10px] text-base-content/60">
                    Administrator
                  </p>
                </div>
                {/* <img
                  src={user?.photoURL || "https://i.ibb.co/5GzXkwq/user.png"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-base-content/10 object-cover hover:border-primary transition-all"
                /> */}
                <LazyLoadImage
                  src={user?.photoURL || "https://i.ibb.co/5GzXkwq/user.png"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-base-content/10 object-cover hover:border-primary transition-all"
                  effect="blur"
                />
                <ChevronDown
                  size={16}
                  className={`text-base-content/50 transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsProfileOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-4 w-56 bg-base-100 rounded-2xl shadow-2xl border border-base-content/5 z-20 py-2 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-base-content/5 sm:hidden">
                      <p className="text-sm font-bold">{user?.displayName}</p>
                      <p className="text-xs text-base-content/50">
                        {user?.email}
                      </p>
                    </div>
                    <NavLink
                      to="/dashboard/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-base-200 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User size={16} /> Profile Settings
                    </NavLink>
                    <button className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-base-200 transition-colors w-full text-left">
                      <Settings size={16} /> System Preferences
                    </button>
                    <div className="h-px bg-base-content/10 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left font-bold cursor-pointer"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* --- Content Body --- */}
        <div className="flex-1 p-4  overflow-y-auto h-[calc(100vh-80px)] scroll-smooth">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// --- Sub-Component: Sidebar Item ---
const SidebarItem = ({ link, isCollapsed, onClick }) => {
  return (
    <NavLink
      to={link.path}
      end={link.end}
      onClick={onClick}
      className={({ isActive }) => `
                group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium text-sm overflow-x-hidden
                ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "text-base-content/60 hover:bg-base-200 hover:text-base-content"
                }
                ${isCollapsed ? "justify-center" : ""}
            `}
    >
      <link.icon
        size={20}
        className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"} transition-all`}
      />

      {!isCollapsed && <span>{link.name}</span>}

      {/* Tooltip for Collapsed Mode */}
      {isCollapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 bg-base-300 text-base-content text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-50 pointer-events-none">
          {link.name}
          {/* Arrow */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-r-base-300"></div>
        </div>
      )}
    </NavLink>
  );
};

export default DashboardLayout;
