import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Logo } from "@/components/common/Logo";
import { ForgotPasswordForm } from "@/features/auth/ForgotPasswordForm";

export const metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
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
          <CardTitle className="font-display text-2xl">Forgot password</CardTitle>
          <CardDescription>We will email you a link to reset your password.</CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
