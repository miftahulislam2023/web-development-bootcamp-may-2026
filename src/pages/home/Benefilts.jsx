"use client";

import { useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { motion, useInView } from "framer-motion";

/* ─── animation variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
};
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.10 } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.90 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.48, ease: [0.25, 0.46, 0.45, 0.94] } },
};

function useReveal() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-72px" });
  return { ref, inView };
}

/* ─── data ───────────────────────────────────────────────── */
const MAIN_BENEFITS = [
  {
    icon: "🧠",
    title: "AI-powered insights",
    desc: "Our engine reads your transactions and surfaces patterns you'd never spot manually — overspending, subscriptions you forgot, and savings gaps.",
    tag: "Smart",
  },
  {
    icon: "⚡",
    title: "Real-time sync",
    desc: "Every swipe, tap, or transfer appears in your dashboard within seconds. No more end-of-month surprises.",
    tag: "Instant",
  },
  {
    icon: "🔒",
    title: "Bank-grade security",
    desc: "AES-256 encryption, read-only OAuth access, and SOC 2 Type II certification. Your data is yours — always.",
    tag: "Safe",
  },
  {
    icon: "🎯",
    title: "Goal tracking",
    desc: "Set savings targets — holiday fund, emergency buffer, new car — and watch your progress update automatically every day.",
    tag: "Focused",
  },
  {
    icon: "📊",
    title: "Visual reports",
    desc: "Beautiful weekly and monthly breakdowns by category, merchant, and time. Understand your money at a glance.",
    tag: "Clear",
  },
  {
    icon: "🔔",
    title: "Smart alerts",
    desc: "Get nudged before you overspend, not after. Customisable thresholds for every category and budget.",
    tag: "Proactive",
  },
];

const MINI_BENEFITS = [
  { icon: "🌍", text: "Works in 40+ countries" },
  { icon: "📱", text: "iOS, Android & web" },
  { icon: "💳", text: "10,000+ banks supported" },
  { icon: "🔄", text: "Auto-categorisation" },
  { icon: "📤", text: "CSV & PDF export" },
  { icon: "👨‍👩‍👧", text: "Family sharing (up to 5)" },
  { icon: "🌙", text: "Dark & light mode" },
  { icon: "♾️",  text: "Unlimited history on Pro" },
];

const COMPARE_ROWS = [
  { label: "Real-time sync",           spendora: true,  others: false },
  { label: "AI categorisation",        spendora: true,  others: false },
  { label: "Predictive forecasting",   spendora: true,  others: false },
  { label: "Free tier",                spendora: true,  others: true  },
  { label: "Family sharing",           spendora: true,  others: false },
  { label: "10,000+ banks",            spendora: true,  others: true  },
  { label: "SOC 2 certified",          spendora: true,  others: false },
  { label: "No hidden fees",           spendora: true,  others: false },
];

/* ─── small reusable check/cross ────────────────────────── */
const Check = ({ ok, accent }) => (
  <span
    style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 24, height: 24, borderRadius: "50%",
      background: ok ? accent + "22" : "rgba(100,100,100,0.12)",
      color: ok ? accent : "#888",
      fontSize: 12, fontWeight: 700, flexShrink: 0,
    }}
  >
    {ok ? "✓" : "✗"}
  </span>
);

