import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

/* ─── Store Buttons ───────────────────────────────────────── */
const STORES = [
  {
    label: "Download on the",
    name: "App Store",
    icon: () => (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
  },
  {
    label: "GET IT ON",
    name: "Google Play",
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.36.6 1.24 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z" />
      </svg>
    ),
  },
];

/* ─── Login Prompt Modal ──────────────────────────────────── */
const LoginPromptModal = ({ t, onClose, onLogin }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
      background: "rgba(0,0,0,0.55)",
      backdropFilter: "blur(6px)",
      animation: "spdFadeIn 0.2s ease",
    }}
    onClick={onClose}
  >
    <div
      style={{
        background: t.phoneBg,
        border: `1px solid ${t.border}`,
        borderRadius: 20,
        padding: "36px 32px",
        maxWidth: 380,
        width: "100%",
        boxShadow: `0 32px 80px ${t.shadow}`,
        animation: "spdSlideUp 0.25s ease",
        textAlign: "center",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: t.pillInner,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
          border: `1px solid ${t.border}`,
        }}
      >
        <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke={t.accent} strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <h2 style={{ margin: "0 0 10px", fontSize: 20, fontWeight: 800, color: t.text }}>
        Login Required
      </h2>
      <p style={{ margin: "0 0 28px", fontSize: 14, color: t.textSub, lineHeight: 1.6 }}>
        You need to be logged in to access the dashboard and track your expenses.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          onClick={onLogin}
          style={{
            width: "100%", padding: "13px", borderRadius: 12,
            background: t.accent, color: t.accentTx,
            fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer",
            transition: "opacity 0.2s, transform 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "scale(1.02)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
        >
          Go to Login
        </button>
        <button
          onClick={onClose}
          style={{
            width: "100%", padding: "12px", borderRadius: 12,
            background: "transparent", color: t.textSub,
            fontSize: 14, fontWeight: 500, border: `1px solid ${t.border}`, cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.text; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSub; }}
        >
          Maybe Later
        </button>
      </div>
    </div>
  </div>
);

/* ─── Watch Demo Modal ────────────────────────────────────── */
const WatchDemoModal = ({ t, onClose }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
      background: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(8px)",
      animation: "spdFadeIn 0.2s ease",
    }}
    onClick={onClose}
  >
    <div
      style={{
        background: t.phoneBg,
        border: `1px solid ${t.border}`,
        borderRadius: 20,
        overflow: "hidden",
        width: "100%",
        maxWidth: 800,
        boxShadow: `0 40px 100px rgba(0,0,0,0.5)`,
        animation: "spdSlideUp 0.28s ease",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 22px", borderBottom: `1px solid ${t.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="12" height="12" fill={t.accentTx} viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>Spendora — Personal Expense Tracker</div>
            <div style={{ fontSize: 11, color: t.textDim }}>See how AI tracks your expenses automatically</div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 32, height: 32, borderRadius: "50%", border: `1px solid ${t.border}`,
            background: t.pillBg, color: t.textSub, display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", fontSize: 16, transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = t.pillHov; e.currentTarget.style.color = t.text; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = t.pillBg; e.currentTarget.style.color = t.textSub; }}
          aria-label="Close demo"
        >✕</button>
      </div>
      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
        <iframe
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0"
          title="Spendora — Personal Expense Tracker Demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div style={{ padding: "14px 22px", borderTop: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 12, color: t.textDim }}>🎬 Full walkthrough · ~3 min</span>
        <span style={{ fontSize: 12, color: t.textDim }}>
          Press <kbd style={{ padding: "2px 6px", borderRadius: 5, border: `1px solid ${t.border}`, background: t.pillBg, color: t.textSub, fontSize: 11 }}>Esc</kbd> to close
        </span>
      </div>
    </div>
  </div>
);

/* ─── Back Phone ──────────────────────────────────────────── */
const BackPhone = ({ t }) => (
  <div
    style={{
      position: "absolute", right: "-58%", bottom: "-5%",
      width: "82%", height: "82%", borderRadius: 28,
      background: t.phoneBg2, border: `1px solid ${t.border}`,
      boxShadow: `0 22px 60px ${t.shadow}`,
      transform: "rotate(18deg)", overflow: "hidden", padding: "20px 14px",
    }}
  >
    <div style={{ fontSize: 10, color: t.textDim, marginBottom: 3 }}>Transactions</div>
    <div style={{ fontSize: 16, fontWeight: 800, color: t.text, marginBottom: 10 }}>$4,924.35</div>
    <svg viewBox="0 0 200 52" style={{ width: "100%", height: 42 }} fill="none">
      <path d="M0 40 L28 30 L58 36 L88 16 L118 26 L148 10 L178 20 L200 6 L200 52 L0 52 Z" fill={t.accent} opacity="0.12" />
      <path d="M0 40 L28 30 L58 36 L88 16 L118 26 L148 10 L178 20 L200 6" stroke={t.accent} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
      {[{ label: "Net Income", val: "$24M", color: t.text }, { label: "Net Spend", val: "$8,500", color: t.textSub }].map((s) => (
        <div key={s.label} style={{ flex: 1, background: t.pillBg, borderRadius: 9, padding: 8 }}>
          <div style={{ fontSize: 9, color: t.textDim }}>{s.label}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: s.color }}>{s.val}</div>
        </div>
      ))}
    </div>
  </div>
);

