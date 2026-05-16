"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { resetPassword } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { resetPasswordSchema } from "@/lib/validations";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    const parsed = resetPasswordSchema.safeParse({ token, password });
    if (!parsed.success) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await resetPassword(parsed.data);
      if (!res.ok) {
        toast.error(res.error || "Could not reset password");
        return;
      }
      toast.success("Password updated — sign in with your new password");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <p className="text-center text-sm text-[var(--muted-foreground)]">
        Invalid reset link.{" "}
        <Link href="/forgot-password" className="font-medium text-[var(--accent)] hover:underline">
          Request a new one
        </Link>
      </p>
    );
  }

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <div className="space-y-1.5">
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirm">Confirm password</Label>
        <Input
          id="confirm"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
