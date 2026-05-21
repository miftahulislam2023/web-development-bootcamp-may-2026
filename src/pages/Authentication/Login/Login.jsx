// Login.jsx — full updated version

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router";
import {
  FiMail, FiLock, FiUser, FiEye, FiEyeOff,
  FiArrowRight, FiCheck,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";

const DARK = {
  pageBg:  "#0d0a0b",
  phoneBg: "#161013",
  cardBg:  "#1f181c",
  pillBg:  "#1a1318",
  border:  "#2e2228",
  text:    "#f5eff1",
  textSub: "#a8929a",
  textDim: "#6b5560",
  accent:  "#e11d48",
  shadow:  "rgba(225,29,72,0.18)",
  badge:   "rgba(225,29,72,0.08)",
  badgeBd: "rgba(225,29,72,0.3)",
};

const Orb = ({ style, className }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    style={style}
    animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.85, 0.5] }}
    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
  />
);

function FloatInput({ id, label, type = "text", value, onChange, error, icon, rightEl, autoComplete }) {
  const t = DARK;
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-colors duration-200"
        style={{ color: focused ? t.accent : t.textDim, fontSize: 15 }}>
        {icon}
      </span>
      <input
        id={id} type={type} value={value} onChange={onChange}
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="w-full pt-6 pb-2 pl-11 pr-11 rounded-2xl border text-sm font-medium outline-none transition-all duration-200"
        style={{
          background: "rgba(31,24,28,0.9)",
          border: `1.5px solid ${error ? "#e11d48" : focused ? t.accent : t.border}`,
          color: t.text,
          boxShadow: focused ? `0 0 0 3px ${t.accent}22` : error ? "0 0 0 3px rgba(225,29,72,0.12)" : "none",
        }}
      />
      <label htmlFor={id} className="absolute left-11 pointer-events-none font-medium transition-all duration-200 z-10"
        style={{
          top: lifted ? "8px" : "50%",
          transform: lifted ? "none" : "translateY(-50%)",
          fontSize: lifted ? "10px" : "13px",
          color: lifted ? (error ? "#e11d48" : focused ? t.accent : t.textDim) : t.textDim,
          letterSpacing: lifted ? "0.06em" : "0",
          textTransform: lifted ? "uppercase" : "none",
        }}>
        {label}
      </label>
      {rightEl && <span className="absolute right-4 top-1/2 -translate-y-1/2 z-10">{rightEl}</span>}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }} className="mt-1.5 ml-1 text-xs font-medium" style={{ color: "#e11d48" }}>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function StrengthBar({ password }) {
  const t = DARK;
  const checks = [
    password.length >= 8, /[A-Z]/.test(password),
    /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#e11d48", "#f59e0b", "#3b82f6", "#10b981"];
  if (!password) return null;
  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mt-2 px-1">
      <div className="flex gap-1 mb-1.5">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-1 flex-1 rounded-full overflow-hidden" style={{ background: t.border }}>
            <motion.div className="h-full rounded-full" initial={{ width: 0 }}
              animate={{ width: i <= score ? "100%" : "0%" }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              style={{ background: colors[score] }} />
          </div>
        ))}
      </div>
      <p className="text-xs font-semibold" style={{ color: colors[score] }}>{labels[score]}</p>
    </motion.div>
  );
}

