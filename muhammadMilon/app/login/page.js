import { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LoginForm } from "@/features/auth/LoginForm";

import { Logo } from "@/components/common/Logo";
import { isGoogleOAuthConfigured } from "@/lib/google-oauth-env";

export const metadata = {
  title: "Sign in",
};

/** OAuth flags read from env — must not be baked in at static build time. */
export const dynamic = "force-dynamic";

export default function LoginPage() {
  const showGoogle = isGoogleOAuthConfigured();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="mb-8">
        <Logo size="lg" />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to continue to Nexora Studio.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Suspense fallback={<div className="text-sm text-[var(--muted-foreground)]">Loading…</div>}>
            <LoginForm showGoogle={showGoogle} />
          </Suspense>
          <p className="text-center text-sm text-[var(--muted-foreground)]">
            No account?{" "}
            <Link href="/register" className="font-medium text-[var(--accent)] hover:underline">
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
