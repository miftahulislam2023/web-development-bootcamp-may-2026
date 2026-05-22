import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Layers,
  Receipt,
  ArrowLeft,
} from "lucide-react";
import { auth, signOut } from "@/lib/auth";
import { isAdmin } from "@/lib/permissions";
import { Logo } from "@/components/common/Logo";
import { cn } from "@/utils/cn";

export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/templates", label: "Templates", icon: Layers },
];

export default async function AdminLayout({ children }) {
  const session = await auth();
  if (!isAdmin(session)) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--card)] md:flex">
          <div className="border-b border-[var(--border)] px-5 py-5">
            <Logo size="sm" href="/admin" />
            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-violet-500">
              Admin console
            </p>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-[var(--border)] p-3 space-y-1">
            <p className="truncate px-3 py-2 text-xs font-medium text-[var(--muted-foreground)]">
              {session.user.email}
            </p>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </aside>

        <main className="flex-1 overflow-auto">
          <header className="border-b border-[var(--border)] bg-[var(--card)]/80 px-6 py-4 backdrop-blur md:hidden">
            <Logo size="sm" href="/admin" />
          </header>
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