/* ─── User Avatar (phone top-right) ──────────────────────── */
/**
 * Shows:
 *  • user.photoURL  → circular <img>
 *  • user.loggedIn  → initials pill (accent bg)
 *  • guest          → ghost icon (muted bg)
 */
const PhoneAvatar = ({ t, user }) => {
  const size = 29;

  /* ── Case 1: has a photo ── */
  if (user?.loggedIn && user?.photoURL) {
    return (
      <div
        style={{
          width: size, height: size, borderRadius: "50%",
          overflow: "hidden", border: `1.5px solid ${t.accent}`,
          flexShrink: 0,
        }}
      >
        <img
          src={user.photoURL}
          alt={user.name || "User"}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            /* fallback to initials if image fails to load */
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement.setAttribute("data-fallback", "true");
          }}
        />
      </div>
    );
  }

  /* ── Case 2: logged in but no photo → initials ── */
  if (user?.loggedIn) {
    const initials = user.name
      ? user.name.trim().split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()
      : "U";
    return (
      <div
        style={{
          width: size, height: size, borderRadius: "50%",
          background: t.accent, color: t.accentTx,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 9, fontWeight: 800, flexShrink: 0,
          border: `1.5px solid ${t.accent}`,
        }}
      >
        {initials}
      </div>
    );
  }

  /* ── Case 3: guest → ghost person icon ── */
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        background: t.pillInner, color: t.textDim,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, border: `1px dashed ${t.border}`,
      }}
    >
      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
  );
};

/* ─── Mobile Banner User Card ─────────────────────────────── */
/**
 * Shown ONLY on mobile (below md breakpoint) above the hero text.
 * Logged in  → avatar + "Welcome back, {name}"
 * Guest      → ghost icon + "Hello, Guest"
 */
const MobileBannerUserCard = ({ t, user }) => {
  const isLoggedIn = user?.loggedIn;
  const displayName = isLoggedIn ? (user?.name || "User") : "Guest";

  return (
    <div
      className="spd-mobile-user"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 14,
        background: t.pillInner,
        border: `1px solid ${t.border}`,
        width: "fit-content",
        maxWidth: "100%",
      }}
    >
      {/* Avatar */}
      {isLoggedIn && user?.photoURL ? (
        <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", border: `2px solid ${t.accent}`, flexShrink: 0 }}>
          <img
            src={user.photoURL}
            alt={user.name || "User"}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      ) : isLoggedIn ? (
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: t.accent, color: t.accentTx,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 800, flexShrink: 0,
        }}>
          {(user?.name || "U").trim().split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
        </div>
      ) : (
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: t.pillBg, color: t.textDim,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, border: `1px dashed ${t.border}`,
        }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}

      {/* Text */}
      <div>
        <div style={{ fontSize: 10, color: t.textDim, lineHeight: 1.2 }}>
          {isLoggedIn ? "Welcome back," : "Hello,"}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: t.text, lineHeight: 1.3 }}>
          {displayName}
        </div>
      </div>

      {/* Online dot — only for logged-in */}
      {isLoggedIn && (
        <div style={{
          marginLeft: "auto",
          width: 8, height: 8, borderRadius: "50%",
          background: "#22c55e",
          boxShadow: "0 0 0 2px rgba(34,197,94,0.25)",
          animation: "spdPulse 2.2s ease-in-out infinite",
          flexShrink: 0,
        }} />
      )}
    </div>
  );
};

