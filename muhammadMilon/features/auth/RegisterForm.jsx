"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerUser } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { registerSchema } from "@/lib/validations";
import { GoogleIcon } from "@/components/common/GoogleIcon";

export function RegisterForm({ showGoogle }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const parsed = registerSchema.safeParse({ name, email, password, confirmPassword });
    if (!parsed.success) {
      const err = parsed.error.flatten().fieldErrors;
      toast.error(err.confirmPassword?.[0] || err.password?.[0] || err.email?.[0] || "Invalid form");
      return;
    }
    setLoading(true);
    try {
      const reg = await registerUser(parsed.data);
      if (!reg.ok) {
        toast.error(reg.error?.email?.[0] || "Could not register");
        return;
      }
      const res = await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
      });
      if (res?.error) {
        toast.success("Account created — check your email to verify, then sign in.");
        router.push("/login");
        return;
      }
      toast.success("Account created — check your email to verify your address.");
      router.push("/dashboard");
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
    <div className="space-y-6">
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading || googleLoading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>

      {showGoogle ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
            <div className="h-px flex-1 bg-[var(--border)]" />
            or continue with
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>
          <Button
            type="button"
            variant="secondary"
            className="w-full h-11 gap-2.5 font-medium border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)]"
            disabled={loading || googleLoading}
            onClick={onGoogleSignIn}
          >
            <GoogleIcon className="h-5 w-5 shrink-0" />
            {googleLoading ? "Redirecting…" : "Login with Google"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
