import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { label: "Home", to: "/", type: "route" },
  { label: "Services", to: "/services", type: "route" },
  { label: "Features", to: "/features", type: "route" },
  { label: "Recent Trans.", to: "/payments", type: "route" },
  { label: "Dashboard", to: "/dashboardLayout", type: "route" },
  { label: "About us", to: "/about", type: "route" },
];

/* ─── Logo ─────────────────────────────────────────────────── */
function Logo({ onClick }) {
  const { t } = useTheme();
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexShrink: 0,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 0,
      }}
      aria-label="Go to homepage"
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: t.accent,
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.07)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#ffffff" />
          <path
            d="M2 17l10 5 10-5M2 12l10 5 10-5"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span
        style={{
          fontSize: 20,
          fontWeight: 900,
          letterSpacing: "-0.5px",
          color: t.text,
          userSelect: "none",
        }}
      >
        Spend<span style={{ color: t.accent, opacity: 0.85 }}>ora</span>
      </span>
    </button>
  );
}

/* ─── Theme Toggle ──────────────────────────────────────────── */
function ThemeToggle({ mobile = false }) {
  const { dark, toggle, t } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      style={{
        display: "flex",
        alignItems: "center",
        gap: mobile ? 8 : 6,
        padding: mobile ? "10px 16px" : "6px 12px",
        borderRadius: 999,
        cursor: "pointer",
        transition: "background 0.2s",
        border: dark
          ? "1px solid rgba(255,255,255,0.15)"
          : "1px solid rgba(0,0,0,0.12)",
        background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
        color: t.textSub,
        width: mobile ? "100%" : "auto",
        justifyContent: mobile ? "center" : "flex-start",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = dark
          ? "rgba(255,255,255,0.11)"
          : "rgba(0,0,0,0.08)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = dark
          ? "rgba(255,255,255,0.06)"
          : "rgba(0,0,0,0.04)")
      }
    >
      <span style={{ fontSize: 14, lineHeight: 1 }}>{dark ? "🌑" : "🔆"}</span>

      <span
        style={{
          position: "relative",
          display: "inline-flex",
          borderRadius: 999,
          flexShrink: 0,
          width: 32,
          height: 17,
          background: dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)",
          border: dark
            ? "1px solid rgba(255,255,255,0.18)"
            : "1px solid rgba(0,0,0,0.12)",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            borderRadius: "50%",
            transition: "left 0.3s",
            left: dark ? "calc(100% - 14px)" : 2,
            width: 11,
            height: 11,
            background: dark ? "#ffffff" : t.accent,
          }}
        />
      </span>

      <span
        style={{
          fontSize: mobile ? 12 : 10,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: t.textSub,
        }}
      >
        {dark ? "Dark" : "Light"}
      </span>
    </button>
  );
}

/* ─── Hamburger ─────────────────────────────────────────────── */
function Hamburger({ open, t }) {
  return (
    <span style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            display: "block",
            width: 22,
            height: 2,
            borderRadius: 2,
            background: t.text,
            transition: "all 0.3s",
            transform: open
              ? i === 0
                ? "rotate(45deg) translate(5px,5px)"
                : i === 2
                ? "rotate(-45deg) translate(5px,-5px)"
                : "scaleX(0)"
              : "none",
            opacity: open && i === 1 ? 0 : 1,
          }}
        />
      ))}
    </span>
  );
}

/* ─── User Avatar ───────────────────────────────────────────── */
function UserAvatar({ user, t, size = 32 }) {
  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontSize: size * 0.35,
        fontWeight: 700,
        color: "#fff",
        background: t.accent,
        overflow: "hidden",
        userSelect: "none",
      }}
      title={user?.displayName || user?.email}
    >
      {user?.photoURL ? (
        <img src={user.photoURL} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        initials
      )}
    </div>
  );
}

