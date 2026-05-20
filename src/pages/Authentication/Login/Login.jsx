import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { useLocation, useNavigate, Link } from "react-router";

export default function Login() {
  const { signIn, signInWithGoogle } = useAuth();
  const { t } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || "/app/dashboard";

  const [tab, setTab] = useState("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* login fields */
  const [lEmail, setLEmail] = useState("");
  const [lPass, setLPass] = useState("");
  const [showLPass, setShowLPass] = useState(false);

  /* register fields */
  const [rFName, setRFName] = useState("");
  const [rLName, setRLName] = useState("");
  const [rEmail, setREmail] = useState("");
  const [rPass, setRPass] = useState("");
  const [showRPass, setShowRPass] = useState(false);

  function switchTab(newTab) {
    setTab(newTab);
    setError("");
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    if (!lEmail.trim()) return setError("Email is required");
    if (!lPass) return setError("Password is required");
    setLoading(true);
    try {
      await signIn(lEmail.trim(), lPass);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    if (!rFName.trim() || !rLName.trim()) return setError("Full name is required");
    if (!rEmail.trim()) return setError("Email is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rEmail)) return setError("Enter a valid email");
    if (rPass.length < 8) return setError("Password must be at least 8 characters");
    setLoading(true);
    try {
      const { createUser, updateUserProfile } = useAuth();
      const result = await createUser(rEmail.trim(), rPass);
      await updateUserProfile({ displayName: `${rFName.trim()} ${rLName.trim()}` });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /* shared styles */
  const inp = {
    width: "100%",
    padding: "10px 12px 10px 38px",
    borderRadius: 10,
    background: t.cardBg,
    border: `1px solid ${t.border}`,
    color: t.text,
    fontSize: 13,
    outline: "none",
    fontFamily: "inherit",
  };

  const label = {
    fontSize: 11,
    fontWeight: 700,
    color: t.textSub,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 5,
    display: "block",
  };

  const iconWrap = {
    position: "absolute",
    left: 11,
    top: "50%",
    transform: "translateY(-50%)",
    color: t.textDim,
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    fontSize: 16,
  };

  const primaryBtn = {
    width: "100%",
    padding: "11px",
    borderRadius: 11,
    border: "none",
    background: t.accent,
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 700,
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.7 : 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontFamily: "inherit",
    marginTop: 4,
    transition: "opacity 0.18s",
  };

  const socialBtn = (color) => ({
    flex: 1,
    padding: "10px 12px",
    borderRadius: 11,
    border: `1px solid ${t.border}`,
    background: t.cardBg,
    color: t.text,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontFamily: "inherit",
    transition: "border-color 0.18s, color 0.18s",
  });

  const GoogleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.1 33.1 29.6 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 2.9l6.2-6.2C34.4 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.6-7.9 19.6-20 0-1.4-.1-2.7-.3-4z"/>
    </svg>
  );

  const FacebookIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#1877F2" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
    </svg>
  );

  const EyeBtn = ({ show, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      style={{
        position: "absolute",
        right: 10,
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: t.textDim,
        padding: 4,
        display: "flex",
        alignItems: "center",
      }}
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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: t.pageBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        transition: "background 0.4s",
      }}
    >
      <div
        style={{
          background: t.phoneBg,
          border: `1px solid ${t.border}`,
          borderRadius: 18,
          padding: "32px 28px",
          width: "100%",
          maxWidth: 380,
          boxShadow: `0 24px 60px ${t.shadow}`,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 6 }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: t.text, letterSpacing: "-0.04em" }}>
            Spend<span style={{ color: t.accent }}>ora</span>
          </div>
          <div style={{ fontSize: 12, color: t.textSub, marginTop: 4 }}>
            Your AI-powered finance companion
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            background: t.cardBg,
            borderRadius: 10,
            padding: 3,
            margin: "20px 0",
          }}
        >
          {["login", "register"].map((tb) => (
            <button
              key={tb}
              onClick={() => switchTab(tb)}
              style={{
                flex: 1,
                padding: "8px 0",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 700,
                background: tab === tb ? t.accent : "transparent",
                color: tab === tb ? "#ffffff" : t.textSub,
                transition: "all 0.18s",
                fontFamily: "inherit",
              }}
            >
              {tb === "login" ? "Sign in" : "Register"}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: t.badge,
              border: `1px solid ${t.badgeBd}`,
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 12,
              color: t.accent,
              marginBottom: 14,
            }}
          >
            {error}
          </div>
        )}

        {/* ── LOGIN FORM ── */}
        {tab === "login" && (
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Email */}
            <div>
              <label style={label}>Email</label>
              <div style={{ position: "relative" }}>
                <span style={iconWrap}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  style={inp}
                  type="email"
                  placeholder="you@email.com"
                  value={lEmail}
                  onChange={(e) => setLEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={label}>Password</label>
              <div style={{ position: "relative" }}>
                <span style={iconWrap}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </span>
                <input
                  style={{ ...inp, paddingRight: 38 }}
                  type={showLPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={lPass}
                  onChange={(e) => setLPass(e.target.value)}
                  autoComplete="current-password"
                />
                <EyeBtn show={showLPass} onToggle={() => setShowLPass((s) => !s)} />
              </div>
            </div>

            <button type="submit" disabled={loading} style={primaryBtn}>
              {loading ? "Signing in…" : "Sign in"}
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "2px 0" }}>
              <div style={{ flex: 1, height: 1, background: t.border }} />
              <span style={{ fontSize: 11, color: t.textDim }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: t.border }} />
            </div>

            {/* Social buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                style={socialBtn()}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#4285F4"; e.currentTarget.style.color = "#4285F4"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.text; }}
              >
                <GoogleIcon /> Google
              </button>
              <button
                type="button"
                disabled={loading}
                style={socialBtn()}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1877F2"; e.currentTarget.style.color = "#1877F2"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.text; }}
              >
                <FacebookIcon /> Facebook
              </button>
            </div>

            <div style={{ textAlign: "center", fontSize: 12, color: t.textDim }}>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => switchTab("register")}
                style={{ background: "none", border: "none", color: t.accent, cursor: "pointer", fontWeight: 700, fontSize: 12, padding: 0 }}
              >
                Register
              </button>
            </div>
          </form>
        )}

        {/* ── REGISTER FORM ── */}
        {tab === "register" && (
          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Name row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={label}>First Name</label>
                <div style={{ position: "relative" }}>
                  <span style={iconWrap}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                  <input
                    style={inp}
                    placeholder="Mahiya"
                    value={rFName}
                    onChange={(e) => setRFName(e.target.value)}
                    autoComplete="given-name"
                  />
                </div>
              </div>
              <div>
                <label style={label}>Last Name</label>
                <div style={{ position: "relative" }}>
                  <span style={iconWrap}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                  <input
                    style={inp}
                    placeholder="Rahman"
                    value={rLName}
                    onChange={(e) => setRLName(e.target.value)}
                    autoComplete="family-name"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={label}>Email</label>
              <div style={{ position: "relative" }}>
                <span style={iconWrap}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  style={inp}
                  type="email"
                  placeholder="you@email.com"
                  value={rEmail}
                  onChange={(e) => setREmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={label}>Password</label>
              <div style={{ position: "relative" }}>
                <span style={iconWrap}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </span>
                <input
                  style={{ ...inp, paddingRight: 38 }}
                  type={showRPass ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={rPass}
                  onChange={(e) => setRPass(e.target.value)}
                  autoComplete="new-password"
                />
                <EyeBtn show={showRPass} onToggle={() => setShowRPass((s) => !s)} />
              </div>
              {/* Strength bar */}
              {rPass && <StrengthBar password={rPass} accent={t.accent} border={t.border} />}
            </div>

            <button type="submit" disabled={loading} style={primaryBtn}>
              {loading ? "Creating account…" : "Create account"}
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "2px 0" }}>
              <div style={{ flex: 1, height: 1, background: t.border }} />
              <span style={{ fontSize: 11, color: t.textDim }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: t.border }} />
            </div>

            {/* Social buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                style={socialBtn()}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#4285F4"; e.currentTarget.style.color = "#4285F4"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.text; }}
              >
                <GoogleIcon /> Google
              </button>
              <button
                type="button"
                disabled={loading}
                style={socialBtn()}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1877F2"; e.currentTarget.style.color = "#1877F2"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.text; }}
              >
                <FacebookIcon /> Facebook
              </button>
            </div>

            <div style={{ textAlign: "center", fontSize: 12, color: t.textDim }}>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchTab("login")}
                style={{ background: "none", border: "none", color: t.accent, cursor: "pointer", fontWeight: 700, fontSize: 12, padding: 0 }}
              >
                Sign in
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ── Password strength bar ── */
function StrengthBar({ password, accent, border }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const colors = ["", "#e11d48", "#f59e0b", "#3b82f6", "#10b981"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 99,
              background: i <= score ? colors[score] : border,
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: colors[score] }}>
        {labels[score]}
      </span>
    </div>
  );
}