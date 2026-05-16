"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { requestPasswordReset } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { forgotPasswordSchema } from "@/lib/validations";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      toast.error("Enter a valid email");
      return;
    }
    setLoading(true);
    try {
      await requestPasswordReset(parsed.data);
      setSent(true);
      toast.success("If an account exists, we sent reset instructions.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="space-y-6 py-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Check your email</h3>
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
            We've sent a password reset link to: <br/>
            <span className="font-medium text-[var(--foreground)]">{email}</span>
          </p>
          <p className="mt-4 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-500">
            <b>Note:</b> If you don't see it, please check your <b>Spam</b> folder. 
            In development, you can also check your server terminal.
          </p>
        </div>
        <div className="pt-4">
          <Link href="/login" className="text-sm font-semibold text-[var(--accent)] hover:underline">
            &larr; Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
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
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending…" : "Send reset link"}
      </Button>
      <p className="text-center text-sm text-[var(--muted-foreground)]">
        <Link href="/login" className="font-medium text-[var(--accent)] hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
