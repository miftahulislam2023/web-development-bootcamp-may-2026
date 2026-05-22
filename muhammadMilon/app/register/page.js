import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { RegisterForm } from "@/features/auth/RegisterForm";

import { Logo } from "@/components/common/Logo";
import { isGoogleOAuthConfigured } from "@/lib/google-oauth-env";

export const metadata = {
  title: "Create account",
};

/** OAuth flags read from env — must not be baked in at static build time. */
export const dynamic = "force-dynamic";

export default function RegisterPage() {
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
          <CardTitle className="font-display text-2xl">Create your workspace</CardTitle>
          <CardDescription>Build and publish sites with Nexora Studio.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RegisterForm showGoogle={showGoogle} />
          <p className="text-center text-sm text-[var(--muted-foreground)]">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[var(--accent)] hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
