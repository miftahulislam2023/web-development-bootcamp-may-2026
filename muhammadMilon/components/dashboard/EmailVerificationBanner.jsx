"use client";

import { useState } from "react";
import { toast } from "sonner";
import { resendVerificationEmail } from "@/actions/auth";
import { Button } from "@/components/ui/Button";

export function EmailVerificationBanner({ email, verified }) {
  const [loading, setLoading] = useState(false);
  if (verified) return null;

  async function onResend() {
    setLoading(true);
    try {
      const res = await resendVerificationEmail(email);
      if (res?.alreadyVerified) {
        toast.success("Email already verified");
        return;
      }
      if (res?.ok === false) {
        toast.error(res.error || "Could not send verification email");
        return;
      }
      toast.success("Verification email sent");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm flex flex-wrap items-center justify-between gap-3">
      <span>Your email is not verified yet.</span>
      <Button type="button" size="sm" variant="secondary" onClick={onResend} disabled={loading}>
        {loading ? "Sending…" : "Resend email"}
      </Button>
    </div>
  );
}
