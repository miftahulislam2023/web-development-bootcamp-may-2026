"use client";

import { Link } from "@heroui/react";
import { usePathname } from "next/navigation";

import { ROUTES } from "@/lib/routes";

const navItems = [
  { label: "Home", href: ROUTES.home },
  { label: "Features", href: ROUTES.features },
  { label: "Chat", href: ROUTES.chat },
  { label: "Security", href: "#" },
  { label: "Download", href: "#" },
] as const;

const navLinkClass = (active: boolean) =>
  [
    "rounded-md px-2 py-1 text-sm no-underline outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
    active ? "font-bold text-primary" : "font-medium text-secondary hover:text-primary",
  ].join(" ");

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-outline-variant bg-surface/95 px-gutter py-4 backdrop-blur-sm">
      <Link
        href={ROUTES.home}
        className="group flex items-center gap-4 rounded-lg no-underline outline-none transition-[opacity,transform] hover:opacity-90 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        <span className="material-symbols-outlined text-primary transition-transform duration-200 group-hover:scale-105" style={{ fontSize: 32 }}>
          forum
        </span>
        <span className="text-2xl font-bold text-primary">Crimson Connect</span>
      </Link>
      <nav className="hidden items-center gap-2 md:flex">
        {navItems.map((item) => {
          const isActive =
            item.href !== "#" &&
            (item.href === ROUTES.chat ? pathname.startsWith(ROUTES.chat) : pathname === item.href);
          return (
            <Link key={item.label} href={item.href} className={navLinkClass(isActive)}>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <Link
        href={ROUTES.chat}
        className="inline-flex items-center justify-center rounded-lg border-0 bg-primary px-6 py-2.5 text-sm font-bold text-on-primary no-underline shadow-md shadow-primary/35 outline-none transition-[transform,colors,box-shadow] hover:bg-[#8f0010] hover:shadow-lg active:scale-[0.97] motion-reduce:active:scale-100 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        Get Started
      </Link>
    </header>
  );
}
