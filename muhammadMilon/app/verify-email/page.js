import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Logo } from "@/components/common/Logo";
import { verifyEmail } from "@/actions/auth";

export const metadata = { title: "Verify email" };
export const dynamic = "force-dynamic";

export default async function VerifyEmailPage({ searchParams }) {
  const params = await searchParams;
  const token = params?.token;
  const result = token ? await verifyEmail(token) : { ok: false, error: "Missing token" };

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
          <CardTitle className="font-display text-2xl">
            {result.ok ? "Email verified" : "Verification failed"}
          </CardTitle>
          <CardDescription>
            {result.ok
              ? "Your email is confirmed. You can sign in and use Nexora Studio."
              : result.error || "This link is invalid or has expired."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/login" className="text-sm font-medium text-[var(--accent)] hover:underline">
            Go to sign in
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