/* ══════════════════════════════════════════════════════════
   BENEFITS COMPONENT
══════════════════════════════════════════════════════════ */
export default function Benefits() {
  const { t } = useTheme();
  const hero    = useReveal();
  const cards   = useReveal();
  const mini    = useReveal();
  const compare = useReveal();
  const banner  = useReveal();

  const accent  = t.accent;   // #e11d48
  const tagStyle = {
    display: "inline-flex", alignItems: "center",
    padding: "2px 10px", borderRadius: 999,
    fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
    background: t.badge, border: `1px solid ${t.badgeBd}`, color: t.badgeTx,
  };

  return (
    <div style={{ background: t.pageBg, transition: "background .35s", width: "100%" }}>

      {/* ════════════════════════════════════════
          HERO — section heading
      ════════════════════════════════════════ */}
      <section className="w-full pt-20 pb-10 px-4">
        <div className="max-w-5xl mx-auto text-center" ref={hero.ref}>
          <motion.div
            variants={stagger} initial="hidden" animate={hero.inView ? "show" : "hidden"}
            className="flex flex-col items-center gap-4"
          >
            <motion.span variants={fadeUp} style={tagStyle}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent, display: "inline-block", marginRight: 6 }} />
              Why Spendora
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className="text-4xl md:text-5xl font-black tracking-tight leading-tight"
              style={{ color: t.text }}
            >
              Everything you need to <br className="hidden sm:block" />
              <span style={{ color: accent }}>master your money</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-base max-w-xl leading-relaxed"
              style={{ color: t.textSub }}
            >
              Spendora combines AI intelligence, beautiful design, and rock-solid security into one app that actually changes your financial habits.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          MAIN BENEFIT CARDS — 3-col grid
      ════════════════════════════════════════ */}
      <section className="w-full py-10 px-4">
        <div className="max-w-5xl mx-auto" ref={cards.ref}>
          <motion.div
            variants={stagger} initial="hidden" animate={cards.inView ? "show" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {MAIN_BENEFITS.map((b, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="rounded-2xl p-6 flex flex-col gap-4 cursor-default relative overflow-hidden"
                style={{
                  background: t.cardBg,
                  border: `1px solid ${t.border}`,
                  transition: "background .35s, border-color .35s",
                }}
              >
                {/* subtle watermark number */}
                <div
                  className="absolute top-4 right-5 text-6xl font-black select-none leading-none"
                  style={{ color: accent, opacity: 0.05 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: accent + "18" }}
                >
                  {b.icon}
                </div>

                {/* tag + title */}
                <div className="flex flex-col gap-1.5">
                  <span style={tagStyle}>{b.tag}</span>
                  <h3 className="text-lg font-bold" style={{ color: t.text }}>{b.title}</h3>
                </div>

                {/* desc */}
                <p className="text-sm leading-relaxed" style={{ color: t.textSub }}>{b.desc}</p>

                {/* bottom accent bar */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: accent, opacity: 0.25 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          MINI BENEFIT PILLS — scrolling row
      ════════════════════════════════════════ */}
      <section className="w-full py-10 px-4" ref={mini.ref}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={stagger} initial="hidden" animate={mini.inView ? "show" : "hidden"}
            className="flex flex-wrap gap-3 justify-center"
          >
            {MINI_BENEFITS.map((m, i) => (
              <motion.div
                key={i} variants={fadeUp}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium"
                style={{
                  background: t.cardBg,
                  border: `1px solid ${t.border}`,
                  color: t.textSub,
                  transition: "background .35s",
                }}
              >
                <span>{m.icon}</span>
                <span>{m.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          COMPARISON TABLE
      ════════════════════════════════════════ */}
      <section className="w-full py-14 px-4">
        <div className="max-w-3xl mx-auto" ref={compare.ref}>
          <motion.div variants={fadeUp} initial="hidden" animate={compare.inView ? "show" : "hidden"}
            className="text-center mb-10">
            <span style={tagStyle} className="mb-3 inline-flex">
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent, display: "inline-block", marginRight: 6 }} />
              Why we're different
            </span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-3" style={{ color: t.text }}>
              Spendora vs. the rest
            </h2>
          </motion.div>

          <motion.div
            variants={scaleIn} initial="hidden" animate={compare.inView ? "show" : "hidden"}
            className="rounded-2xl overflow-hidden"
            style={{ border: `1px solid ${t.border}` }}
          >
            {/* table header */}
            <div
              className="grid grid-cols-3 px-5 py-3 text-xs font-bold uppercase tracking-widest"
              style={{ background: t.cardBg, borderBottom: `1px solid ${t.border}` }}
            >
              <div style={{ color: t.textSub }}>Feature</div>
              <div className="text-center" style={{ color: accent }}>Spendora</div>
              <div className="text-center" style={{ color: t.textSub }}>Others</div>
            </div>

            {/* rows */}
            {COMPARE_ROWS.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={compare.inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="grid grid-cols-3 px-5 py-3.5 items-center"
                style={{
                  background: i % 2 === 0 ? t.pageBg : t.cardBg,
                  borderBottom: i < COMPARE_ROWS.length - 1 ? `1px solid ${t.border}` : "none",
                  transition: "background .35s",
                }}
              >
                <div className="text-sm" style={{ color: t.text }}>{row.label}</div>
                <div className="flex justify-center">
                  <Check ok={row.spendora} accent={accent} />
                </div>
                <div className="flex justify-center">
                  <Check ok={row.others} accent={accent} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          BOTTOM CTA STRIP
      ════════════════════════════════════════ */}
      <section className="w-full py-16 px-4" ref={banner.ref}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={scaleIn} initial="hidden" animate={banner.inView ? "show" : "hidden"}
            className="rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center gap-8"
            style={{ background: t.cardBg, border: `1px solid ${t.border}`, transition: "background .35s" }}
          >
            {/* left text */}
            <div className="flex-1 text-center md:text-left flex flex-col gap-3">
              <div className="text-4xl">✨</div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: t.text }}>
                Ready to take control?
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: t.textSub }}>
                Join 20 million people already using Spendora. Free to start — no credit card needed.
              </p>
            </div>

            {/* right buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 flex-shrink-0 w-full md:w-auto">
              <button
                className="px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 text-white"
                style={{ background: accent }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "scale(1.03)"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1";    e.currentTarget.style.transform = "scale(1)"; }}
              >
                Get started free →
              </button>
              <button
                className="px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{ border: `1px solid ${t.border}`, color: t.textSub, background: "transparent" }}
                onMouseEnter={e => { e.currentTarget.style.background = t.pillBg; e.currentTarget.style.color = t.text; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = t.textSub; }}
              >
                See pricing
              </button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}