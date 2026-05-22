import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  LogOut,
  Shield,
  User,
  Receipt,
} from "lucide-react";
import { auth, signOut } from "@/lib/auth";
import { isAdmin } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/common/Logo";

export default async function DashboardLayout({ children }) {
  const session = await auth();

  if (session?.user?.id) {
    const row = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { blockedAt: true },
    });
    if (row?.blockedAt) {
      redirect("/blocked");
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex min-h-screen">
        <aside className="hidden w-60 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--card)] md:flex">
          <div className="border-b border-[var(--border)] px-4 py-4">
            <Logo size="sm" />
          </div>
          <nav className="flex-1 space-y-1 p-3 text-sm">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-[var(--muted)]"
            >
              <LayoutDashboard className="size-4" /> Dashboard
            </Link>
            <Link
              href="/dashboard/templates"
              className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-[var(--muted)]"
            >
              <Layers className="size-4" /> Marketplace
            </Link>
            <Link
              href="/dashboard/purchases"
              className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-[var(--muted)]"
            >
              <Receipt className="size-4" /> Purchases
            </Link>
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-[var(--muted)]"
            >
              <User className="size-4" /> Profile
            </Link>
            {isAdmin(session) ? (
              <Link
                href="/admin"
                className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-[var(--muted)]"
              >
                <Shield className="size-4" /> Admin
              </Link>
            ) : null}
          </nav>
          <div className="space-y-2 border-t border-[var(--border)] p-3">
            <div className="truncate text-xs text-[var(--muted-foreground)]">
              {session?.user?.email}
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button type="submit" variant="secondary" className="w-full justify-start" size="sm">
                <LogOut className="mr-2 size-4" />
                Sign out
              </Button>
            </form>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-4 py-3 md:hidden">
            <Logo size="sm" />
            <ThemeToggle />
          </header>
          <div className="hidden items-center justify-end border-b border-[var(--border)] bg-[var(--card)] px-6 py-3 md:flex">
            <ThemeToggle />
          </div>
          <div className="flex-1 px-4 py-8 md:px-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
