"use client";

import { useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { motion, useInView } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

/* ─── animation variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};
const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};
const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/* ─── hook: trigger only once when section enters view ──── */
function useReveal() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return { ref, inView };
}

const HOW_STEPS = [
  {
    icon: "📥",
    title: "Connect your accounts",
    desc: "Link your bank, cards, and wallets in seconds. We support 10,000+ institutions worldwide.",
    step: "01",
  },
  {
    icon: "🤖",
    title: "AI categorises everything",
    desc: "Our model reads every transaction and tags it instantly — no manual work, no spreadsheets.",
    step: "02",
  },
  {
    icon: "📊",
    title: "See your full picture",
    desc: "Get weekly reports, budget alerts, and personalised savings tips right in your dashboard.",
    step: "03",
  },
];

function HowItWorks({ t }) {
  const { ref, inView } = useReveal();

  return (
    <section
      ref={ref}
      className="w-full py-20 px-4"
      style={{ background: t.pageBg, transition: "background .35s" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* heading */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="text-center mb-14"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
            style={{
              background: t.badge,
              border: `1px solid ${t.badgeBd}`,
              color: t.badgeTx,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: t.accent }}
            />
            How it works
          </span>
          <h2
            className="text-3xl md:text-4xl font-black tracking-tight"
            style={{ color: t.text }}
          >
            Three steps to financial clarity
          </h2>
          <p
            className="mt-3 text-base max-w-xl mx-auto"
            style={{ color: t.textSub }}
          >
            Spendora does the heavy lifting so you can focus on what matters —
            living your best life.
          </p>
        </motion.div>

        {/* steps */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {HOW_STEPS.map((s, i) => (
            <motion.div key={i} variants={scaleIn}>
              <div
                className="relative rounded-2xl p-7 h-full flex flex-col gap-4 group cursor-default"
                style={{
                  background: t.cardBg,
                  border: `1px solid ${t.border}`,
                  transition: "background .35s, border-color .35s",
                }}
              >
                {/* step number watermark */}
                <div
                  className="absolute top-5 right-6 text-5xl font-black select-none"
                  style={{ color: t.watermark, lineHeight: 1 }}
                >
                  {s.step}
                </div>
                <div className="text-4xl">{s.icon}</div>
                <h3 className="text-lg font-bold" style={{ color: t.text }}>
                  {s.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: t.textSub }}
                >
                  {s.desc}
                </p>
                {/* connector line (not last) */}
                {i < 2 && (
                  <div
                    className="hidden md:block absolute top-1/2 -right-4 w-8 h-px z-10"
                    style={{ background: t.accent, opacity: 0.4 }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION 2 — FEATURES (alternating image + text)
══════════════════════════════════════════════════════════ */
const FEATURES = [
  {
    icon: "🧠",
    tag: "AI engine",
    title: "Spending intelligence, not just tracking",
    desc: "Our AI doesn't just record — it predicts. Get ahead of overspending before it happens with real-time pattern analysis and personalised nudges.",
    bullets: [
      "Anomaly detection on every transaction",
      "Predictive monthly forecasts",
      "Smart saving opportunities",
    ],
    visual: <AIVisual />,
    flip: false,
  },
  {
    icon: "🔒",
    tag: "Security",
    title: "Bank-grade security, zero compromise",
    desc: "Your data is encrypted end-to-end with AES-256. We are read-only — we can never move your money. SOC 2 Type II certified.",
    bullets: [
      "256-bit encryption at rest & in transit",
      "Read-only bank access via OAuth",
      "SOC 2 Type II + GDPR compliant",
    ],
    visual: <SecurityVisual />,
    flip: true,
  },
  {
    icon: "📱",
    tag: "Cross-platform",
    title: "Your finances, everywhere you go",
    desc: "One account, every device. Native iOS and Android apps with offline mode. Desktop web dashboard for deep analysis.",
    bullets: [
      "iOS, Android & web apps",
      "Offline mode with smart sync",
      "Real-time push notifications",
    ],
    visual: <PlatformVisual />,
    flip: false,
  },
];

function AIVisual() {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden p-6 flex flex-col gap-3"
      style={{
        background: "rgba(225,29,72,0.07)",
        border: "1px solid rgba(225,29,72,0.14)",
      }}
    >
      {/* prediction bar */}
      <div className="text-xs font-semibold text-rose-400 mb-1">
        Monthly forecast
      </div>
      {[
        { cat: "Food & dining", pct: 72, amt: "$432" },
        { cat: "Transport", pct: 45, amt: "$135" },
        { cat: "Entertainment", pct: 88, amt: "$220" },
        { cat: "Shopping", pct: 31, amt: "$186" },
      ].map((r, i) => (
        <div key={i}>
          <div
            className="flex justify-between text-xs mb-1"
            style={{ color: "#fda4af" }}
          >
            <span>{r.cat}</span>
            <span className="font-semibold">{r.amt}</span>
          </div>
          <div
            className="h-2 rounded-full"
            style={{ background: "rgba(225,29,72,0.15)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: "#e11d48", width: 0 }}
              animate={{ width: `${r.pct}%` }}
              transition={{ duration: 0.9, delay: i * 0.12 }}
            />
          </div>
        </div>
      ))}
      <div
        className="mt-2 px-3 py-2 rounded-xl text-xs"
        style={{ background: "rgba(225,29,72,0.12)", color: "#fda4af" }}
      >
        💡 At this rate you'll exceed Entertainment budget by $40
      </div>
    </div>
  );
}

function SecurityVisual() {
  return (
    <div
      className="w-full rounded-2xl p-6 flex flex-col gap-4"
      style={{
        background: "rgba(225,29,72,0.07)",
        border: "1px solid rgba(225,29,72,0.14)",
      }}
    >
      <div className="text-xs font-semibold text-rose-400">Security status</div>
      {[
        { label: "AES-256 encryption", ok: true },
        { label: "2FA enabled", ok: true },
        { label: "Read-only access", ok: true },
        { label: "SOC 2 certified", ok: true },
        { label: "GDPR compliant", ok: true },
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-3"
        >
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
            style={{ background: "rgba(225,29,72,0.18)", color: "#e11d48" }}
          >
            ✓
          </div>
          <span className="text-sm" style={{ color: "#fda4af" }}>
            {item.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function PlatformVisual() {
  return (
    <div
      className="w-full rounded-2xl p-6 flex flex-col gap-3"
      style={{
        background: "rgba(225,29,72,0.07)",
        border: "1px solid rgba(225,29,72,0.14)",
      }}
    >
      <div className="text-xs font-semibold text-rose-400 mb-1">
        Sync status
      </div>
      {[
        {
          icon: "📱",
          label: "iPhone 15 Pro",
          time: "just now",
          dot: "#e11d48",
        },
        {
          icon: "🤖",
          label: "Android Pixel 8",
          time: "2 min ago",
          dot: "#e11d48",
        },
        {
          icon: "💻",
          label: "MacBook Dashboard",
          time: "5 min ago",
          dot: "rgba(225,29,72,0.5)",
        },
        {
          icon: "🖥️",
          label: "Web (Chrome)",
          time: "12 min ago",
          dot: "rgba(225,29,72,0.3)",
        },
      ].map((d, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-3 py-2 rounded-xl"
          style={{ background: "rgba(225,29,72,0.08)" }}
        >
          <span>{d.icon}</span>
          <span className="flex-1 text-sm" style={{ color: "#fda4af" }}>
            {d.label}
          </span>
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: d.dot }}
          />
          <span className="text-xs" style={{ color: "#9f1239" }}>
            {d.time}
          </span>
        </div>
      ))}
    </div>
  );
}

function Features({ t }) {
  return (
    <section
      className="w-full py-20 px-4"
      style={{ background: t.cardBg, transition: "background .35s" }}
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-24">
        {FEATURES.map((f, i) => {
          const { ref, inView } = useReveal();
          return (
            <div
              key={i}
              ref={ref}
              className={`flex flex-col ${f.flip ? "md:flex-row-reverse" : "md:flex-row"} gap-10 md:gap-16 items-center`}
            >
              {/* text */}
              <motion.div
                variants={f.flip ? fadeRight : fadeLeft}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                className="flex-1 flex flex-col gap-5"
              >
                <span
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase w-fit"
                  style={{
                    background: t.badge,
                    border: `1px solid ${t.badgeBd}`,
                    color: t.badgeTx,
                  }}
                >
                  {f.icon} {f.tag}
                </span>
                <h2
                  className="text-2xl md:text-3xl font-black tracking-tight leading-snug"
                  style={{ color: t.text }}
                >
                  {f.title}
                </h2>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: t.textSub }}
                >
                  {f.desc}
                </p>
                <ul className="flex flex-col gap-2 mt-1">
                  {f.bullets.map((b, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-3 text-sm"
                      style={{ color: t.textSub }}
                    >
                      <span
                        className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                        style={{ background: t.badge, color: t.accent }}
                      >
                        ✓
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* visual */}
              <motion.div
                variants={f.flip ? fadeLeft : fadeRight}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                className="flex-1 w-full max-w-sm md:max-w-none"
              >
                {f.visual}
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION 3 — STATS COUNTER
══════════════════════════════════════════════════════════ */
const STATS = [
  { value: "20M+", label: "Active users", icon: "👥" },
  { value: "$4.2B", label: "Expenses tracked", icon: "💰" },
  { value: "99.9%", label: "Uptime SLA", icon: "⚡" },
  { value: "4.9★", label: "App store rating", icon: "⭐" },
];

function Stats({ t }) {
  const { ref, inView } = useReveal();
  return (
    <section
      ref={ref}
      className="w-full py-16 px-4"
      style={{ background: t.pageBg, transition: "background .35s" }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              className="rounded-2xl p-6 text-center flex flex-col items-center gap-2"
              style={{
                background: t.cardBg,
                border: `1px solid ${t.border}`,
                transition: "background .35s",
              }}
            >
              <div className="text-3xl">{s.icon}</div>
              <div className="text-3xl font-black" style={{ color: t.accent }}>
                {s.value}
              </div>
              <div className="text-xs font-medium" style={{ color: t.textSub }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION 4 — TESTIMONIALS
══════════════════════════════════════════════════════════ */
const TESTIMONIALS = [
  {
    name: "Nadia Hassan",
    role: "Freelance designer",
    avatar: "NH",
    stars: 5,
    quote:
      "Spendora completely changed how I handle money as a freelancer. The AI forecasting is scarily accurate — I finally feel in control.",
  },
  {
    name: "James Caldwell",
    role: "Software engineer",
    avatar: "JC",
    stars: 5,
    quote:
      "I've tried six finance apps. This is the only one I actually kept using past month two. The UI is clean and it just works.",
  },
  {
    name: "Priya Menon",
    role: "Startup founder",
    avatar: "PM",
    stars: 5,
    quote:
      "Running a startup means chaotic finances. Spendora gives me a clear picture every morning before my coffee is even done.",
  },
  {
    name: "Lucas Ferreira",
    role: "Grad student",
    avatar: "LF",
    stars: 5,
    quote:
      "Budget alerts saved me twice this month from overdraft. The spending tips are actually practical, not generic advice.",
  },
  {
    name: "Aisha Tanvir",
    role: "Marketing manager",
    avatar: "AT",
    stars: 5,
    quote:
      "The category breakdowns finally helped me see where my money was leaking. Cut $300/month in three weeks.",
  },
  {
    name: "Oliver Smith",
    role: "Teacher",
    avatar: "OS",
    stars: 5,
    quote:
      "Simple, beautiful, and smart. My wife and I now share the family dashboard and we've had zero money arguments since.",
  },
];

function Testimonials({ t }) {
  const { ref, inView } = useReveal();
  return (
    <section
      ref={ref}
      className="w-full py-20 px-4"
      style={{ background: t.cardBg, transition: "background .35s" }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="text-center mb-12"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
            style={{
              background: t.badge,
              border: `1px solid ${t.badgeBd}`,
              color: t.badgeTx,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: t.accent }}
            />
            Loved by users
          </span>
          <h2
            className="text-3xl md:text-4xl font-black tracking-tight"
            style={{ color: t.text }}
          >
            Real people, real results
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {TESTIMONIALS.map((tm, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-2xl p-6 flex flex-col gap-4 cursor-default"
              style={{
                background: t.pageBg,
                border: `1px solid ${t.border}`,
                transition: "background .35s",
              }}
            >
              {/* stars */}
              <div className="flex gap-0.5">
                {Array(tm.stars)
                  .fill(0)
                  .map((_, j) => (
                    <span
                      key={j}
                      className="text-sm"
                      style={{ color: t.accent }}
                    >
                      ★
                    </span>
                  ))}
              </div>
              {/* quote */}
              <p
                className="text-sm leading-relaxed flex-1"
                style={{ color: t.textSub }}
              >
                "{tm.quote}"
              </p>
              {/* author */}
              <div
                className="flex items-center gap-3 pt-2"
                style={{ borderTop: `1px solid ${t.border}` }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: t.badge, color: t.accent }}
                >
                  {tm.avatar}
                </div>
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: t.text }}
                  >
                    {tm.name}
                  </div>
                  <div className="text-xs" style={{ color: t.textSub }}>
                    {tm.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION 5 — PRICING
══════════════════════════════════════════════════════════ */
const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Perfect for getting started",
    features: [
      "Up to 2 connected accounts",
      "30-day transaction history",
      "Basic category breakdown",
      "Mobile app access",
    ],
    cta: "Get started free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    desc: "For serious savers",
    features: [
      "Unlimited accounts",
      "Full transaction history",
      "AI forecasting & insights",
      "Budget alerts & goals",
      "CSV / PDF export",
      "Priority support",
    ],
    cta: "Start 14-day trial",
    featured: true,
  },
  {
    name: "Family",
    price: "$16",
    period: "per month",
    desc: "Share with up to 5 members",
    features: [
      "Everything in Pro",
      "5 user seats",
      "Shared family dashboard",
      "Per-member budgets",
      "Parental controls",
    ],
    cta: "Start 14-day trial",
    featured: false,
  },
];

function Pricing({ t }) {
  const { ref, inView } = useReveal();
  return (
    <section
      ref={ref}
      className="w-full py-20 px-4"
      style={{ background: t.pageBg, transition: "background .35s" }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="text-center mb-12"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
            style={{
              background: t.badge,
              border: `1px solid ${t.badgeBd}`,
              color: t.badgeTx,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: t.accent }}
            />
            Pricing
          </span>
          <h2
            className="text-3xl md:text-4xl font-black tracking-tight"
            style={{ color: t.text }}
          >
            Simple, honest pricing
          </h2>
          <p
            className="mt-3 text-base max-w-md mx-auto"
            style={{ color: t.textSub }}
          >
            No hidden fees. Cancel anytime. Always free tier available.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
        >
          {PLANS.map((plan, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              whileHover={{ y: -6, transition: { duration: 0.22 } }}
              className="rounded-2xl p-7 flex flex-col gap-5 relative"
              style={{
                background: plan.featured ? t.accent : t.cardBg,
                border: plan.featured ? "none" : `1px solid ${t.border}`,
                transition: "background .35s",
              }}
            >
              {plan.featured && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: t.pageBg,
                    color: t.accent,
                    border: `1px solid ${t.accent}`,
                  }}
                >
                  Most popular
                </div>
              )}
              <div>
                <div
                  className="text-sm font-bold mb-1"
                  style={{
                    color: plan.featured ? "rgba(255,255,255,0.7)" : t.textSub,
                  }}
                >
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-4xl font-black"
                    style={{ color: plan.featured ? "#fff" : t.text }}
                  >
                    {plan.price}
                  </span>
                  <span
                    className="text-sm"
                    style={{
                      color: plan.featured
                        ? "rgba(255,255,255,0.6)"
                        : t.textSub,
                    }}
                  >
                    / {plan.period}
                  </span>
                </div>
                <div
                  className="text-xs mt-1"
                  style={{
                    color: plan.featured ? "rgba(255,255,255,0.6)" : t.textSub,
                  }}
                >
                  {plan.desc}
                </div>
              </div>

              <ul className="flex flex-col gap-2.5">
                {plan.features.map((f, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2.5 text-sm"
                    style={{
                      color: plan.featured
                        ? "rgba(255,255,255,0.85)"
                        : t.textSub,
                    }}
                  >
                    <span
                      className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                      style={{
                        background: plan.featured
                          ? "rgba(255,255,255,0.2)"
                          : t.badge,
                        color: plan.featured ? "#fff" : t.accent,
                      }}
                    >
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 mt-auto"
                style={{
                  background: plan.featured ? "#fff" : t.accent,
                  color: plan.featured ? t.accent : "#fff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.88";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: "Is my banking data safe?",
    a: "Absolutely. We use bank-grade AES-256 encryption and connect via read-only OAuth — we can never move money or make transactions on your behalf. We are SOC 2 Type II certified.",
  },
  {
    q: "Which banks and institutions are supported?",
    a: "We support 10,000+ banks, credit unions, and fintech platforms globally including all major US, UK, EU, and Asian banks.",
  },
  {
    q: "Can I use Spendora for free?",
    a: "Yes! Our Free plan is genuinely useful — 2 accounts, 30-day history, and mobile app access. Upgrade to Pro when you want AI forecasting and unlimited history.",
  },
  {
    q: "Does it work outside the US?",
    a: "Yes. Spendora supports 40+ countries including the UK, EU, Canada, Australia, India, and Singapore with local currency and institution support.",
  },
  {
    q: "How accurate is the AI categorisation?",
    a: "Our model achieves 96%+ accuracy on categorisation. You can also train it with one tap — corrections are learned and applied instantly.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, no contracts and no cancellation fees. Cancel in one click from your account settings and you'll keep access until the end of your billing period.",
  },
];

function FAQ({ t }) {
  const { ref, inView } = useReveal();
  return (
    <section
      ref={ref}
      className="w-full py-20 px-4"
      style={{ background: t.cardBg, transition: "background .35s" }}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="text-center mb-12"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
            style={{
              background: t.badge,
              border: `1px solid ${t.badgeBd}`,
              color: t.badgeTx,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: t.accent }}
            />
            FAQ
          </span>
          <h2
            className="text-3xl md:text-4xl font-black tracking-tight"
            style={{ color: t.text }}
          >
            Questions? Answered.
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="flex flex-col gap-3"
        >
          {FAQS.map((faq, i) => (
            <motion.div key={i} variants={fadeUp}>
              <details
                className="group rounded-2xl overflow-hidden"
                style={{
                  background: t.pageBg,
                  border: `1px solid ${t.border}`,
                  transition: "background .35s",
                }}
              >
                <summary
                  className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-semibold list-none select-none"
                  style={{ color: t.text }}
                >
                  {faq.q}
                  <span
                    className="text-lg font-light ml-4 flex-shrink-0 transition-transform group-open:rotate-45"
                    style={{ color: t.accent }}
                  >
                    +
                  </span>
                </summary>
                <div
                  className="px-5 pb-4 text-sm leading-relaxed"
                  style={{ color: t.textSub }}
                >
                  {faq.a}
                </div>
              </details>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CTABanner({ t }) {
  const { ref, inView } = useReveal();
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <section
      ref={ref}
      className="w-full py-20 px-4"
      style={{ background: t.pageBg, transition: "background .35s" }}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="rounded-3xl p-10 md:p-16 text-center flex flex-col items-center gap-6"
          style={{ background: t.accent }}
        >
          <div className="text-5xl">🚀</div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
            Start tracking smarter today
          </h2>
          <p className="text-base text-white/75 max-w-md">
            Join 20 million people who already use Spendora to understand and
            grow their money. Free forever — upgrade when you're ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button
              onClick={() => {
                if (user) {
                  navigate("/add-expense");
                } else {
                  navigate("/login");
                }
              }}
              className="px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-200"
              style={{ background: "#fff", color: t.accent }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              Get started — it's free
            </button>

            <Link
              to="/services"
              className="px-8 py-3.5 cursor-pointer rounded-xl text-sm font-bold border border-white/30 text-white transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.12)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
              }}
            >
              View live demo →
            </Link>
          </div>
          <p className="text-xs text-white/50">
            No credit card required · Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default function Demo() {
  const { t } = useTheme();

  return (
    <div style={{ background: t.pageBg, transition: "background .35s" }}>
      <HowItWorks t={t} />
      <Features t={t} />
      <Stats t={t} />
      <Testimonials t={t} />
      <Pricing t={t} />
      <FAQ t={t} />
      <CTABanner t={t} />
    </div>
  );
}
