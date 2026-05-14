import { Link } from "@heroui/react";

import { ROUTES } from "@/lib/routes";

const footerLinks = [
  { label: "Features" as const, href: ROUTES.features },
  { label: "Chat" as const, href: ROUTES.chat },
  { label: "Security" as const, href: "#" },
  { label: "Download" as const, href: "#" },
  { label: "Privacy" as const, href: "#" },
  { label: "Terms" as const, href: "#" },
];

export function Footer() {
  return (
    <footer className="mt-auto flex w-full flex-col items-center gap-6 border-t border-outline-variant bg-surface-container-low px-gutter py-16 text-center">
      <div className="mb-1 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: 24 }}>
          forum
        </span>
        <span className="text-xl font-bold text-primary">Crimson Connect</span>
      </div>
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
        {footerLinks.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-md px-1 py-0.5 text-xs font-medium text-secondary no-underline outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low"
          >
            {label}
          </Link>
        ))}
      </div>
      <p className="text-base text-secondary">© 2026 Crimson Connect. Secure messaging for everyone.</p>
      <div className="mt-1 flex gap-2">
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full text-outline no-underline outline-none transition-[transform,colors] hover:bg-surface-container-high hover:text-primary active:scale-95 focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label="Language"
        >
          <span className="material-symbols-outlined" aria-hidden>
            language
          </span>
        </button>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full text-outline no-underline outline-none transition-[transform,colors] hover:bg-surface-container-high hover:text-primary active:scale-95 focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label="Help"
        >
          <span className="material-symbols-outlined" aria-hidden>
            help
          </span>
        </button>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full text-outline no-underline outline-none transition-[transform,colors] hover:bg-surface-container-high hover:text-primary active:scale-95 focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label="Trust and safety"
        >
          <span className="material-symbols-outlined" aria-hidden>
            verified_user
          </span>
        </button>
      </div>
    </footer>
  );
}
