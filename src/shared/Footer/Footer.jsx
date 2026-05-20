import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

/* ─── data ────────────────────────────────────────────────── */
const LINKS = {
  Product: [
    { label: "Features",    href: "#features",       type: "scroll" },
    { label: "Pricing",     href: "#payments",        type: "scroll" },
    { label: "Dashboard",   href: "/app/dashboard",   type: "route"  },
    { label: "Changelog",   href: "#changelog",       type: "scroll" },
    { label: "Roadmap",     href: "#roadmap",         type: "scroll" },
  ],
  Company: [
    { label: "About us",    href: "#about",           type: "scroll" },
    { label: "Blog",        href: "#blog",            type: "scroll" },
    { label: "Careers",     href: "#careers",         type: "scroll" },
    { label: "Press kit",   href: "#press",           type: "scroll" },
    { label: "Contact",     href: "#contact",         type: "scroll" },
  ],
  Legal: [
    { label: "Privacy policy",     href: "#privacy",  type: "scroll" },
    { label: "Terms of service",   href: "#terms",    type: "scroll" },
    { label: "Cookie policy",      href: "#cookies",  type: "scroll" },
    { label: "GDPR",               href: "#gdpr",     type: "scroll" },
  ],
};

const SOCIALS = [
  {
    label: "Twitter / X",
    href:  "https://twitter.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "GitHub",
    href:  "https://github.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href:  "https://linkedin.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href:  "https://instagram.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
];

/* ─── Newsletter input ─────────────────────────────────────── */
function Newsletter() {
  const { t, dark } = useTheme();
  const [email,   setEmail]   = useState("");
  const [status,  setStatus]  = useState("idle"); // idle | loading | done | error
  const [focused, setFocused] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    await new Promise(r => setTimeout(r, 1200));
    setStatus("done");
    setEmail("");
  }

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.textDim }}>
        Stay in the loop
      </p>
      <p className="text-sm mb-4 leading-relaxed" style={{ color: t.textSub }}>
        Get product updates, tips, and early access — no spam, ever.
      </p>

      {status === "done" ? (
        <div
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-medium"
          style={{
            background: "rgba(16,185,129,0.10)",
            border:    "1px solid rgba(16,185,129,0.25)",
            color:     "#10b981",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          You're on the list!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
              style={{
                background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                border: `1.5px solid ${
                  status === "error"
                    ? t.accent
                    : focused
                    ? `${t.accent}80`
                    : t.border
                }`,
                color:       t.text,
                boxShadow:   focused ? `0 0 0 3px ${t.accent}18` : "none",
              }}
              aria-label="Email address for newsletter"
            />
            {status === "error" && (
              <p className="absolute -bottom-5 left-1 text-xs font-medium" style={{ color: t.accent }}>
                Enter a valid email
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="px-5 py-3 rounded-xl text-sm font-bold border-0 cursor-pointer
                       whitespace-nowrap transition-all duration-200 flex items-center
                       justify-center gap-2 flex-shrink-0"
            style={{
              background: t.accent,
              color:      "#fff",
              opacity:    status === "loading" ? 0.7 : 1,
            }}
            onMouseEnter={e => { if (status !== "loading") e.currentTarget.style.opacity = "0.88"; }}
            onMouseLeave={e => { if (status !== "loading") e.currentTarget.style.opacity = "1"; }}
          >
            {status === "loading" ? (
              <>
                <span className="loading loading-spinner loading-xs" />
                Subscribing…
              </>
            ) : (
              "Subscribe"
            )}
          </button>
        </form>
      )}
    </div>
  );
}

/* ─── FooterLink ───────────────────────────────────────────── */
function FooterLink({ item }) {
  const { t }    = useTheme();
  const navigate = useNavigate();

  function handleClick(e) {
    e.preventDefault();
    if (item.type === "route") {
      navigate(item.href);
    } else {
      const el = document.querySelector(item.href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <a
      href={item.href}
      onClick={handleClick}
      className="text-sm no-underline transition-all duration-150 flex items-center gap-1.5 group"
      style={{ color: t.textSub }}
      onMouseEnter={e => (e.currentTarget.style.color = t.text)}
      onMouseLeave={e => (e.currentTarget.style.color = t.textSub)}
    >
      {item.label}
      {item.type === "route" && item.href !== "/" && (
        <span
          className="font-black uppercase tracking-widest rounded-md px-1 py-0.5
                     leading-none opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          style={{ fontSize: 8, background: t.pillBg, color: t.accent }}
        >
          app
        </span>
      )}
    </a>
  );
}

/* ── Collapsible section (mobile) ─────────────────────────── */
function FooterSection({ title, links }) {
  const { t }         = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* mobile: collapsible header */}
      <div  className=" sm:hidden">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between py-3.5 border-0
                     bg-transparent cursor-pointer transition-colors duration-150"
          style={{ borderBottom: `1px solid ${t.border}` }}
          aria-expanded={open}
        >
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: t.textDim }}>
            {title}
          </span>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            style={{ color: t.textDim }}
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        <div
          className="overflow-hidden transition-all duration-[320ms] ease-in-out"
          style={{ maxHeight: open ? 400 : 0 }}
        >
          <div className="flex flex-col gap-3 py-3 pl-1">
            {links.map(lnk => <FooterLink key={lnk.label} item={lnk} />)}
          </div>
        </div>
      </div>

      {/* desktop: always visible */}
      <div className="hidden sm:block">
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: t.textDim }}>
          {title}
        </p>
        <div className="flex flex-col gap-3">
          {links.map(lnk => <FooterLink key={lnk.label} item={lnk} />)}
        </div>
      </div>
    </>
  );
}


