"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Check, X, ShieldCheck } from "lucide-react";
import { Header } from "@/components/header";
import { fieldClass } from "@/lib/utils";
import axios from "axios";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Validation rules
  const hasMinLen = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const isStrong = hasMinLen && hasUpper && hasLower && hasNumber;
  const matches = confirmPassword === newPassword;

  // Visual error states
  const showPasswordError = newPassword !== "" && !isStrong;
  const showMatchError = confirmPassword !== "" && !matches;

  // "If 'Confirm Password' is not empty, the 'match' check takes visual precedence over the strength check."
  const passwordBorderClass =
    confirmPassword !== "" && !matches
      ? "border-red-500 focus:border-red-400"
      : newPassword !== "" && !isStrong
        ? "border-red-500 focus:border-red-400"
        : "border-zinc-700 focus:border-white";

  const confirmBorderClass =
    confirmPassword !== "" && !matches
      ? "border-red-500 focus:border-red-400"
      : "border-zinc-700 focus:border-white";

  async function handleSubmit(e) {
    e.preventDefault();

    if (!isStrong || !matches) {
      setError(
        "Please ensure your password meets all requirements and matches.",
      );
      return;
    }

    if (!token || !email) {
      setError("Invalid or missing reset link parameters.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"}/api/auth/reset-password`,
        {
          email,
          token,
          newPassword,
        },
      );

      setSuccess(true);
      setTimeout(() => {
        router.push("/auth");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to reset password. The link might be expired.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (!token || !email) {
    return (
      <div className="flex flex-col items-center justify-center pt-24 text-center">
        <X className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-xl font-bold text-white uppercase tracking-tighter">
          Invalid Link
        </h1>
        <p className="text-zinc-500 mt-2">
          This password reset link is invalid or missing information.
        </p>
        <button
          onClick={() => router.push("/auth")}
          className="mt-6 text-sm text-white underline decoration-zinc-700 underline-offset-4 hover:decoration-white transition-all"
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center pt-24 px-4">
      <div className="w-full max-w-sm border border-zinc-800 p-8 rounded-xl bg-black">
        <div className="mb-6 text-center">
          <ShieldCheck className="h-10 w-10 text-white mx-auto mb-3" />
          <h1 className="text-lg font-bold text-white uppercase tracking-widest">
            Reset Password
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Stash a new secure password for your account.
          </p>
        </div>

        {success ? (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full border border-white flex items-center justify-center">
                <Check className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-zinc-400">
              Password reset successful! Redirecting to sign in...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-center text-xs text-red-500">{error}</p>
            )}

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  placeholder="8+ characters, Upper, Lower, Number"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full bg-transparent border text-white text-sm rounded-none px-3 py-2.5 pl-9 placeholder-zinc-700 outline-none transition-colors ${passwordBorderClass}`}
                  required
                />
              </div>

              {/* Strength Indicators */}
              {newPassword && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1">
                  <div
                    className={`flex items-center gap-1.5 text-[9px] uppercase tracking-wider ${hasMinLen ? "text-zinc-300" : "text-zinc-600"}`}
                  >
                    {hasMinLen ? (
                      <Check className="h-2.5 w-2.5" />
                    ) : (
                      <X className="h-2.5 w-2.5" />
                    )}{" "}
                    8+ Chars
                  </div>
                  <div
                    className={`flex items-center gap-1.5 text-[9px] uppercase tracking-wider ${hasUpper ? "text-zinc-300" : "text-zinc-600"}`}
                  >
                    {hasUpper ? (
                      <Check className="h-2.5 w-2.5" />
                    ) : (
                      <X className="h-2.5 w-2.5" />
                    )}{" "}
                    1 Uppercase
                  </div>
                  <div
                    className={`flex items-center gap-1.5 text-[9px] uppercase tracking-wider ${hasLower ? "text-zinc-300" : "text-zinc-600"}`}
                  >
                    {hasLower ? (
                      <Check className="h-2.5 w-2.5" />
                    ) : (
                      <X className="h-2.5 w-2.5" />
                    )}{" "}
                    1 Lowercase
                  </div>
                  <div
                    className={`flex items-center gap-1.5 text-[9px] uppercase tracking-wider ${hasNumber ? "text-zinc-300" : "text-zinc-600"}`}
                  >
                    {hasNumber ? (
                      <Check className="h-2.5 w-2.5" />
                    ) : (
                      <X className="h-2.5 w-2.5" />
                    )}{" "}
                    1 Number
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full bg-transparent border text-white text-sm rounded-none px-3 py-2.5 pl-9 placeholder-zinc-700 outline-none transition-colors ${confirmBorderClass}`}
                  required
                />
              </div>
              {confirmPassword !== "" && !matches && (
                <p className="text-[9px] uppercase tracking-widest text-red-500">
                  Passwords do not match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isStrong || !matches}
              className="mt-4 w-full border border-white bg-white py-2.5 text-sm font-semibold tracking-tighter 
              text-black transition-all duration-300 hover:bg-white hover:cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed
              enabled:hover:shadow-[0_0_18px_4px_rgba(255,255,255,0.35)] focus:outline-none"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={<div className="text-zinc-500">Loading...</div>}>
        <ResetPasswordContent />
      </Suspense>
    </main>
  );
}
