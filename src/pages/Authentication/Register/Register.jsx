import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";

/* ─── animated background orbs ───────────────────────────── */
const Orb = ({ className }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
  />
);

/* ─── floating label input ────────────────────────────────── */
function FloatInput({
  id, label, type = "text", value, onChange,
  error, icon, rightEl, autoComplete,
}) {
  const { dark, t } = useTheme();
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;
  const lifted = focused || filled;

  return (
    <div className="relative">
      {/* icon */}
      <span
        className="absolute left-4 top-1/2 -translate-y-1/2 text-base pointer-events-none transition-colors duration-200 z-10"
        style={{ color: focused ? t.accent : t.textDim }}
      >
        {icon}
      </span>

      {/* input */}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full pt-6 pb-2 pl-11 pr-11 rounded-2xl border text-sm font-medium outline-none transition-all duration-200 peer"
        style={{
          background:   dark ? "rgba(45,15,26,0.8)" : "rgba(255,228,232,0.5)",
          border:       `1.5px solid ${error ? "#e11d48" : focused ? t.accent : t.border}`,
          color:        t.text,
          boxShadow:    focused
            ? `0 0 0 3px ${t.accent}22`
            : error
            ? "0 0 0 3px rgba(225,29,72,0.12)"
            : "none",
        }}
      />

      {/* floating label */}
      <label
        htmlFor={id}
        className="absolute left-11 pointer-events-none font-medium transition-all duration-200 z-10"
        style={{
          top:      lifted ? "8px"  : "50%",
          transform: lifted ? "none" : "translateY(-50%)",
          fontSize:  lifted ? "10px" : "13px",
          color:     lifted
            ? (error ? "#e11d48" : focused ? t.accent : t.textDim)
            : t.textDim,
          letterSpacing: lifted ? "0.06em" : "0",
          textTransform: lifted ? "uppercase" : "none",
        }}
      >
        {label}
      </label>

      {/* right element (toggle password, etc) */}
      {rightEl && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
          {rightEl}
        </span>
      )}

      {/* error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="mt-1.5 ml-1 text-xs font-medium"
            style={{ color: "#e11d48" }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── password strength bar ───────────────────────────────── */
function StrengthBar({ password }) {
  const { t } = useTheme();
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score   = checks.filter(Boolean).length;
  const labels  = ["", "Weak", "Fair", "Good", "Strong"];
  const colors  = ["", "#e11d48", "#f59e0b", "#3b82f6", "#10b981"];
  const widths  = ["0%", "25%", "50%", "75%", "100%"];

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2 px-1"
    >
      <div className="flex gap-1 mb-1.5">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full overflow-hidden"
            style={{ background: t.border }}
          >
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: i <= score ? "100%" : "0%" }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              style={{ background: colors[score] }}
            />
          </div>
        ))}
      </div>
      <p className="text-xs font-semibold" style={{ color: colors[score] }}>
        {labels[score]}
      </p>
    </motion.div>
  );
}

/* ─── step indicator ──────────────────────────────────────── */
function StepDots({ total, current }) {
  const { t } = useTheme();
  return (
    <div className="flex items-center gap-2 justify-center mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width:      i === current ? 24 : 8,
            background: i === current ? t.accent : t.border,
          }}
          transition={{ duration: 0.3 }}
          className="h-2 rounded-full"
        />
      ))}
    </div>
  );
}

/* ─── left panel illustration ─────────────────────────────── */
function LeftPanel() {
  const { t } = useTheme();
  const stats = [
    { label: "Active users",     value: "20M+" },
    { label: "Transactions/day", value: "4.2M" },
    { label: "Avg savings",      value: "34%"  },
  ];
  return (
    <div className="hidden lg:flex flex-col justify-between p-10 xl:p-14 relative overflow-hidden h-full">
      {/* bg blobs */}
      <Orb className="w-80 h-80 -top-20 -left-20 opacity-30"
        style={{ background: "rgba(225,29,72,0.35)" }} />
      <Orb className="w-64 h-64 bottom-10 right-0 opacity-20"
        style={{ background: "rgba(251,113,133,0.4)" }} />

      {/* logo */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: t.accent }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#fff" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-2xl font-black tracking-tight" style={{ color: t.text }}>
            Spend<span style={{ color: t.accent }}>ora</span>
          </span>
        </div>
        <p className="text-sm leading-relaxed max-w-xs" style={{ color: t.textSub }}>
          Your AI-powered finance companion. Track, analyze, and optimize your spending — automatically.
        </p>
      </div>

      {/* stat cards */}
      <div className="space-y-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
            className="flex items-center justify-between rounded-2xl px-5 py-4"
            style={{
              background: t.pillBg,
              border:     `1px solid ${t.border}`,
            }}
          >
            <span className="text-sm font-medium" style={{ color: t.textSub }}>
              {s.label}
            </span>
            <span className="text-xl font-black" style={{ color: t.accent }}>
              {s.value}
            </span>
          </motion.div>
        ))}
      </div>

      {/* testimonial */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="rounded-2xl p-5"
        style={{ background: t.pillBg, border: `1px solid ${t.border}` }}
      >
        <p className="text-sm italic leading-relaxed mb-3" style={{ color: t.textSub }}>
          "Spendora helped me save $400 in my first month. The AI insights are genuinely useful."
        </p>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
            style={{ background: t.accent, color: "#fff" }}
          >
            MR
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: t.text }}>Mahiya Rahman</p>
            <p className="text-xs" style={{ color: t.textDim }}>Product Designer</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


