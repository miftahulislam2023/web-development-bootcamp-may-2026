"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (!result || result.error) {
      toast.error("Sign in failed. Please check your credentials.");
      return;
    }

    toast.success("Signed in successfully.");
    router.push("/chat");
    router.refresh();
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-[28px] border border-cyan-400/12 bg-slate-950/75 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">Welcome back</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-50">Sign in</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Use your registered credentials to enter the chat workspace.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-slate-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-cyan-400/10 bg-slate-900/80 px-3 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-400/25"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-slate-200">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-cyan-400/10 bg-slate-900/80 px-3 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-400/25"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-300">
          Need an account? <Link className="text-cyan-200 underline-offset-4 hover:underline" href="/register">Register</Link>
        </p>
      </div>
    </main>
  );
}
