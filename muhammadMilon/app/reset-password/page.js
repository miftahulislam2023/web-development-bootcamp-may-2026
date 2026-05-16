import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Logo } from "@/components/common/Logo";
import { ResetPasswordForm } from "@/features/auth/ResetPasswordForm";

export const metadata = { title: "Reset password" };

export default function ResetPasswordPage() {
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
          <CardTitle className="font-display text-2xl">New password</CardTitle>
          <CardDescription>Choose a strong password for your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p className="text-sm text-[var(--muted-foreground)]">Loading…</p>}>
            <ResetPasswordForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
