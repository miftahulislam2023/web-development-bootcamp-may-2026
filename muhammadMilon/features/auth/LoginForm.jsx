"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { loginSchema } from "@/lib/validations";
import { GoogleIcon } from "@/components/common/GoogleIcon";

export function LoginForm({ showGoogle }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error("Check your email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
      });
      if (res?.error) {
        toast.error("Invalid credentials");
        return;
      }
      const sess = await getSession();
      const dest =
        sess?.user?.role === "admin"
          ? "/admin"
          : callbackUrl.startsWith("/admin")
            ? "/dashboard"
            : callbackUrl;
      router.push(dest);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function onGoogleSignIn() {
    setGoogleLoading(true);
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "https://nexora-studio-ten.vercel.app";
      await signIn("google", {
        callbackUrl: `${origin}/dashboard`,
      });
    } catch {
      toast.error("Could not start Google sign-in. Try again.");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form className="space-y-3" onSubmit={onSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-[var(--accent)] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading || googleLoading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      {showGoogle ? (
        <>
          <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
            <div className="h-px flex-1 bg-[var(--border)]" />
            or continue with
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>
          <Button
            type="button"
            variant="secondary"
            className="w-full gap-2"
            disabled={loading || googleLoading}
            onClick={onGoogleSignIn}
          >
            <GoogleIcon className="h-5 w-5 shrink-0" />
            {googleLoading ? "Redirecting…" : "Continue with Google"}
          </Button>
        </>
      ) : null}
    </div>
  );
}