/* ─── Front Phone ─────────────────────────────────────────── */
const FrontPhone = ({ t, user }) => {
  const TxRow = ({ name, amt, pos }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: t.rowInner, borderRadius: 9, padding: "6px 8px", marginBottom: 5 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <div style={{ width: 20, height: 20, borderRadius: 6, background: t.pillInner, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: pos ? t.accent : t.textDim }} />
        </div>
        <span style={{ fontSize: 9, color: t.textSub }}>{name}</span>
      </div>
      <span style={{ fontSize: 9, fontWeight: 700, color: pos ? t.text : t.textSub }}>{amt}</span>
    </div>
  );

  return (
    <div style={{ position: "absolute", inset: 0, borderRadius: 32, background: t.phoneBg, border: `1px solid ${t.border}`, boxShadow: `0 32px 80px ${t.shadow}`, overflow: "hidden", zIndex: 10 }}>
      {/* Notch */}
      <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 64, height: 16, borderRadius: 99, background: t.notchBg, zIndex: 20 }} />

      <div style={{ padding: "44px 13px 52px", height: "100%", display: "flex", flexDirection: "column", gap: 9, overflow: "hidden" }}>

        {/* ── Header row: greeting + dynamic avatar ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 9, color: t.textDim }}>
              {user?.loggedIn ? "Welcome back," : "Hello,"}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: t.text }}>
              {user?.loggedIn ? (user.name || "User") : "Guest User"}
            </div>
          </div>

          {/* Dynamic avatar — image / initials / ghost */}
          <PhoneAvatar t={t} user={user} />
        </div>

        {/* Search bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: t.pillInner, borderRadius: 9, padding: "7px 10px" }}>
          <svg width="10" height="10" fill="none" stroke={t.textDim} strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 9, color: t.textDim }}>Search...</span>
        </div>

        {/* Income card */}
        <div style={{ background: t.pillInner, borderRadius: 12, padding: "10px 11px" }}>
          <div style={{ fontSize: 9, color: t.textDim, marginBottom: 2 }}>Income</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: t.text, marginBottom: 6 }}>
            {user?.loggedIn ? (user.income || "$0") : "--"}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {["Food", "Shopping", "Sport", "Entertainment"].map((c) => (
              <span key={c} style={{ fontSize: 8, padding: "2px 7px", borderRadius: 999, background: t.pillBg, color: t.textSub }}>{c}</span>
            ))}
          </div>
        </div>

        {/* Donut chart */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg width="76" height="76" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="33" fill="none" stroke={t.phoneBg2} strokeWidth="11" />
            <circle cx="50" cy="50" r="33" fill="none" stroke={t.accent} strokeWidth="11" strokeDasharray="83 124" strokeLinecap="round" transform="rotate(-90 50 50)" opacity="0.9" />
            <circle cx="50" cy="50" r="33" fill="none" stroke={t.accent} strokeWidth="11" strokeDasharray="42 165" strokeDashoffset="-83" strokeLinecap="round" transform="rotate(-90 50 50)" opacity="0.45" />
            <circle cx="50" cy="50" r="33" fill="none" stroke={t.accent} strokeWidth="11" strokeDasharray="28 179" strokeDashoffset="-125" strokeLinecap="round" transform="rotate(-90 50 50)" opacity="0.2" />
            <text x="50" y="46" textAnchor="middle" fill={t.textDim} fontSize="7.5">January</text>
            <text x="50" y="56" textAnchor="middle" fill={t.text} fontSize="10.5" fontWeight="800">$3,018</text>
          </svg>
        </div>

        {/* Transactions */}
        <div>
          <div style={{ fontSize: 9, color: t.textDim, marginBottom: 5 }}>Transactions</div>
          <TxRow name="Pizza Hut" amt="+$15" pos />
          <TxRow name="Spotify" amt="-$9" pos={false} />
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, borderTop: `1px solid ${t.border}`, padding: "7px 13px 10px", display: "flex", justifyContent: "space-around", background: t.phoneBg2 }}>
        {["Home", "Stats", "Card", "Settings"].map((item, i) => (
          <div key={item} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: i === 0 ? t.accent : t.textDim }}>
            <div style={{ width: 13, height: 13, borderRadius: 4, background: "currentColor", opacity: i === 0 ? 0.9 : 0.4 }} />
            <span style={{ fontSize: 7 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Banner (default export) ─────────────────────────────── */
export default function Banner({ user }) {
  const { t } = useTheme();
  const navigate = useNavigate();
  const orb1 = useRef(null);
  const orb2 = useRef(null);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const resolvedUser = user ?? {
    loggedIn: true,
    name: "Mahiya Rahman",
    income: "$8,500",
    photoURL: null,           // set a real URL or null to use initials
  };

  /* ── Orb parallax ── */
  useEffect(() => {
    const fn = (e) => {
      const xR = e.clientX / window.innerWidth;
      const yR = e.clientY / window.innerHeight;
      if (orb1.current) orb1.current.style.transform = `translate(${xR * 24}px,${yR * 14}px)`;
      if (orb2.current) orb2.current.style.transform = `translate(${-xR * 18}px,${-yR * 12}px)`;
    };
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  /* ── Keyboard: close modals on Escape ── */
  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") {
        setShowLoginModal(false);
        setShowDemoModal(false);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  /* ── Handlers ── */
  const handleGetStarted = () => {
    if (resolvedUser?.loggedIn) {
      navigate("/dashboardLayout/add-expense");
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLogin = () => {
    setShowLoginModal(false);
    navigate("/login");
  };

  return (
    <>
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          background: t.pageBg,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          transition: "background 0.4s",
        }}
      >
        {/* ── Background ── */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden>
          <div ref={orb1} style={{ position: "absolute", top: "8%", left: "-5%", width: "clamp(220px,32vw,440px)", height: "clamp(220px,32vw,440px)", borderRadius: "50%", background: t.orb, filter: "blur(90px)", transition: "transform 0.8s ease-out" }} />
          <div ref={orb2} style={{ position: "absolute", bottom: "4%", right: "-5%", width: "clamp(180px,26vw,360px)", height: "clamp(180px,26vw,360px)", borderRadius: "50%", background: t.orb2, filter: "blur(80px)", transition: "transform 0.8s ease-out" }} />
          <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />
          <div style={{ position: "absolute", bottom: 24, right: 0, fontSize: "clamp(44px,7vw,105px)", fontWeight: 900, color: t.watermark, lineHeight: 1, letterSpacing: "0.12em", whiteSpace: "nowrap", userSelect: "none" }}>
            SMART SPEND
          </div>
        </div>

        {/* ── Hero grid ── */}
        <div className="spd-grid">
          {/* LEFT */}
          <div className="spd-left">
            {/* ── Mobile-only user greeting card ── */}
            <MobileBannerUserCard t={t} user={resolvedUser} />

            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, width: "fit-content", padding: "7px 15px", borderRadius: 999, border: `1px solid ${t.badgeBd}`, background: t.badge }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.accent, display: "block", animation: "spdPulse 2.2s ease-in-out infinite" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: t.badgeTx, letterSpacing: "0.13em", textTransform: "uppercase" }}>
                AI-Powered Finance
              </span>
            </div>

            {/* Headline */}
            <h1 className="spd-h1" style={{ color: t.text }}>
              Track every<br />expense with<br />
              <span style={{ color: t.textSub }}>precision.</span>
            </h1>

            {/* Description */}
            <p style={{ color: t.textSub, fontSize: 16, lineHeight: 1.75, maxWidth: 450, margin: 0 }}>
              Spendora is your intelligent financial companion — powered by AI to analyze, predict, and optimize your personal expenses automatically.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14 }}>
              <button
                onClick={handleGetStarted}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "13px 26px", borderRadius: 13, background: t.accent, color: t.accentTx, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", transition: "transform 0.2s, opacity 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.opacity = "0.9"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.opacity = "1"; }}
              >
                Get Started
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              <button
                onClick={() => setShowDemoModal(true)}
                style={{ display: "inline-flex", alignItems: "center", gap: 11, padding: "11px 20px", borderRadius: 13, border: `1px solid ${t.border}`, color: t.textSub, fontSize: 14, fontWeight: 500, background: "transparent", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = t.text; e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.background = t.hoverBg; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = t.textSub; e.currentTarget.style.borderColor = t.border; e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${t.border}`, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="11" height="11" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </span>
                Watch Demo
              </button>
            </div>

            {/* Store buttons */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {STORES.map((s, i) => (
                <button
                  key={i}
                  style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "9px 15px", borderRadius: 11, border: `1px solid ${t.border}`, background: t.pillBg, color: t.text, cursor: "pointer", transition: "background 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = t.pillHov; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = t.pillBg; }}
                >
                  {s.icon()}
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 10, color: t.textSub, lineHeight: 1.3 }}>{s.label}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: t.text, lineHeight: 1.3 }}>{s.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT — phones */}
          <div className="spd-right">
            <div style={{ position: "absolute", top: 8, right: 16, zIndex: 20, width: 84, height: 84, borderRadius: "50%", border: `1px solid ${t.border}`, background: t.phoneBg2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 20, fontWeight: 900, color: t.text, lineHeight: 1 }}>20M</span>
              <span style={{ fontSize: 9, color: t.textSub, textAlign: "center", marginTop: 2 }}>Users trust us</span>
            </div>

            <div className="spd-phones" style={{ transform: "translateX(-20px) rotate(-10deg)", transformOrigin: "center" }}>
              <BackPhone t={t} />
              <FrontPhone t={t} user={resolvedUser} />
            </div>
          </div>
        </div>

        {/* ── Styles ── */}
        <style>{`
          @keyframes spdPulse  { 0%,100%{opacity:1} 50%{opacity:0.3} }
          @keyframes spdFadeIn { from{opacity:0} to{opacity:1} }
          @keyframes spdSlideUp{ from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

          .spd-grid {
            position: relative; z-index: 10;
            width: 100%; max-width: 1280px;
            margin: 0 auto;
            padding: 120px 32px 72px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 48px;
            align-items: center;
            box-sizing: border-box;
          }
          .spd-left  { display: flex; flex-direction: column; gap: 28px; }
          .spd-h1    { font-size: clamp(34px,4.8vw,64px); font-weight:900; line-height:1.06; letter-spacing:-0.03em; margin:0; }
          .spd-right { position:relative; display:flex; align-items:center; justify-content:center; min-height:500px; }
          .spd-phones{ position:relative; width:min(320px,90%); aspect-ratio:320/480; }

          /* Mobile user card: hidden on desktop, visible on mobile */
          .spd-mobile-user { display: none; }

          @media (max-width: 1023px) {
            .spd-grid   { padding-top:100px; gap:32px; }
            .spd-phones { width:min(270px,88%); }
            .spd-right  { min-height:420px; }
          }

          @media (max-width: 767px) {
            .spd-grid {
              grid-template-columns: 1fr;
              padding-top: 88px; padding-bottom: 56px; gap: 36px;
            }
            .spd-left  { align-items:center; text-align:center; order:1; }
            .spd-left p { text-align:center; }
            .spd-right { order:2; justify-content:center; min-height:340px; }
            .spd-phones { width:min(290px,80vw); }

            /* Show mobile user card only on mobile */
            .spd-mobile-user { display: flex !important; }
          }

          @media (max-width: 479px) {
            .spd-grid   { padding-left:16px; padding-right:16px; }
            .spd-h1     { font-size:clamp(28px,8vw,36px) !important; }
            .spd-phones { width:min(250px,76vw); }
            .spd-right  { min-height:290px; }
          }
        `}</style>
      </section>

      {showLoginModal && <LoginPromptModal t={t} onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />}
      {showDemoModal  && <WatchDemoModal  t={t} onClose={() => setShowDemoModal(false)} />}
    </>
  );
}