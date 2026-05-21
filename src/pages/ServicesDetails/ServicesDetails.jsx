import { useParams, useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FiArrowLeft, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { services } from "./serviceData";

const FadeUp = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.55, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  const { t } = useTheme();
  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        background: t.cardBg,
        borderColor: open ? t.accent : t.border,
        transition: "border-color .2s",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 text-left font-bold text-sm"
        style={{
          color: open ? t.accent : t.text,
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        <span>{q}</span>
        {open ? (
          <FiChevronUp size={16} style={{ flexShrink: 0, color: t.accent }} />
        ) : (
          <FiChevronDown
            size={16}
            style={{ flexShrink: 0, color: t.textDim }}
          />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <p
              className="px-5 sm:px-6 pb-5 text-sm leading-7"
              style={{ color: t.textSub }}
            >
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, dark } = useTheme();

  const service = services.find((s) => s.id === id);

  if (!service) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4 px-4"
        style={{ background: t.pageBg }}
      >
        <p
          className="text-2xl font-black text-center"
          style={{ color: t.text }}
        >
          Service not found
        </p>
        <button
          onClick={() => navigate("/services")}
          className="px-6 py-3 rounded-2xl font-bold text-sm"
          style={{
            background: t.accent,
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Back to Services
        </button>
      </div>
    );
  }

  const HeroIcon = service.icon;

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: t.pageBg }}
    >
      {/* bg orbs */}
      <div
        className="absolute top-0 left-0 w-60 sm:w-72 h-60 sm:h-72 rounded-full blur-3xl pointer-events-none"
        style={{ background: t.orb }}
      />
      <div
        className="absolute bottom-0 right-0 w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: t.orb2 }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-16">
        {/* ── Back button ── */}
        <FadeUp>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-sm font-bold border mb-8 sm:mb-12 cursor-pointer transition-all duration-200"
            style={{
              background: t.pillBg,
              borderColor: t.border,
              color: t.textSub,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = t.accent;
              e.currentTarget.style.borderColor = t.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = t.textSub;
              e.currentTarget.style.borderColor = t.border;
            }}
          >
            <FiArrowLeft size={15} /> Back to Services
          </button>
        </FadeUp>

        {/* ── Hero ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-14 sm:mb-20">
          <FadeUp delay={0.05}>
            <span
              className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-5"
              style={{
                background: t.badge,
                border: `1px solid ${t.badgeBd}`,
                color: t.badgeTx,
              }}
            >
              {service.badge}
            </span>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-5"
              style={{ color: t.text }}
            >
              {service.subtitle.split(",")[0]},
              <br />
              <span style={{ color: t.accent }}>
                {service.subtitle.split(",").slice(1).join(",")}
              </span>
            </h1>

            <p
              className="text-sm sm:text-base leading-7 mb-8"
              style={{ color: t.textSub }}
            >
              {service.longDesc}
            </p>

            <div className="flex flex-wrap gap-3">
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ opacity: 0.88 }}
                className="px-6 py-3 rounded-2xl text-sm font-black border-none cursor-pointer"
                style={{ background: t.accent, color: "#fff" }}
              >
                Get Started Free
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                className="px-6 py-3 rounded-2xl text-sm font-bold cursor-pointer transition-all duration-200"
                style={{
                  background: t.pillBg,
                  color: t.accent,
                  border: `1px solid ${t.border}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = t.accent;
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.borderColor = t.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = t.pillBg;
                  e.currentTarget.style.color = t.accent;
                  e.currentTarget.style.borderColor = t.border;
                }}
              >
                Watch Demo
              </motion.button>
            </div>
          </FadeUp>

          <FadeUp delay={0.12}>
            <div
              className="rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center gap-5 border"
              style={{
                background: t.cardBg,
                borderColor: t.border,
                boxShadow: `0 24px 64px ${t.shadow}`,
                minHeight: 240,
              }}
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center"
                style={{ background: t.accent, color: "#fff", fontSize: 48 }}
              >
                <HeroIcon />
              </motion.div>
              <div className="text-center">
                <p className="text-xl font-black" style={{ color: t.text }}>
                  {service.title}
                </p>
                <p
                  className="text-sm mt-2 max-w-xs"
                  style={{ color: t.textSub }}
                >
                  {service.desc}
                </p>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* ── Stats ── */}
        <FadeUp delay={0.05}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-14 sm:mb-20">
            {service.stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl p-4 sm:p-5 text-center border"
                style={{ background: t.cardBg, borderColor: t.border }}
              >
                <div
                  className="text-2xl sm:text-3xl font-black"
                  style={{ color: t.accent }}
                >
                  {s.num}
                </div>
                <div
                  className="text-xs font-semibold mt-1 uppercase tracking-wide"
                  style={{ color: t.textDim }}
                >
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </FadeUp>

        {/* ── Key Features ── */}
        <FadeUp delay={0.05}>
          <h2
            className="text-2xl sm:text-3xl font-black mb-6 sm:mb-8"
            style={{ color: t.text }}
          >
            Key <span style={{ color: t.accent }}>Features</span>
          </h2>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-14 sm:mb-20">
          {service.features.map((f, i) => {
            const FeatureIcon = f.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group rounded-2xl p-5 sm:p-6 border relative overflow-hidden"
                style={{ background: t.cardBg, borderColor: t.border }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: dark
                      ? "linear-gradient(135deg,rgba(225,29,72,.12),transparent)"
                      : "linear-gradient(135deg,rgba(225,29,72,.06),transparent)",
                  }}
                />
                <div className="relative z-10">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4"
                    style={{ background: t.accent, color: "#fff" }}
                  >
                    <FeatureIcon />
                  </div>
                  <p
                    className="font-bold text-sm mb-2"
                    style={{ color: t.text }}
                  >
                    {f.title}
                  </p>
                  <p className="text-xs leading-6" style={{ color: t.textSub }}>
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── How It Works ── */}
        <FadeUp delay={0.05}>
          <h2
            className="text-2xl sm:text-3xl font-black mb-6 sm:mb-8"
            style={{ color: t.text }}
          >
            How It <span style={{ color: t.accent }}>Works</span>
          </h2>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-14 sm:mb-20">
          {service.steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-5 sm:p-6 border"
              style={{ background: t.cardBg, borderColor: t.border }}
            >
              <div
                className="text-xs font-black tracking-widest mb-3 uppercase"
                style={{ color: t.accent }}
              >
                STEP {String(i + 1).padStart(2, "0")}
              </div>
              <p className="font-bold text-sm mb-2" style={{ color: t.text }}>
                {step.title}
              </p>
              <p className="text-xs leading-6" style={{ color: t.textSub }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── FAQ ── */}
        <FadeUp delay={0.05}>
          <h2
            className="text-2xl sm:text-3xl font-black mb-6 sm:mb-8"
            style={{ color: t.text }}
          >
            Frequently Asked <span style={{ color: t.accent }}>Questions</span>
          </h2>
        </FadeUp>
        <div className="flex flex-col gap-3 mb-14 sm:mb-20 max-w-3xl">
          {service.faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>

        {/* ── CTA ── */}
        <FadeUp delay={0.05}>
          <div
            className="rounded-3xl p-8 sm:p-12 text-center border"
            style={{
              background: t.cardBg,
              borderColor: t.border,
              boxShadow: `0 16px 48px ${t.shadow}`,
            }}
          >
            <h2
              className="text-2xl sm:text-3xl font-black mb-3"
              style={{ color: t.text }}
            >
              Ready to take control of your finances?
            </h2>
            <p
              className="text-sm sm:text-base mb-8 max-w-md mx-auto"
              style={{ color: t.textSub }}
            >
              Join 20M+ users who manage their money smarter with Spendora.
            </p>
            <motion.div
              whileTap={{ scale: 0.96 }}
              whileHover={{ opacity: 0.88 }}
            >
              <Link
                to="dashboardLayout/add-expense"
                className="inline-block px-8 py-4 rounded-2xl text-sm font-black cursor-pointer"
                style={{ background: t.accent, color: "#fff" }}
              >
                Start for Free →
              </Link>
            </motion.div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