/* ─── Navbar ────────────────────────────────────────────────── */
export default function Navbar() {
  const { dark, t } = useTheme();
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);   // < 768 px
  const [isTablet, setIsTablet] = useState(false);   // 768–1023 px

  const activeIndex = NAV_LINKS.findIndex(
    (lnk) => lnk.type === "route" && location.pathname === lnk.to
  );

  /* ── Breakpoint detection ── */
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setIsTablet(w >= 768 && w < 1024);
      if (w >= 768) setMenuOpen(false);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* ── Scroll detection ── */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* ── Close menu on route change ── */
  useEffect(() => setMenuOpen(false), [location.pathname]);

  /* ── Prevent body scroll when mobile menu is open ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const showBg = scrolled || menuOpen;

  function handleNavClick(e, item) {
    e.preventDefault();
    setMenuOpen(false);
    if (item.type === "route") {
      navigate(item.to);
      return;
    }
    const scrollToSection = () => {
      const el = document.getElementById(item.id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(scrollToSection, 300);
    } else {
      scrollToSection();
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logOut();
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setLoggingOut(false);
      setMenuOpen(false);
    }
  }

  /* ── Tablet: only show 4 key links to avoid overflow ── */
  const visibleLinks = isTablet
    ? NAV_LINKS.filter((l) => ["Home", "Features", "Dashboard", "About us"].includes(l.label))
    : NAV_LINKS;

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "all 0.3s",
          background: showBg ? t.navBg : "transparent",
          backdropFilter: showBg ? "blur(24px) saturate(1.4)" : "none",
          WebkitBackdropFilter: showBg ? "blur(24px) saturate(1.4)" : "none",
          borderBottom: `1px solid ${scrolled ? t.borderLight : "transparent"}`,
          boxShadow: scrolled
            ? dark ? "0 6px 32px rgba(0,0,0,0.55)" : "0 6px 24px rgba(0,0,0,0.08)"
            : "none",
        }}
      >
        {/* ── Top Bar ── */}
        <div
          style={{
            width: "100%",
            maxWidth: 1600,
            margin: "0 auto",
            padding: isMobile ? "0 16px" : isTablet ? "0 24px" : "0 40px",
            height: isMobile ? 60 : 68,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            boxSizing: "border-box",
          }}
        >
          {/* Logo */}
          <Logo onClick={() => { navigate("/"); window.scrollTo({ top: 0, behavior: "smooth" }); }} />

          {/* Desktop / Tablet links (hidden on mobile) */}
          {!isMobile && (
            <ul
              style={{
                display: "flex",
                alignItems: "center",
                gap: isTablet ? 2 : 2,
                listStyle: "none",
                margin: 0,
                padding: 0,
                flex: 1,
                justifyContent: "center",
                flexWrap: "nowrap",
              }}
            >
              {visibleLinks.map((lnk, i) => {
                const globalIdx = NAV_LINKS.indexOf(lnk);
                const isActive = globalIdx === activeIndex;
                return (
                  <li key={lnk.label}>
                    <a
                      href={lnk.type === "route" ? lnk.to : `#${lnk.id}`}
                      onClick={(e) => handleNavClick(e, lnk)}
                      style={{
                        position: "relative",
                        display: "block",
                        padding: isTablet ? "7px 10px" : "8px 14px",
                        borderRadius: 10,
                        textDecoration: "none",
                        transition: "all 0.2s",
                        whiteSpace: "nowrap",
                        fontWeight: 500,
                        fontSize: isTablet ? 13 : 14,
                        color: isActive ? t.text : t.textSub,
                        background: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = t.text;
                        e.currentTarget.style.background = t.hoverBg;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = isActive ? t.text : t.textSub;
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {lnk.label}
                      {isActive && (
                        <span
                          style={{
                            position: "absolute",
                            bottom: 4,
                            left: "50%",
                            transform: "translateX(-50%)",
                            display: "block",
                            width: 14,
                            height: 2,
                            borderRadius: 999,
                            background: t.accent,
                          }}
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Right section */}
          <div style={{ display: "flex", alignItems: "center", gap: isTablet ? 8 : 10, flexShrink: 0 }}>
            {/* Theme toggle — hidden on mobile (shown in drawer instead) */}
            {!isMobile && <ThemeToggle />}

            {/* Auth — desktop & tablet */}
            {!isMobile && (
              user ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <UserAvatar user={user} t={t} />
                  {!isTablet && (
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        maxWidth: 110,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: t.textSub,
                      }}
                      title={user.displayName || user.email}
                    >
                      {user.displayName?.split(" ")[0] || user.email?.split("@")[0]}
                    </span>
                  )}
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    style={{
                      padding: isTablet ? "6px 12px" : "8px 16px",
                      fontSize: 13,
                      fontWeight: 600,
                      borderRadius: 10,
                      border: `1px solid ${t.accent}`,
                      color: t.accent,
                      background: "transparent",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      opacity: loggingOut ? 0.6 : 1,
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = t.accent; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = t.accent; }}
                  >
                    {loggingOut ? "Signing out…" : "Logout"}
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button
                    onClick={() => navigate("/login")}
                    style={{
                      padding: isTablet ? "6px 10px" : "8px 14px",
                      fontSize: 13,
                      fontWeight: 500,
                      borderRadius: 10,
                      border: "none",
                      color: t.textSub,
                      background: "transparent",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = t.text; e.currentTarget.style.background = t.hoverBg; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = t.textSub; e.currentTarget.style.background = "transparent"; }}
                  >
                    Login
                  </button>
                  {/* <button
                    onClick={() => navigate("/register")}
                    style={{
                      padding: isTablet ? "7px 14px" : "8px 20px",
                      fontSize: 13,
                      fontWeight: 700,
                      borderRadius: 11,
                      border: "none",
                      background: t.accent,
                      color: "#fff",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "scale(1.04)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
                  >
                    Sign up
                  </button> */}
                </div>
              )
            )}

            {/* Hamburger — mobile only */}
            {isMobile && (
              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 6,
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  background: "transparent",
                  flexShrink: 0,
                }}
              >
                <Hamburger open={menuOpen} t={t} />
              </button>
            )}
          </div>
        </div>

        {/* ── Tablet: secondary row with remaining links ── */}
        {isTablet && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              padding: "4px 24px 8px",
              borderTop: `1px solid ${t.borderLight}`,
            }}
          >
            {NAV_LINKS.filter((l) => !["Home", "Features", "Dashboard", "About us"].includes(l.label)).map((lnk) => {
              const globalIdx = NAV_LINKS.indexOf(lnk);
              const isActive = globalIdx === activeIndex;
              return (
                <a
                  key={lnk.label}
                  href={lnk.type === "route" ? lnk.to : `#${lnk.id}`}
                  onClick={(e) => handleNavClick(e, lnk)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 999,
                    textDecoration: "none",
                    fontSize: 12,
                    fontWeight: 600,
                    transition: "all 0.2s",
                    color: isActive ? t.accentTx : t.textSub,
                    background: isActive ? t.accent : t.pillBg,
                    border: `1px solid ${isActive ? t.accent : t.border}`,
                    letterSpacing: "0.02em",
                  }}
                >
                  {lnk.label}
                </a>
              );
            })}
          </div>
        )}
      </nav>

      {/* ── Mobile Drawer overlay ── */}
      {isMobile && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 40,
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(2px)",
              opacity: menuOpen ? 1 : 0,
              pointerEvents: menuOpen ? "auto" : "none",
              transition: "opacity 0.3s",
            }}
          />

          {/* Drawer */}
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 49,
              width: "min(320px, 88vw)",
              background: t.navBg,
              backdropFilter: "blur(32px) saturate(1.6)",
              WebkitBackdropFilter: "blur(32px) saturate(1.6)",
              borderLeft: `1px solid ${t.borderLight}`,
              display: "flex",
              flexDirection: "column",
              transform: menuOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
              boxShadow: menuOpen ? "-20px 0 60px rgba(0,0,0,0.3)" : "none",
              overflowY: "auto",
            }}
          >
            {/* Drawer header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 20px",
                borderBottom: `1px solid ${t.borderLight}`,
                flexShrink: 0,
              }}
            >
              <Logo onClick={() => { navigate("/"); setMenuOpen(false); }} />
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: `1px solid ${t.border}`,
                  background: t.pillBg,
                  color: t.textSub,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: 16,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = t.pillHov; e.currentTarget.style.color = t.text; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = t.pillBg; e.currentTarget.style.color = t.textSub; }}
              >
                ✕
              </button>
            </div>

            {/* User info strip */}
            {user && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "16px 20px",
                  borderBottom: `1px solid ${t.borderLight}`,
                  flexShrink: 0,
                }}
              >
                <UserAvatar user={user} t={t} size={40} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.displayName || "User"}
                  </div>
                  <div style={{ fontSize: 12, color: t.textSub, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.email}
                  </div>
                </div>
              </div>
            )}

            {/* Nav links */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "8px 0" }}>
              {NAV_LINKS.map((lnk, i) => {
                const isActive = i === activeIndex;
                return (
                  <a
                    key={lnk.label}
                    href={lnk.type === "route" ? lnk.to : `#${lnk.id}`}
                    onClick={(e) => handleNavClick(e, lnk)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "14px 20px",
                      textDecoration: "none",
                      transition: "all 0.18s",
                      fontSize: 15,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? t.text : t.textSub,
                      background: isActive
                        ? dark ? "rgba(225,29,72,0.1)" : "rgba(225,29,72,0.06)"
                        : "transparent",
                      borderLeft: `3px solid ${isActive ? t.accent : "transparent"}`,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = t.hoverBg;
                        e.currentTarget.style.color = t.text;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = t.textSub;
                      }
                    }}
                  >
                    {/* Dot indicator */}
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: isActive ? t.accent : t.textDim,
                        opacity: isActive ? 1 : 0.4,
                        transition: "all 0.2s",
                      }}
                    />
                    {lnk.label}
                    {lnk.label === "Dashboard" && (
                      <span
                        style={{
                          marginLeft: "auto",
                          fontSize: 9,
                          fontWeight: 800,
                          letterSpacing: "0.1em",
                          padding: "2px 6px",
                          borderRadius: 4,
                          background: t.pillBg,
                          color: t.accent,
                          border: `1px solid ${t.border}`,
                        }}
                      >
                        APP
                      </span>
                    )}
                  </a>
                );
              })}
            </div>

            {/* Bottom section */}
            <div
              style={{
                padding: "16px 20px 32px",
                borderTop: `1px solid ${t.borderLight}`,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                flexShrink: 0,
              }}
            >
              <ThemeToggle mobile />

              {user ? (
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: 14,
                    fontWeight: 700,
                    borderRadius: 12,
                    border: "none",
                    background: t.accent,
                    color: "#fff",
                    cursor: "pointer",
                    transition: "opacity 0.2s",
                    opacity: loggingOut ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  {loggingOut ? "Signing out…" : "Logout"}
                </button>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button
                    onClick={() => { setMenuOpen(false); navigate("/login"); }}
                    style={{
                      width: "100%",
                      padding: "12px",
                      fontSize: 14,
                      fontWeight: 600,
                      borderRadius: 12,
                      border: `1px solid ${t.border}`,
                      color: t.textSub,
                      background: "transparent",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.text; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSub; }}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); navigate("/register"); }}
                    style={{
                      width: "100%",
                      padding: "12px",
                      fontSize: 14,
                      fontWeight: 700,
                      borderRadius: 12,
                      border: "none",
                      background: t.accent,
                      color: "#fff",
                      cursor: "pointer",
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}