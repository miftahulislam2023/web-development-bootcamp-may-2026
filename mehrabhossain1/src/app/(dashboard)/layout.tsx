import { LogOut } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/Button";
import { auth, signOut } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Definitive, authoritative auth check for everything under (dashboard).
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const name = session.user.name ?? "User";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/">
            <BrandMark />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-gradient-brand text-sm font-semibold text-white">
                {initial}
              </span>
              <span className="hidden text-sm font-medium text-fg sm:inline">
                {name}
              </span>
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                leftIcon={<LogOut className="size-4" />}
              >
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
