"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  EnvelopeClosedIcon,
  LockClosedIcon,
  EyeOpenIcon,
  EyeClosedIcon,
  LightningBoltIcon,
} from "@radix-ui/react-icons";
import { loginUser, saveToken, getToken } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) router.push("/dashboard");
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUser(email, password);
      saveToken(response.token);
      toast.success("Login successful.");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-toggle">
        <ThemeToggle />
      </div>

      <section className="auth-brand">
        <div className="auth-logo">
          <div className="brand-mark">
            <LightningBoltIcon width={18} height={18} />
          </div>
          <div>
            <div className="brand-title">FinanceFlow</div>
            <div className="brand-subtitle">Premium expense clarity</div>
          </div>
        </div>
        <h1 className="auth-title">A calmer way to understand your money.</h1>
        <p className="auth-copy">
          Clean expense tracking, fast review workflows, and focused analytics built for everyday financial decisions.
        </p>
        <div className="auth-metrics">
          <div className="auth-metric">
            <strong>Real-time</strong>
            <span>Dashboard insights</span>
          </div>
          <div className="auth-metric">
            <strong>Private</strong>
            <span>Token-secured access</span>
          </div>
          <div className="auth-metric">
            <strong>Focused</strong>
            <span>Category analytics</span>
          </div>
          <div className="auth-metric">
            <strong>Responsive</strong>
            <span>Desktop and mobile</span>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div>
            <div className="eyebrow">Welcome back</div>
            <h2>Sign in to FinanceFlow</h2>
            <p>Access your spending dashboard and keep your ledger up to date.</p>
          </div>

          <form onSubmit={handleSubmit} className="form-stack">
            <div>
              <label className="label">Email address</label>
              <div style={{ position: "relative" }}>
                <EnvelopeClosedIcon className="field-icon" width={17} height={17} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input input-with-icon"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div style={{ position: "relative" }}>
                <LockClosedIcon className="field-icon" width={17} height={17} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input input-with-icon"
                  style={{ paddingRight: "42px" }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn btn-ghost icon-btn"
                  style={{
                    position: "absolute",
                    right: "4px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeClosedIcon width={17} height={17} />
                  ) : (
                    <EyeOpenIcon width={17} height={17} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="divider-row">or</div>

          <p style={{ textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="link-accent">
              Create one
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
