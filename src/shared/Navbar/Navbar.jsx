import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useTheme } from "../../context/ThemeContext";

const NAV_LINKS = [
  { label: "Home", to: "/", type: "route" },
  { label: "Services", to: "/services", type: "route" },
  { label: "Features", to: "/features", type: "route" },
  { label: "Payments", to: "/payments", type: "route" },
  { label: "Dashboard", to: "/dashboardLayout", type: "route" },
  { label: "About us", to: "/about", type: "route" },
];

function Logo({ onClick }) {
  const { dark, t } = useTheme();
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 flex-shrink-0 bg-transparent border-none cursor-pointer p-0"
      aria-label="Go to homepage"
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 hover:scale-105"
        style={{ background: t.accent }}
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
        className="text-xl font-extrabold tracking-tight select-none"
        style={{ color: t.text, letterSpacing: "-0.5px" }}
      >
        Spend
        <span style={{ color: t.accent, opacity: 0.8 }}>ora</span>
      </span>
    </button>
  );
}

function ThemeToggle({ mobile = false }) {
  const { dark, toggle, t } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={[
        "flex items-center gap-2 rounded-full cursor-pointer transition-all duration-200",
        mobile
          ? "w-full justify-center px-4 py-2.5 text-sm font-semibold"
          : "px-3 py-1.5 text-xs font-semibold",
      ].join(" ")}
      style={{
        border: dark
          ? "1px solid rgba(255,255,255,0.15)"
          : "1px solid rgba(0,0,0,0.12)",
        background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
        color: t.textSub,
      }}
      onMouseEnter={e =>
        (e.currentTarget.style.background = dark
          ? "rgba(255,255,255,0.11)"
          : "rgba(0,0,0,0.08)")
      }
      onMouseLeave={e =>
        (e.currentTarget.style.background = dark
          ? "rgba(255,255,255,0.06)"
          : "rgba(0,0,0,0.04)")
      }
    >
      <span className="text-sm leading-none">{dark ? "🌑" : "🔆"}</span>

      {/* toggle track */}
      <span
        className="relative inline-flex rounded-full flex-shrink-0"
        style={{
          width: 32,
          height: 17,
          background: dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)",
          border: dark
            ? "1px solid rgba(255,255,255,0.18)"
            : "1px solid rgba(0,0,0,0.12)",
        }}
      >
        {/* knob */}
        <span
          className="absolute top-0.5 rounded-full transition-all duration-300"
          style={{
            left:       dark ? "calc(100% - 14px)" : 2,
            width:      12,
            height:     12,
            background: dark ? "#ffffff" : t.accent,
          }}
        />
      </span>

      <span
        className="uppercase tracking-widest"
        style={{ fontSize: mobile ? 12 : 10, color: t.textSub }}
      >
        {dark ? "Dark" : "Light"}
      </span>
    </button>
  );
}

/* ─── Hamburger ───────────────────────────────────────────── */
function Hamburger({ open }) {
  const { t } = useTheme();
  return (
    <span className="flex flex-col gap-1.5">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="block rounded-sm transition-all duration-300"
          style={{
            width:     23,
            height:    2,
            background: t.text,
            transform: open
              ? i === 0 ? "rotate(45deg) translate(5px,5px)"
              : i === 2 ? "rotate(-45deg) translate(5px,-5px)"
              : "scaleX(0)"
              : "none",
            opacity: open && i === 1 ? 0 : 1,
          }}
        />
      ))}
    </span>
  );
}

