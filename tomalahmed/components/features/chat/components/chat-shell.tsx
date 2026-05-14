"use client";

import { Link } from "@heroui/react";

import { ROUTES } from "@/lib/routes";

type ChatShellProps = {
  title: string;
  subtitle?: string | null;
  children: React.ReactNode;
};

export function ChatShell({ title, subtitle, children }: ChatShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-outline-variant bg-surface px-4 py-3 md:px-6">
        <Link
          href={ROUTES.chat}
          className="shrink-0 rounded-md px-1 py-0.5 text-sm font-semibold text-secondary no-underline outline-none transition-transform hover:text-primary active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          Chats
        </Link>
        <div className="min-w-0 flex-1 px-2 text-center">
          <h1 className="truncate text-base font-bold text-on-surface">{title}</h1>
          {subtitle ? <p className="mt-0.5 truncate text-xs text-secondary">{subtitle}</p> : null}
        </div>
        <Link
          href={ROUTES.home}
          className="shrink-0 rounded-md px-1 py-0.5 text-sm font-semibold text-secondary no-underline outline-none transition-transform hover:text-primary active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          Home
        </Link>
      </header>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
