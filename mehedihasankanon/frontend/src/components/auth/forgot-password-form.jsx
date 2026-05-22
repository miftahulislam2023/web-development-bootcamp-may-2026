"use client";

import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { fieldClass } from "@/lib/utils";
import axios from "axios";

export function ForgotPasswordForm({ onBack }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/auth/forgot-password`, { email });
      setSuccess(true);
      // Success message from user request: "If an account exists, a reset link has been sent."
      // We'll show this then toggle back.
      setTimeout(() => {
        onBack();
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <button 
          onClick={onBack}
          className="text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h2 className="text-sm font-semibold text-white uppercase tracking-widest">Forgot Password</h2>
      </div>

      {success ? (
        <p className="text-sm text-zinc-400">
          If an account exists, a reset link has been sent. Redirecting...
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-center text-xs text-red-500">{error}</p>}
          
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className={fieldClass(error)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-white bg-white py-2.5 text-sm font-semibold tracking-tighter 
            text-black transition-all duration-300 hover:bg-white hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
            hover:shadow-[0_0_18px_4px_rgba(255,255,255,0.35)] focus:outline-none"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      )}
    </div>
  );
}
