import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

const checkPasswordStrength = (pwd) => {
  const hasUpperCase = /[A-Z]/.test(pwd);
  const hasLowerCase = /[a-z]/.test(pwd);
  const hasNumbers = /[0-9]/.test(pwd);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);
  const isLongEnough = pwd.length >= 8;
  const strength = [
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar,
    isLongEnough,
  ].filter(Boolean).length;
  return {
    strength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar,
    isLongEnough,
    isStrong: strength >= 4 && isLongEnough,
  };
};

const getPasswordStrengthColor = (strength) => {
  if (strength === 0) return "bg-gray-300";
  if (strength === 1) return "bg-red-500";
  if (strength === 2) return "bg-orange-500";
  if (strength === 3) return "bg-yellow-500";
  if (strength === 4) return "bg-blue-500";
  return "bg-green-500";
};

// ── OTP Input Component ──────────────────────────────────────────────────────
function OtpInput({ value, onChange, disabled }) {
  const inputs = useRef([]);
  const digits = value.split("");

  const handleChange = (i, e) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = val;
    onChange(next.join(""));
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    onChange(pasted.padEnd(6, "").slice(0, 6));
    inputs.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <input
            key={i}
            ref={(el) => (inputs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digits[i] || ""}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={disabled}
            className="w-11 h-12 text-center text-lg font-bold border-2 rounded-xl outline-none transition-all
            border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900
            text-gray-900 dark:text-white
            focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900
            disabled:opacity-50"
          />
        ))}
    </div>
  );
}

// ── Resend countdown hook ────────────────────────────────────────────────────
function useResendTimer(initial = 60) {
  const [seconds, setSeconds] = useState(initial);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!active) return;
    if (seconds <= 0) {
      setActive(false);
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, active]);

  const reset = () => {
    setSeconds(initial);
    setActive(true);
  };
  return { seconds, canResend: !active, reset };
}

