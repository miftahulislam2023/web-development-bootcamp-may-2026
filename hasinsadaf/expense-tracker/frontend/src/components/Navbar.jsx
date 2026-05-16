"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DashboardIcon,
  TableIcon,
  ExitIcon,
  PersonIcon,
  LightningBoltIcon,
  TargetIcon,
  ChevronDownIcon,
} from "@radix-ui/react-icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { clearToken, getProfile } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar({ onProfileClick }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    fetchUser();
  }, []);

  const isActive = (href) => pathname === href;

  const handleLogout = () => {
    clearToken();
    router.push("/login");
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const initials = user?.name ? user.name[0].toUpperCase() : "?";
  const displayName = user?.name || "Your account";
  const displayEmail = user?.email || "Manage profile";

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <LightningBoltIcon width={18} height={18} />
        </div>
        <div>
          <div className="brand-title">FinanceFlow</div>
          <div className="brand-subtitle">Personal finance</div>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        <div className="sidebar-section-label">Menu</div>
        <Link
          href="/dashboard"
          className={`sidebar-link ${isActive("/dashboard") ? "active" : ""}`}
          aria-current={isActive("/dashboard") ? "page" : undefined}
        >
          <DashboardIcon width={18} height={18} />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/expenses"
          className={`sidebar-link ${isActive("/expenses") ? "active" : ""}`}
          aria-current={isActive("/expenses") ? "page" : undefined}
        >
          <TableIcon width={18} height={18} />
          <span>Expenses</span>
        </Link>
        <Link
          href="/budget"
          className={`sidebar-link ${isActive("/budget") ? "active" : ""}`}
          aria-current={isActive("/budget") ? "page" : undefined}
        >
          <TargetIcon width={18} height={18} />
          <span>Budget</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-row">
          <span className="sidebar-section-label">Theme</span>
          <ThemeToggle />
        </div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className="sidebar-user"
              aria-label="Open user menu"
            >
              <span className="sidebar-avatar">{initials}</span>
              <span className="sidebar-user-text">
                <span className="sidebar-user-name">{displayName}</span>
                <span className="sidebar-user-email">{displayEmail}</span>
              </span>
              <ChevronDownIcon className="sidebar-user-caret" width={16} height={16} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="sidebar-menu"
              align="end"
            >
              <DropdownMenu.Item
                onClick={handleProfileClick}
                className="sidebar-menu-item"
              >
                <PersonIcon width={16} height={16} />
                <span>My Profile</span>
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="sidebar-menu-separator" />
              <DropdownMenu.Item
                onClick={handleLogout}
                className="sidebar-menu-item danger"
              >
                <ExitIcon width={16} height={16} />
                <span>Logout</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </aside>
  );
}