export default function Footer() {
  const { t, dark } = useTheme();
  const navigate    = useNavigate();
  const year        = new Date().getFullYear();

  return (
    <footer
    className="lg:pt-30"
      role="contentinfo"
      style={{
        background:  t.phoneBg2,
        borderTop:  `1px solid ${t.border}`,
        transition:  "background 0.4s, border-color 0.4s",
      }}
    >
      {/* ── upper section ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr] gap-10 lg:gap-8">

          {/* brand column */}
          <div className="flex flex-col gap-5">
            {/* logo */}
            <button
              onClick={() => { navigate("/"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="flex items-center gap-2.5 border-0 bg-transparent cursor-pointer p-0 w-fit group"
              aria-label="Spendora – go to top"
            >
              <span
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                           transition-all duration-200 group-hover:scale-105 group-hover:rotate-3"
                style={{ background: t.accent }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#fff"/>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
              <span
                className="text-xl font-extrabold select-none"
                style={{ color: t.text, letterSpacing: "-0.5px" }}
              >
                Spend<span style={{ color: t.accent }}>ora</span>
              </span>
            </button>

            <p className="text-sm leading-relaxed max-w-xs" style={{ color: t.textSub }}>
              Your AI-powered finance companion. Track, analyze, and optimize your
              personal expenses — automatically and intelligently.
            </p>

            {/* social icons */}
            <div className="flex items-center gap-2 flex-wrap">
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center
                             transition-all duration-150 no-underline"
                  style={{
                    background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                    border:    `1px solid ${t.border}`,
                    color:      t.textSub,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background  = t.pillBg;
                    e.currentTarget.style.color       = t.accent;
                    e.currentTarget.style.borderColor = `${t.accent}40`;
                    e.currentTarget.style.transform   = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background  = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
                    e.currentTarget.style.color       = t.textSub;
                    e.currentTarget.style.borderColor = t.border;
                    e.currentTarget.style.transform   = "translateY(0)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* newsletter — full width on mobile, fits in brand col on lg */}
            <div className="mt-2 sm:hidden lg:block">
              <Newsletter />
            </div>
          </div>

          {/* newsletter — visible on sm/md only (between brand + link cols) */}
          <div className="hidden sm:block lg:hidden sm:col-span-2 pb-2">
            <Newsletter />
          </div>

          {/* link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <FooterSection key={title} title={title} links={links} />
          ))}
        </div>
      </div>

      {/* ── bottom bar ── */}
      <div
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-5
                   flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ borderTop: `1px solid ${t.border}` }}
      >
        <p className="text-xs text-center sm:text-left" style={{ color: t.textDim }}>
          © {year} Spendora, Inc. All rights reserved.
        </p>

        <div className="flex items-center gap-5 flex-wrap justify-center">
          {[
            { label: "Privacy",  href: "#privacy" },
            { label: "Terms",    href: "#terms"   },
            { label: "Cookies",  href: "#cookies" },
          ].map(item => (
            <a
              key={item.label}
              href={item.href}
              onClick={e => {
                e.preventDefault();
                const el = document.querySelector(item.href);
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-xs no-underline transition-colors duration-150"
              style={{ color: t.textDim }}
              onMouseEnter={e => (e.currentTarget.style.color = t.textSub)}
              onMouseLeave={e => (e.currentTarget.style.color = t.textDim)}
            >
              {item.label}
            </a>
          ))}

          {/* made with love badge */}
          <span
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
            style={{
              background: t.pillBg,
              color:      t.textDim,
              border:    `1px solid ${t.border}`,
            }}
          >
            Made with
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"
              aria-hidden="true" style={{ color: t.accent }}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            in Dhaka
          </span>
        </div>
      </div>
    </footer>
  );
}
