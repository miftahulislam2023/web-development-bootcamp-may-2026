"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/axios";
import { useState } from "react";

const schema = z.object({
  email: z.string().email("Invalid email"),
});

type ForgotForm = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ForgotForm) => {
    try {
      setError(null);
      await api.post("/auth/forgot-password", data);
      setSent(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    }
  };

  return (
    <main className="min-h-screen bg-[#0F1419] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="orb orb-purple" />
      <div className="orb orb-cyan" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#8B5CF6] via-[#06B6D4] to-[#10B981] flex items-center justify-center">
              <span className="text-white font-bold">L</span>
            </div>
            <span className="text-2xl font-bold bg-linear-to-r from-[#8B5CF6] via-[#06B6D4] to-[#10B981] bg-clip-text text-transparent">
              LiveChat
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-[#F1F5F9] mt-6 mb-1">Reset password</h1>
          <p className="text-[#94A3B8] text-sm">We&apos;ll send you a reset link</p>
        </div>

        <div className="bg-[#1E2530] border border-[#334155] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/40">
          {sent ? (
            <div className="text-center py-4">
              <p className="text-4xl mb-4">✅</p>
              <p className="text-[#F1F5F9] font-medium mb-2">Reset link sent!</p>
              <p className="text-[#94A3B8] text-sm">Check your email for the password reset link.</p>
              <Link href="/login" className="block text-center text-sm text-[#06B6D4] hover:text-[#22D3EE] mt-6 transition-colors">
                ← Back to login
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <div>
                  <label className="text-sm font-medium text-[#F1F5F9] block mb-1.5">Email</label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full bg-[#0F1419] border border-[#334155] rounded-xl px-4 py-3 text-[#F1F5F9] text-sm placeholder:text-[#94A3B8] focus:outline-none focus:border-[#06B6D4] transition-colors"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl font-semibold text-white bg-linear-to-r from-[#8B5CF6] via-[#06B6D4] to-[#10B981] hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
              <Link href="/login" className="block text-center text-sm text-[#94A3B8] hover:text-[#F1F5F9] mt-6 transition-colors">
                ← Back to login
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}