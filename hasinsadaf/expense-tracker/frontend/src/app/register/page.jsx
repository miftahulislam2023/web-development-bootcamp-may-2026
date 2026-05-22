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
  PersonIcon,
} from "@radix-ui/react-icons";
import { registerUser, getToken } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
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
      await registerUser(name, email, password);
      toast.success("Registration successful. You can now log in.");
      router.push("/login");
    } catch (error) {
      const errorMsg = error.message || "Registration failed";
      if (error.message?.includes("409") || errorMsg.includes("already exists")) {
        toast.error("An account with this email already exists. Try logging in instead.");
      } else {
        toast.error(errorMsg);
      }
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
        <h1 className="auth-title">Start tracking with confidence.</h1>
        <p className="auth-copy">
          Build a trustworthy personal finance workspace with clean transaction history and focused analytics.
        </p>
        <div className="auth-metrics">
          <div className="auth-metric">
            <strong>Simple</strong>
            <span>Fast expense entry</span>
          </div>
          <div className="auth-metric">
            <strong>Readable</strong>
            <span>Clear visual hierarchy</span>
          </div>
          <div className="auth-metric">
            <strong>Modern</strong>
            <span>Fintech UI system</span>
          </div>
          <div className="auth-metric">
            <strong>Calm</strong>
            <span>Neutral surfaces</span>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div>
            <div className="eyebrow">Create account</div>
            <h2>Join FinanceFlow</h2>
            <p>Set up your personal expense workspace in a few seconds.</p>
          </div>

          <form onSubmit={handleSubmit} className="form-stack">
            <div>
              <label className="label">Full name</label>
              <div style={{ position: "relative" }}>
                <PersonIcon className="field-icon" width={17} height={17} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="input input-with-icon"
                  placeholder="Your name"
                />
              </div>
            </div>

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
                  placeholder="At least 6 characters"
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
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="divider-row">or</div>

          <p style={{ textAlign: "center" }}>
            Already have an account?{" "}
            <Link href="/login" className="link-accent">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
