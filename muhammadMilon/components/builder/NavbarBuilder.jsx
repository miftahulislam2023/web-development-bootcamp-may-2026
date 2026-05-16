"use client";

import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { Editable } from "@/components/builder/Editable";
import { parseMenuItems } from "@/lib/parse-menu";

function buildMenuFromProps(props) {
  if (props.menuItems) return parseMenuItems(props.menuItems);
  const links = String(props.links || "Home,About,Contact")
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean);
  return links.map((label) => ({ label, href: "#", children: [] }));
}

export function NavbarBuilder({ section, isEditor }) {
  const { props, id } = section;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const menuItems = buildMenuFromProps(props);
  const logo = props.logoUrl;

  return (
    <header
      className={cn(
        "relative flex items-center justify-between gap-4 py-3",
        props.sticky && "sticky top-0 z-50 border-b border-white/10 bg-[var(--background)]/80 backdrop-blur-lg",
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        {logo ? (
          <img src={logo} alt={props.logoAlt || props.brand || "Logo"} className="h-9 w-auto object-contain" />
        ) : null}
        <Editable
          sectionId={id}
          propName="brand"
          value={props.brand}
          isEditor={isEditor}
          className="text-lg font-black font-display truncate"
        />
      </div>

      <nav className="hidden lg:flex items-center gap-6">
        {menuItems.map((item, i) =>
          item.children?.length > 0 ? (
            <div key={i} className="relative">
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-semibold hover:opacity-70"
                onClick={() => setOpenDropdown(openDropdown === i ? null : i)}
              >
                {item.label}
                <ChevronDown className="size-4" />
              </button>
              {openDropdown === i ? (
                <div className="absolute top-full left-0 mt-2 min-w-[160px] rounded-xl border border-white/10 bg-[var(--card)] shadow-xl py-2 z-50">
                  {item.children.map((child, j) => (
                    <a
                      key={j}
                      href={child.href}
                      className="block px-4 py-2 text-sm hover:bg-white/5"
                      onClick={(e) => isEditor && e.preventDefault()}
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <a
              key={i}
              href={item.href}
              className="text-sm font-semibold hover:opacity-70"
              onClick={(e) => isEditor && e.preventDefault()}
            >
              {item.label}
            </a>
          ),
        )}
      </nav>

      <div className="flex items-center gap-3">
        {props.cta ? (
          <button
            type="button"
            className="hidden sm:inline-flex rounded-full bg-violet-600 px-5 py-2 text-sm font-bold text-white"
          >
            <Editable sectionId={id} propName="cta" value={props.cta} isEditor={isEditor} />
          </button>
        ) : null}
        <button
          type="button"
          className="lg:hidden p-2 rounded-lg border border-white/10"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="absolute left-0 right-0 top-full z-50 border-b border-white/10 bg-[var(--background)] p-4 lg:hidden shadow-xl">
          <div className="flex flex-col gap-2">
            {menuItems.map((item, i) => (
              <div key={i}>
                <a
                  href={item.href}
                  className="block py-2 font-semibold"
                  onClick={(e) => isEditor && e.preventDefault()}
                >
                  {item.label}
                </a>
                {item.children?.map((child, j) => (
                  <a
                    key={j}
                    href={child.href}
                    className="block py-1 pl-4 text-sm opacity-70"
                    onClick={(e) => isEditor && e.preventDefault()}
                  >
                    {child.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
