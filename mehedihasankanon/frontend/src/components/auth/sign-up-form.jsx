"use client";

import { useState } from "react";
import { Mail, Lock, Check, X, Eye, EyeOff, User } from "lucide-react";
import { fieldClass } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

function checkRequirements(pw) {
  return {
    length: pw.length >= 8,
    uppercase: /[A-Z]/.test(pw),
    lowercase: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
  };
}

function meetsAll(pw) {
  const r = checkRequirements(pw);
  return r.length && r.uppercase && r.lowercase && r.number;
}

export function SignUpForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register } = useAuth();

  const reqs = checkRequirements(password);
  const passwordValid = meetsAll(password);
  const confirmFilled = confirm.length > 0;
  const mismatch = confirmFilled && confirm !== password;

  const passwordError =
    submitted && (mismatch || (!passwordValid && !confirmFilled));
  const confirmError = submitted && mismatch;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setError("");
    setLoading(false);

    if (mismatch || !passwordValid) return;

    setLoading(true);
    try {
      await register(username, email, password);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  const Req = ({ met, label }) => (
    <li className="flex items-center gap-1.5">
      {met ? (
        <Check className="w-3 h-3 text-white" />
      ) : (
        <X className="w-3 h-3 text-zinc-600" />
      )}
      <span className={met ? "text-zinc-300" : "text-zinc-600"}>{label}</span>
    </li>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-xs text-red-500 text-center">{error}</p>}

      {/* Username */}
      <div className="relative">
        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={fieldClass(false)}
          required
          autoComplete="name"
        />
      </div>

      {/* Email */}
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          className={fieldClass(error && error.includes("email"))}
          required
          autoComplete="email"
        />
      </div>

      {/* Password */}
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={fieldClass(passwordError) + " pr-10"}
          required
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Password requirements */}
      <ul className="text-xs space-y-1 pl-1">
        <Req met={reqs.length} label="At least 8 characters" />
        <Req met={reqs.uppercase} label="One uppercase letter" />
        <Req met={reqs.lowercase} label="One lowercase letter" />
        <Req met={reqs.number} label="One number" />
      </ul>

      {/* Confirm Password */}
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={fieldClass(confirmError) + " pr-10"}
          required
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
        >
          {showConfirm ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
        {confirmError && (
          <p className="text-xs text-red-500 mt-1 ml-1">
            Passwords do not match.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-2 py-2.5 text-sm font-semibold tracking-tighter text-black bg-white border border-white transition-all duration-300 hover:shadow-[0_0_18px_4px_rgba(255,255,255,0.35)] hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}