function EyeBtn({ show, onToggle }) {
  const t = DARK;
  return (
    <button type="button" onClick={onToggle}
      className="p-1 rounded-lg bg-transparent border-none cursor-pointer transition-colors duration-150"
      style={{ color: t.textDim }}
      onMouseEnter={e => (e.currentTarget.style.color = t.accent)}
      onMouseLeave={e => (e.currentTarget.style.color = t.textDim)}>
      {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
    </button>
  );
}

function SocialBtn({ icon, label, hoverColor, onClick, loading }) {
  const t = DARK;
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button type="button" onClick={onClick} disabled={loading} whileTap={{ scale: 0.96 }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold border cursor-pointer transition-all duration-200 min-w-0"
      style={{
        background: hovered ? `${hoverColor}12` : "transparent",
        border: `1.5px solid ${hovered ? hoverColor : t.border}`,
        color: hovered ? hoverColor : t.textSub,
        opacity: loading ? 0.6 : 1,
      }}>
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </motion.button>
  );
}

function LeftPanel() {
  const t = DARK;
  const stats = [
    { label: "Active users",     value: "20M+" },
    { label: "Transactions/day", value: "4.2M" },
    { label: "Avg savings",      value: "34%"  },
  ];
  return (
    <div className="hidden lg:flex flex-col justify-between p-10 xl:p-14 relative overflow-hidden h-full">
      <Orb className="w-80 h-80 -top-20 -left-20" style={{ background: "rgba(225,29,72,0.3)", opacity: 0.3 }} />
      <Orb className="w-64 h-64 bottom-10 right-0"  style={{ background: "rgba(251,113,133,0.35)", opacity: 0.2 }} />
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: t.accent }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#fff" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
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
      <div className="space-y-3">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
            className="flex items-center justify-between rounded-2xl px-5 py-4"
            style={{ background: t.pillBg, border: `1px solid ${t.border}` }}>
            <span className="text-sm font-medium" style={{ color: t.textSub }}>{s.label}</span>
            <span className="text-xl font-black" style={{ color: t.accent }}>{s.value}</span>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }} className="rounded-2xl p-5"
        style={{ background: t.pillBg, border: `1px solid ${t.border}` }}>
        <p className="text-sm italic leading-relaxed mb-3" style={{ color: t.textSub }}>
          "Spendora helped me save $400 in my first month. The AI insights are genuinely useful."
        </p>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
            style={{ background: t.accent, color: "#fff" }}>MR</div>
          <div>
            <p className="text-xs font-bold" style={{ color: t.text }}>Mahiya Rahman</p>
            <p className="text-xs" style={{ color: t.textDim }}>Product Designer</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Spinner() {
  return (
    <motion.div className="w-5 h-5 border-2 border-t-transparent rounded-full"
      style={{ borderColor: "#e11d48", borderTopColor: "transparent" }}
      animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
  );
}

