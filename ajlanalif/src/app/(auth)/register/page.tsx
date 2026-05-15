"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const payload = await response.json().catch(() => ({ message: "Registration failed." }));

    setIsSubmitting(false);

    if (!response.ok) {
      toast.error(payload.message ?? "Registration failed.");
      return;
    }

    toast.success("Account created. Please sign in.");
    router.push("/sign-in");
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
      <h1 className="text-2xl font-semibold">Register</h1>
      <p className="mt-2 text-sm text-zinc-600">Create your account using username, email, and password.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-xl border border-zinc-200 p-5">
        <div className="space-y-1">
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            required
            minLength={3}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-sm text-zinc-600">
        Already have an account? <a className="underline" href="/sign-in">Sign in</a>
      </p>
    </main>
  );
}
