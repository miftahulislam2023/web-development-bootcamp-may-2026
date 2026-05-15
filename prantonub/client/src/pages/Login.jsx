import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const ERROR_MSGS = {
  google_failed: "Google sign-in failed. Please try again.",
  google_not_configured: "Google OAuth not configured. Add credentials to server/.env",
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const [form, setForm] = useState({ email:"", password:"" });
  const [error, setError] = useState(ERROR_MSGS[sp.get("error")] || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.token, data.user);
      navigate("/");
    } catch (err) { setError(err.response?.data?.error || "Login failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <img src="/favicon.png" alt="FinanceHub" className="w-6 h-6" />
          </div>
          <span className="text-white font-bold text-xl">FinanceHub</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Track every penny,
            <br />
            grow every dollar.
          </h1>
          <p className="text-primary-200 text-lg">
            The smart way to manage your personal finances with beautiful
            insights and powerful tools.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              ["💸", "Expense Tracking"],
              ["📊", "Visual Analytics"],
              ["🎯", "Budget Goals"],
              ["🔄", "Auto Recurring"],
            ].map(([icon, text]) => (
              <div
                key={text}
                className="flex items-center gap-2 text-white/80 text-sm"
              >
                <span className="text-xl">{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>
        <p className="text-primary-200 text-sm">
          © 2026 FinanceHub. All rights reserved.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              FinanceHub
            </span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Welcome back
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Sign in to your account
          </p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input
                className="input"
                type="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <hr className="flex-1 border-gray-200 dark:border-gray-700" />
            <span className="text-xs text-gray-400">OR</span>
            <hr className="flex-1 border-gray-200 dark:border-gray-700" />
          </div>

          <button
            onClick={() =>
              (window.location.href = "https://financehub-personal-expence-tracker.onrender.com/api/auth/google")
            }
            className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium py-3 rounded-xl text-sm transition-all"
          >
            <GoogleIcon /> Continue with Google
          </button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary-600 font-semibold hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