export default function Register() {
  const { register } = useAuth();
  const { dark, t }  = useTheme();
  const navigate     = useNavigate();

  /* multi-step state */
  const [step, setStep] = useState(0); // 0 = personal info, 1 = security

  /* fields */
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [agree,    setAgree]    = useState(false);

  /* ui state */
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  /* ── validation per step ── */
  function validateStep0() {
    const e = {};
    if (!name.trim())                      e.name  = "Full name is required";
    else if (name.trim().split(" ").length < 2) e.name = "Enter your first and last name";
    if (!email.trim())                     e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep1() {
    const e = {};
    if (!password)                         e.password = "Password is required";
    else if (password.length < 8)          e.password = "At least 8 characters";
    if (!confirm)                          e.confirm  = "Confirm your password";
    else if (confirm !== password)         e.confirm  = "Passwords don't match";
    if (!agree)                            e.agree    = "You must accept the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* ── step navigation ── */
  function handleNext() {
    if (validateStep0()) setStep(1);
  }

  /* ── submit ── */
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateStep1()) return;

    setLoading(true);
    setErrors({});

    try {
      /* simulate network delay */
      await new Promise(r => setTimeout(r, 1800));
      register(name.trim(), email.trim(), password);
      setDone(true);
      await new Promise(r => setTimeout(r, 900));
      navigate("/app/dashboard");
    } catch (err) {
      setErrors({ form: err.message });
      setLoading(false);
    }
  }

  /* ── eye icon toggle ── */
  const EyeBtn = ({ show, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      className="p-1 rounded-lg transition-colors duration-150 border-none bg-transparent cursor-pointer"
      style={{ color: t.textDim }}
      onMouseEnter={e => (e.currentTarget.style.color = t.accent)}
      onMouseLeave={e => (e.currentTarget.style.color = t.textDim)}
      aria-label={show ? "Hide password" : "Show password"}
    >
      {show ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      )}
    </button>
  );

  /* ── success state ── */
  if (done) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: t.pageBg }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="flex flex-col items-center gap-4 text-center px-6"
        >
          <motion.div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
            style={{ background: "rgba(16,185,129,0.15)", border: "2px solid #10b981" }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            ✓
          </motion.div>
          <h2 className="text-2xl font-black" style={{ color: t.text }}>Account created!</h2>
          <p className="text-sm" style={{ color: t.textSub }}>Redirecting you to your dashboard…</p>
          <span className="loading loading-dots loading-md" style={{ color: t.accent }} />
        </motion.div>
      </div>
    );
  }

  /* ── main render ── */
  return (
    <div
      className="min-h-screen flex items-stretch relative overflow-hidden"
      style={{ background: t.pageBg }}
    >
      {/* background orbs */}
      <Orb
        className="w-96 h-96 -top-32 -left-32 opacity-20"
        style={{ background: "rgba(225,29,72,0.3)" }}
      />
      <Orb
        className="w-72 h-72 bottom-0 right-0 opacity-15"
        style={{ background: "rgba(251,113,133,0.25)" }}
      />

      {/* ── Left panel (lg+) ── */}
      <div
        className="hidden lg:block lg:w-[42%] xl:w-[45%] relative"
        style={{
          background:   t.phoneBg2,
          borderRight: `1px solid ${t.border}`,
        }}
      >
        <LeftPanel />
      </div>

      {/* ── Right: form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 md:px-12 py-12 relative z-10">

        {/* mobile logo */}
        <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-8 no-underline">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: t.accent }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#fff" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tight" style={{ color: t.text }}>
            Spend<span style={{ color: t.accent }}>ora</span>
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* header */}
          <div className="mb-7">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2" style={{ color: t.text }}>
              Create account
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: t.textSub }}>
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold no-underline transition-opacity hover:opacity-70"
                style={{ color: t.accent }}
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* step dots */}
          <StepDots total={2} current={step} />

          {/* form card */}
          <div
            className="rounded-3xl p-6 sm:p-8"
            style={{
              background: t.phoneBg,
              border:     `1px solid ${t.border}`,
              boxShadow:  `0 24px 64px ${t.shadow}`,
            }}
          >
            {/* global error */}
            <AnimatePresence>
              {errors.form && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-5 px-4 py-3 rounded-xl text-sm font-medium"
                  style={{
                    background: t.badge,
                    border:     `1px solid ${t.badgeBd}`,
                    color:      t.accent,
                  }}
                >
                  {errors.form}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} noValidate>
              <AnimatePresence mode="wait">

                {/* ── Step 0: personal info ── */}
                {step === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.28 }}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-4"
                        style={{ color: t.textDim }}>
                        Step 1 of 2 — Personal info
                      </p>
                    </div>

                    <FloatInput
                      id="name"
                      label="Full name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      error={errors.name}
                      autoComplete="name"
                      icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                      }
                    />

                    <FloatInput
                      id="email"
                      label="Email address"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      error={errors.email}
                      autoComplete="email"
                      icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                      }
                    />

                    <motion.button
                      type="button"
                      onClick={handleNext}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-3.5 rounded-2xl text-sm font-black tracking-wide border-none cursor-pointer flex items-center justify-center gap-2 mt-2"
                      style={{ background: t.accent, color: "#ffffff" }}
                      whileHover={{ opacity: 0.9 }}
                    >
                      Continue
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </motion.button>
                  </motion.div>
                )}

                {/* ── Step 1: security ── */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.28 }}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-4"
                        style={{ color: t.textDim }}>
                        Step 2 of 2 — Set your password
                      </p>
                    </div>

                    <div>
                      <FloatInput
                        id="password"
                        label="Password"
                        type={showPass ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        error={errors.password}
                        autoComplete="new-password"
                        icon={
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0110 0v4"/>
                          </svg>
                        }
                        rightEl={<EyeBtn show={showPass} onToggle={() => setShowPass(s => !s)} />}
                      />
                      <StrengthBar password={password} />
                    </div>

                    <FloatInput
                      id="confirm"
                      label="Confirm password"
                      type={showConf ? "text" : "password"}
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      error={errors.confirm}
                      autoComplete="new-password"
                      icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M9 12l2 2 4-4"/>
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0110 0v4"/>
                        </svg>
                      }
                      rightEl={<EyeBtn show={showConf} onToggle={() => setShowConf(s => !s)} />}
                    />

                    {/* terms checkbox */}
                    <div className="mt-1">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative mt-0.5 flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={agree}
                            onChange={e => setAgree(e.target.checked)}
                            className="sr-only"
                          />
                          <motion.div
                            animate={{
                              background: agree ? t.accent : "transparent",
                              borderColor: agree ? t.accent : t.border,
                            }}
                            className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors cursor-pointer"
                            onClick={() => setAgree(a => !a)}
                            style={{ borderColor: t.border }}
                          >
                            <AnimatePresence>
                              {agree && (
                                <motion.svg
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  width="11" height="11" viewBox="0 0 12 12" fill="none"
                                >
                                  <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round"/>
                                </motion.svg>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </div>
                        <span className="text-xs leading-relaxed" style={{ color: t.textSub }}>
                          I agree to the{" "}
                          <span className="font-semibold" style={{ color: t.accent }}>Terms of Service</span>
                          {" "}and{" "}
                          <span className="font-semibold" style={{ color: t.accent }}>Privacy Policy</span>
                        </span>
                      </label>
                      <AnimatePresence>
                        {errors.agree && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-1.5 ml-1 text-xs font-medium"
                            style={{ color: "#e11d48" }}
                          >
                            {errors.agree}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* buttons */}
                    <div className="flex gap-3 mt-1">
                      <motion.button
                        type="button"
                        onClick={() => setStep(0)}
                        whileTap={{ scale: 0.97 }}
                        className="flex-none px-5 py-3.5 rounded-2xl text-sm font-bold border cursor-pointer flex items-center gap-2 transition-colors"
                        style={{
                          background: "transparent",
                          border:     `1.5px solid ${t.border}`,
                          color:      t.textSub,
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.color = t.text;
                          e.currentTarget.style.background = t.pillBg;
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.color = t.textSub;
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M19 12H5M12 5l-7 7 7 7"/>
                        </svg>
                        Back
                      </motion.button>

                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileTap={{ scale: loading ? 1 : 0.97 }}
                        className="flex-1 py-3.5 rounded-2xl text-sm font-black border-none cursor-pointer flex items-center justify-center gap-2 transition-opacity"
                        style={{
                          background: t.accent,
                          color:      "#ffffff",
                          opacity:    loading ? 0.75 : 1,
                        }}
                        whileHover={loading ? {} : { opacity: 0.9 }}
                      >
                        {loading ? (
                          <>
                            <span className="loading loading-spinner loading-sm" />
                            Creating account…
                          </>
                        ) : (
                          <>
                            Create account
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                              <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </form>
          </div>

          {/* social proof */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center text-xs"
            style={{ color: t.textDim }}
          >
            Joined by{" "}
            <span className="font-bold" style={{ color: t.textSub }}>20M+ users</span>
            {" "}across 140 countries
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}