"use client";

import Link from "next/link";

import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { fieldClass } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export function SignInForm({ onForgotPassword }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(
        // backend error message or fallback
        err.response?.data?.message || "Invalid credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-center text-xs text-red-500">{error}</p>}

      {/* Email */}
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(false);
          }}
          className={fieldClass(error)}
          required
          autoComplete="email"
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            className={fieldClass(error)}
            required
            autoComplete="current-password"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
          >
            Forgot password?
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full border border-white bg-white py-2.5 text-sm font-semibold tracking-tighter 
        text-black transition-all duration-300 hover:bg-white hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
        hover:shadow-[0_0_18px_4px_rgba(255,255,255,0.35)] focus:outline-none"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