// ── Main Register Component ──────────────────────────────────────────────────
export default function Register() {
  const navigate = useNavigate();

  // Steps: "form" | "otp" | "success"
  const [step, setStep] = useState("form");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const { seconds, canResend, reset: resetTimer } = useResendTimer(60);

  const passwordStrength = checkPasswordStrength(form.password);

  // Step 1 – submit registration form → backend sends OTP to email
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Name is required");
    if (!form.email.trim()) return setError("Email is required");
    if (form.password !== form.confirm)
      return setError("Passwords do not match");
    if (!passwordStrength.isStrong)
      return setError("Password is not strong enough");

    setLoading(true);
    try {
      // Backend registers user (unverified) and emails a 6-digit OTP
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 – verify OTP
  const handleVerifyOtp = async () => {
    if (otp.length < 6)
      return setOtpError("Please enter the full 6-digit code");
    setOtpError("");
    setOtpLoading(true);
    try {
      await api.post("/auth/verify-email", { email: form.email, otp });
      setStep("success");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setOtpError(
        err.response?.data?.error ||
          "Invalid or expired code. Please try again.",
      );
      setOtp("");
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (!canResend) return;
    setOtpError("");
    try {
      await api.post("/auth/resend-otp", { email: form.email });
      resetTimer();
      setOtp("");
    } catch (err) {
      setOtpError(err.response?.data?.error || "Failed to resend code");
    }
  };

  // ── Shared layout wrapper ──────────────────────────────────────────────────
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
            Start your financial journey today.
          </h1>
          <p className="text-primary-200 text-lg">
            Join thousands of users who track, save, and grow smarter with
            FinanceHub.
          </p>
        </div>
        <p className="text-primary-200 text-sm">
          © 2026 FinanceHub. All rights reserved.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              FinanceHub
            </span>
          </div>

          {/* ── STEP: success ─────────────────────────────────────────────── */}
          {step === "success" && (
            <div className="text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Registration Successful!
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Your account has been verified and created.
              </p>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl mb-6">
                Redirecting to login page in 3 seconds...
              </div>
              <button
                onClick={() => navigate("/login")}
                className="btn-primary w-full py-3 text-base"
              >
                Go to Login
              </button>
            </div>
          )}

          {/* ── STEP: otp ─────────────────────────────────────────────────── */}
          {step === "otp" && (
            <div>
              <button
                onClick={() => {
                  setStep("form");
                  setOtp("");
                  setOtpError("");
                }}
                className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 transition-colors"
              >
                ← Back
              </button>

              <div className="text-center mb-8">
                <div className="text-4xl mb-3">📧</div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  Check your email
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  We sent a 6-digit code to
                  <br />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {form.email}
                  </span>
                </p>
              </div>

              {otpError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl mb-5 text-center">
                  {otpError}
                </div>
              )}

              <div className="mb-6">
                <label className="label text-center block mb-3">
                  Enter verification code
                </label>
                <OtpInput value={otp} onChange={setOtp} disabled={otpLoading} />
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={otpLoading || otp.length < 6}
                className="btn-primary w-full py-3 text-base"
              >
                {otpLoading ? "Verifying..." : "Verify Email"}
              </button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
                Didn't receive the code?{" "}
                {canResend ? (
                  <button
                    onClick={handleResend}
                    className="text-primary-600 font-semibold hover:underline"
                  >
                    Resend code
                  </button>
                ) : (
                  <span className="text-gray-400 dark:text-gray-500">
                    Resend in{" "}
                    <span className="font-semibold tabular-nums">
                      {seconds}s
                    </span>
                  </span>
                )}
              </p>
            </div>
          )}

          {/* ── STEP: form ────────────────────────────────────────────────── */}
          {step === "form" && (
            <>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                Create account
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                Start tracking your expenses for free
              </p>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    className="input"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Email address</label>
                  <input
                    className="input"
                    type="email"
                    placeholder="Enter your email address"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="label">
                    Password{" "}
                    <span className="text-xs text-gray-400">
                      (Min 8 chars, uppercase, lowercase, number, special char)
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      className="input pr-10"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-lg"
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                  {form.password && (
                    <div className="mt-2 space-y-2">
                      <div className="flex gap-1">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full ${i < passwordStrength.strength ? getPasswordStrengthColor(passwordStrength.strength) : "bg-gray-200 dark:bg-gray-700"}`}
                            />
                          ))}
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        {[
                          [
                            passwordStrength.isLongEnough,
                            "At least 8 characters",
                          ],
                          [
                            passwordStrength.hasUpperCase,
                            "Uppercase letter (A-Z)",
                          ],
                          [
                            passwordStrength.hasLowerCase,
                            "Lowercase letter (a-z)",
                          ],
                          [passwordStrength.hasNumbers, "Number (0-9)"],
                          [
                            passwordStrength.hasSpecialChar,
                            "Special character (!@#$%...)",
                          ],
                        ].map(([met, label]) => (
                          <div
                            key={label}
                            className={
                              met
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-gray-400"
                            }
                          >
                            ✓ {label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="label">Confirm Password</label>
                  <div className="relative">
                    <input
                      className="input pr-10"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={form.confirm}
                      onChange={(e) =>
                        setForm({ ...form, confirm: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-lg"
                    >
                      {showConfirm ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !passwordStrength.isStrong}
                  className="btn-primary w-full py-3 text-base mt-2"
                >
                  {loading ? "Sending verification code..." : "Continue"}
                </button>
              </form>

              <div className="flex items-center gap-3 my-5">
                <hr className="flex-1 border-gray-200 dark:border-gray-700" />
                <span className="text-xs text-gray-400">OR</span>
                <hr className="flex-1 border-gray-200 dark:border-gray-700" />
              </div>

              <button
                onClick={() =>
                  (window.location.href =
                    "http://localhost:5000/api/auth/google")
                }
                className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium py-3 rounded-xl text-sm transition-all"
              >
                <GoogleIcon /> Continue with Google
              </button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary-600 font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