export default function Navbar() {
  const { dark, t }  = useTheme();
  const navigate     = useNavigate();
  const location     = useLocation();

  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  /* derive active index from current route */
const activeIndex = NAV_LINKS.findIndex(
  (lnk) => lnk.type === "route" && location.pathname === lnk.to
);

  /* scroll listener */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* close mobile menu on resize ≥ md */
  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  /* close menu on route change */
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const showBg = scrolled || menuOpen;

  /* ── unified click handler ── */
function handleNavClick(e, item) {
  e.preventDefault();
  setMenuOpen(false);

  if (item.type === "route") {
    navigate(item.to);
    return;
  }

  const scrollToSection = () => {
    const el = document.getElementById(item.id);

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (location.pathname !== "/") {
    navigate("/");

    setTimeout(() => {
      scrollToSection();
    }, 300);
  } else {
    scrollToSection();
  }
}

  /* nav link style helper */
  function linkStyle(i) {
    return {
      color:      i === activeIndex ? t.text : t.textSub,
      background: "transparent",
      fontSize:   14,
    };
  }

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background:           showBg ? t.navBg : "transparent",
          backdropFilter:       showBg ? "blur(24px) saturate(1.4)" : "none",
          WebkitBackdropFilter: showBg ? "blur(24px) saturate(1.4)" : "none",
          borderBottom:        `1px solid ${scrolled ? t.borderLight : "transparent"}`,
          boxShadow: scrolled
            ? dark ? "0 6px 32px rgba(0,0,0,0.55)" : "0 6px 24px rgba(0,0,0,0.08)"
            : "none",
        }}
      >
        {/* ── Top row ── */}
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 h-[68px] flex items-center justify-between gap-3">

          {/* Logo */}
          <Logo
            onClick={() => {
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />

          {/* Desktop links — hidden below md */}
          <ul className="hidden md:flex items-center gap-0.5 list-none m-0 p-0 flex-1 justify-center">
            {NAV_LINKS.map((lnk, i) => (
              <li key={lnk.label}>
                <a
                href={lnk.type === "route" ? lnk.to : `#${lnk.id}`}
                  onClick={e => handleNavClick(e, lnk, i)}
                  className="relative block px-3.5 py-2 rounded-lg no-underline transition-all duration-200 whitespace-nowrap font-medium"
                  style={linkStyle(i)}
                  onMouseEnter={e => {
                    e.currentTarget.style.color      = t.text;
                    e.currentTarget.style.background = t.hoverBg;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color      = i === activeIndex ? t.text : t.textSub;
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {lnk.label}

                  {/* active underline dot */}
                  {i === activeIndex && (
                    <span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 block rounded-full"
                      style={{ width: 16, height: 2, background: t.accent }}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop right — hidden below md */}
          <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
            <ThemeToggle />

            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-sm font-medium rounded-lg border-none cursor-pointer transition-all duration-200"
              style={{ color: t.textSub, background: "transparent" }}
              onMouseEnter={e => {
                e.currentTarget.style.color      = t.text;
                e.currentTarget.style.background = t.hoverBg;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color      = t.textSub;
                e.currentTarget.style.background = "transparent";
              }}
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="px-5 py-2 text-sm font-bold rounded-xl border-none cursor-pointer whitespace-nowrap transition-all duration-200"
              style={{ background: t.accent, color: "#ffffff" }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "scale(1.04)";
                e.currentTarget.style.opacity   = "0.9";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.opacity   = "1";
              }}
            >
              Sign up
            </button>
          </div>

          {/* Hamburger — visible below md */}
          <button
            className="md:hidden flex items-center justify-center p-1.5 rounded-lg border-none cursor-pointer bg-transparent flex-shrink-0"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <Hamburger open={menuOpen} />
          </button>
        </div>

        {/* ── Mobile dropdown ── */}
        <div
          className="overflow-hidden transition-all duration-[420ms] ease-in-out"
          style={{ maxHeight: menuOpen ? 640 : 0 }}
        >
          <div
            className="pb-5"
            style={{
              borderTop:      `1px solid ${t.borderLight}`,
              background:      t.navBg,
              backdropFilter: "blur(24px)",
            }}
          >
            {/* Mobile nav links */}
            <div className="flex flex-col mt-1">
              {NAV_LINKS.map((lnk, i) => (
                <a
                  key={lnk.label}
                 href={lnk.type === "route" ? lnk.to : `#${lnk.id}`}
                  onClick={e => handleNavClick(e, lnk, i)}
                  className="flex items-center gap-3 px-6 py-3.5 no-underline transition-all duration-200 font-medium"
                  style={{
                    fontSize:   15,
                    color:      i === activeIndex ? t.text : t.textSub,
                    background: i === activeIndex
                      ? (dark ? "rgba(225,29,72,0.08)" : "rgba(225,29,72,0.05)")
                      : "transparent",
                    borderLeft: `2px solid ${i === activeIndex ? t.accent : "transparent"}`,
                  }}
                >
                  {/* small type badge for route links */}
                 {lnk.type === "route" && lnk.to !== "/" && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-md font-bold"
                      style={{
                        background: t.pillBg,
                        color:      t.accent,
                        fontSize:   9,
                        letterSpacing: "0.08em",
                      }}
                    >
                      APP
                    </span>
                  )}
                  {lnk.label}
                </a>
              ))}
            </div>

            {/* Theme toggle */}
            <div
              className="px-6 pt-3 pb-1 mt-1.5"
              style={{ borderTop: `1px solid ${t.borderLight}` }}
            >
              <ThemeToggle mobile />
            </div>

            {/* Mobile auth */}
            <div className="flex gap-2.5 px-6 pt-3">
              <button
                onClick={() => { setMenuOpen(false); navigate("/login"); }}
                className="flex-1 py-2.5 text-sm font-semibold rounded-xl cursor-pointer transition-all duration-200"
                style={{
                  color:      t.textSub,
                  background: "transparent",
                  border:    `1px solid ${t.border}`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color      = t.text;
                  e.currentTarget.style.background = t.hoverBg;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color      = t.textSub;
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Login
              </button>

              <button
                onClick={() => { setMenuOpen(false); navigate("/register"); }}
                className="flex-1 py-2.5 text-sm font-bold rounded-xl border-none cursor-pointer transition-all duration-200"
                style={{ background: t.accent, color: "#ffffff" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}