export default function Login() {
  const t = DARK;
  const [tab, setTab] = useState("login");
  const { signIn, createUser, signInWithGoogle, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // login fields
  const [lEmail,    setLEmail]    = useState("");
  const [lPass,     setLPass]     = useState("");
  const [showLPass, setShowLPass] = useState(false);   // ← show password for login

  // register fields
  const [rName,     setRName]     = useState("");
  const [rEmail,    setREmail]    = useState("");
  const [rPass,     setRPass]     = useState("");
  const [rConfirm,  setRConfirm]  = useState("");
  const [agree,     setAgree]     = useState(false);
  const [showRPass, setShowRPass] = useState(false);   // ← show password
  const [showRConf, setShowRConf] = useState(false);   // ← show confirm password

  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  function switchTab(newTab) { setTab(newTab); setErrors({}); }

  function validateLogin() {
    const e = {};
    if (!lEmail.trim()) e.lEmail = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lEmail)) e.lEmail = "Enter a valid email";
    if (!lPass) e.lPass = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateRegister() {
    const e = {};
    if (!rName.trim()) e.rName = "Full name is required";
    else if (rName.trim().split(" ").length < 2) e.rName = "Enter first and last name";
    if (!rEmail.trim()) e.rEmail = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rEmail)) e.rEmail = "Enter a valid email";
    if (!rPass) e.rPass = "Password is required";
    else if (rPass.length < 8) e.rPass = "At least 8 characters";
    if (!rConfirm) e.rConfirm = "Confirm your password";
    else if (rConfirm !== rPass) e.rConfirm = "Passwords don't match";
    if (!agree) e.agree = "You must accept the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (!validateLogin()) return;
    try {
      setLoading(true);
      await signIn(lEmail, lPass);
      setDone(true);
      setTimeout(() => navigate(from, { replace: true }), 1200);
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!validateRegister()) return;
    try {
      setLoading(true);
      await createUser(rEmail, rPass);
      await updateUserProfile({ displayName: rName });
      setDone(true);
      setTimeout(() => navigate(from, { replace: true }), 1200);
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleSocial(provider) {
    try {
      setLoading(true);
      if (provider === "google") await signInWithGoogle();
      setDone(true);
      setTimeout(() => navigate(from, { replace: true }), 1200);
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: t.pageBg }}>
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="flex flex-col items-center gap-4 text-center px-6">
          <motion.div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
            style={{ background: "rgba(16,185,129,0.12)", border: "2px solid #10b981" }}
            animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5, delay: 0.2 }}>
            <FiCheck size={36} color="#10b981" />
          </motion.div>
          <h2 className="text-2xl font-black" style={{ color: t.text }}>
            {tab === "login" ? "Welcome back!" : "Account created!"}
          </h2>
          <p className="text-sm" style={{ color: t.textSub }}>Redirecting…</p>
          <motion.div className="w-10 h-10 border-2 border-t-transparent rounded-full mt-2"
            style={{ borderColor: t.accent, borderTopColor: "transparent" }}
            animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
        </motion.div>
      </div>
    );
  }

  const Divider = () => (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px" style={{ background: t.border }} />
      <span className="text-xs" style={{ color: t.textDim }}>or continue with</span>
      <div className="flex-1 h-px" style={{ background: t.border }} />
    </div>
  );

  const SocialRow = () => (
    <div className="flex gap-2 mt-1">
      <SocialBtn icon={<FcGoogle size={17} />} label="Google" hoverColor="#4285F4"
        onClick={() => handleSocial("google")} loading={loading} />
      <SocialBtn icon={<FaGithub size={17} />} label="GitHub" hoverColor="#e5e5e5"
        onClick={() => handleSocial("github")} loading={loading} />
      <SocialBtn icon={<FiMail size={17} />} label="Magic link" hoverColor="#e11d48"
        onClick={() => handleSocial("email")} loading={loading} />
    </div>
  );

  return (
    <div className="min-h-screen flex items-stretch relative overflow-hidden" style={{ background: t.pageBg }}>
      <Orb className="w-96 h-96 -top-32 -left-32" style={{ background: "rgba(225,29,72,0.28)", opacity: 0.18 }} />
      <Orb className="w-72 h-72 bottom-0 right-0"  style={{ background: "rgba(251,113,133,0.22)", opacity: 0.13 }} />

      <div className="hidden lg:block lg:w-[42%] xl:w-[45%] relative"
        style={{ background: "rgba(22,16,19,0.9)", borderRight: `1px solid ${t.border}` }}>
        <LeftPanel />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 md:px-12 py-10 relative z-10">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: t.accent }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#fff" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tight" style={{ color: t.text }}>
            Spend<span style={{ color: t.accent }}>ora</span>
          </span>
        </div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }} className="w-full max-w-md">

          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2" style={{ color: t.text }}>
              {tab === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-sm" style={{ color: t.textSub }}>
              {tab === "login" ? "New to Spendora? " : "Already have an account? "}
              <button type="button" onClick={() => switchTab(tab === "login" ? "register" : "login")}
                className="font-bold bg-transparent border-none cursor-pointer p-0 transition-opacity hover:opacity-70"
                style={{ color: t.accent }}>
                {tab === "login" ? "Create account" : "Sign in"}
              </button>
            </p>
          </div>

          <div className="flex rounded-2xl p-1 mb-6"
            style={{ background: t.cardBg, border: `1px solid ${t.border}` }}>
            {[{ id: "login", label: "Sign in" }, { id: "register", label: "Register" }].map(tb => (
              <motion.button key={tb.id} type="button" onClick={() => switchTab(tb.id)}
                className="flex-1 py-2.5 rounded-xl text-xs font-black border-none cursor-pointer transition-all duration-200"
                animate={{ background: tab === tb.id ? t.accent : "transparent", color: tab === tb.id ? "#ffffff" : t.textSub }}
                whileTap={{ scale: 0.97 }}>
                {tb.label}
              </motion.button>
            ))}
          </div>

          <div className="rounded-3xl p-6 sm:p-8"
            style={{ background: t.phoneBg, border: `1px solid ${t.border}`, boxShadow: `0 24px 64px ${t.shadow}` }}>

            <AnimatePresence>
              {errors.form && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mb-5 px-4 py-3 rounded-xl text-sm font-medium"
                  style={{ background: t.badge, border: `1px solid ${t.badgeBd}`, color: t.accent }}>
                  {errors.form}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">

              {/* ── LOGIN ── */}
              {tab === "login" && (
                <motion.div key="login" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.28 }}>
                  <form onSubmit={handleLogin} noValidate className="flex flex-col gap-4">
                    <FloatInput id="lEmail" label="Email address" type="email"
                      value={lEmail} onChange={e => setLEmail(e.target.value)}
                      error={errors.lEmail} autoComplete="email" icon={<FiMail />} />

                    {/* Password with show/hide */}
                    <FloatInput id="lPass" label="Password"
                      type={showLPass ? "text" : "password"}
                      value={lPass} onChange={e => setLPass(e.target.value)}
                      error={errors.lPass} autoComplete="current-password" icon={<FiLock />}
                      rightEl={<EyeBtn show={showLPass} onToggle={() => setShowLPass(s => !s)} />} />

                    <div className="flex justify-end -mt-2">
                      <button type="button"
                        className="text-xs font-semibold bg-transparent border-none cursor-pointer transition-opacity hover:opacity-70"
                        style={{ color: t.accent }}>
                        Forgot password?
                      </button>
                    </div>

                    <motion.button type="submit" disabled={loading}
                      whileTap={{ scale: loading ? 1 : 0.97 }} whileHover={loading ? {} : { opacity: 0.9 }}
                      className="w-full py-3.5 rounded-2xl text-sm font-black border-none cursor-pointer flex items-center justify-center gap-2 transition-opacity mt-1"
                      style={{ background: t.accent, color: "#fff", opacity: loading ? 0.75 : 1 }}>
                      {loading ? <><Spinner /> Signing in…</> : <>Sign in <FiArrowRight size={16} /></>}
                    </motion.button>
                    <Divider />
                    <SocialRow />
                  </form>
                </motion.div>
              )}

              {/* ── REGISTER (single step) ── */}
              {tab === "register" && (
                <motion.div key="register" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.28 }}>
                  <form onSubmit={handleRegister} noValidate className="flex flex-col gap-4">

                    <FloatInput id="rName" label="Full name"
                      value={rName} onChange={e => setRName(e.target.value)}
                      error={errors.rName} autoComplete="name" icon={<FiUser />} />

                    <FloatInput id="rEmail" label="Email address" type="email"
                      value={rEmail} onChange={e => setREmail(e.target.value)}
                      error={errors.rEmail} autoComplete="email" icon={<FiMail />} />

                    {/* Password with show/hide + strength bar */}
                    <div>
                      <FloatInput id="rPass" label="Password"
                        type={showRPass ? "text" : "password"}
                        value={rPass} onChange={e => setRPass(e.target.value)}
                        error={errors.rPass} autoComplete="new-password" icon={<FiLock />}
                        rightEl={<EyeBtn show={showRPass} onToggle={() => setShowRPass(s => !s)} />} />
                      <StrengthBar password={rPass} />
                    </div>

                    {/* Confirm password with show/hide */}
                    <FloatInput id="rConfirm" label="Confirm password"
                      type={showRConf ? "text" : "password"}
                      value={rConfirm} onChange={e => setRConfirm(e.target.value)}
                      error={errors.rConfirm} autoComplete="new-password" icon={<FiLock />}
                      rightEl={<EyeBtn show={showRConf} onToggle={() => setShowRConf(s => !s)} />} />

                    {/* Terms & Conditions checkbox */}
                    <div>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <div className="relative mt-0.5 flex-shrink-0">
                          <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="sr-only" />
                          <motion.div
                            animate={{ background: agree ? t.accent : "transparent", borderColor: agree ? t.accent : t.border }}
                            className="w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer"
                            style={{ borderColor: t.border }}
                            onClick={() => setAgree(a => !a)}>
                            <AnimatePresence>
                              {agree && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                  <FiCheck size={11} color="#fff" strokeWidth={3} />
                                </motion.div>
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
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="mt-1.5 ml-1 text-xs font-medium" style={{ color: "#e11d48" }}>
                            {errors.agree}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <motion.button type="submit" disabled={loading}
                      whileTap={{ scale: loading ? 1 : 0.97 }} whileHover={loading ? {} : { opacity: 0.9 }}
                      className="w-full py-3.5 rounded-2xl text-sm font-black border-none cursor-pointer flex items-center justify-center gap-2 transition-opacity"
                      style={{ background: t.accent, color: "#fff", opacity: loading ? 0.75 : 1 }}>
                      {loading ? <><Spinner /> Creating account…</> : <>Create account <FiArrowRight size={15} /></>}
                    </motion.button>

                    <Divider />
                    <SocialRow />
                  </form>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="mt-6 text-center text-xs" style={{ color: t.textDim }}>
            Joined by{" "}
            <span className="font-bold" style={{ color: t.textSub }}>20M+ users</span>
            {" "}across 140 countries
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}