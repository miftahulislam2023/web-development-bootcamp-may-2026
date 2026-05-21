// pages/dashboard/Overview.jsx
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useTheme } from "../context/ThemeContext";
import { useProfile } from "../hooks/userProfile";

import {
  RiArrowUpLine,
  RiArrowDownLine ,
  RiWalletLine,
  RiExchangeLine,
  RiPieChartLine,
  RiLoader4Line,
  RiLockLine,
  RiAddCircleLine,
  RiArrowRightSLine,
  RiFireLine,
  RiShieldCheckLine,
  RiCalendarLine,
  RiUserSmileLine,
  RiMapPinLine,
  RiBriefcaseLine,
} from "react-icons/ri";
import { Helmet } from "react-helmet-async";

// ── animation ─────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.44, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

// ── helpers ───────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
  }).format(n);

const relativeDate = (iso) => {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
};

// ── Skeleton ──────────────────────────────────────
function Skeleton({ w = "100%", h = 16, radius = 8, style = {} }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: radius,
        background:
          "linear-gradient(90deg,#ffffff0d 25%,#ffffff1a 50%,#ffffff0d 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
        ...style,
      }}
    />
  );
}

function StatCardSkeleton({ t }) {
  return (
    <div
      style={{
        background: t.cardBg,
        border: `1px solid ${t.border}`,
        borderRadius: 20,
        padding: "clamp(16px,2.5vw,22px)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <Skeleton w={42} h={42} radius={13} />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Skeleton w="50%" h={10} />
        <Skeleton w="70%" h={28} radius={6} />
        <Skeleton w="60%" h={12} />
      </div>
    </div>
  );
}

// ── sub-components ────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, accent, t, color }) {
  return (
    <motion.div
      variants={fadeUp}
      style={{
        background: t.cardBg,
        border: `1px solid ${t.border}`,
        borderRadius: 20,
        padding: "clamp(16px,2.5vw,22px)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        position: "relative",
        overflow: "hidden",
        transition: "background .35s, transform .18s",
        cursor: "default",
      }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
    >
      <div
        style={{
          position: "absolute",
          top: -24,
          right: -24,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: `${color}22`,
          filter: "blur(28px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 13,
          background: `${color}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={20} color={color} />
      </div>
      <div>
        <div
          style={{
            fontSize: 11,
            color: t.textDim,
            fontWeight: 700,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: "clamp(20px,3.5vw,28px)",
            fontWeight: 900,
            color: t.text,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        {sub && (
          <div
            style={{
              fontSize: 12,
              color: t.textSub,
              marginTop: 5,
              fontWeight: 500,
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TxRow({ tx, t, accent }) {
  const isExp = tx.type === "expense";
  const color = isExp ? "#ef4444" : "#22c55e";
  const amount = tx.amount ?? tx.amt ?? 0;
  const title = tx.title ?? tx.desc ?? tx.category ?? "Transaction";
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "11px 14px",
        borderRadius: 12,
        background: t.pageBg,
        border: `1px solid ${t.border}`,
        transition: "background .18s",
      }}
      whileHover={{ backgroundColor: t.hoverBg }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: `${color}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {isExp ? (
          <RiArrowDownLine size={16} color={color} />
        ) : (
          <RiArrowUpLine size={16} color={color} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: t.text,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 11, color: t.textDim, marginTop: 2 }}>
          {tx.cat && <span style={{ marginRight: 6 }}>{tx.cat}</span>}
          {relativeDate(tx.date)}
        </div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color, flexShrink: 0 }}>
        {isExp ? "−" : "+"}
        {fmt(amount)}
      </div>
    </motion.div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  accent,
  t,
  children,
  action,
  onAction,
}) {
  return (
    <motion.div
      variants={fadeUp}
      style={{
        background: t.cardBg,
        border: `1px solid ${t.border}`,
        borderRadius: 20,
        overflow: "hidden",
        transition: "background .35s",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "clamp(14px,2vw,18px) clamp(16px,2.5vw,22px)",
          borderBottom: `1px solid ${t.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: `${accent}18`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={16} color={accent} />
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: "clamp(13px,1.5vw,15px)",
              color: t.text,
            }}
          >
            {title}
          </span>
        </div>
        {action && (
          <button
            onClick={onAction}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "6px 12px",
              borderRadius: 8,
              border: `1px solid ${t.border}`,
              background: t.pillBg,
              color: t.textSub,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all .18s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = accent;
              e.currentTarget.style.color = accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = t.border;
              e.currentTarget.style.color = t.textSub;
            }}
          >
            {action} <RiArrowRightSLine size={13} />
          </button>
        )}
      </div>
      <div style={{ padding: "clamp(14px,2.5vw,20px)" }}>{children}</div>
    </motion.div>
  );
}

function ProfileSnap({ user, form, accent, t, onEdit }) {
  const initial = user?.displayName
    ? user.displayName
        .trim()
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";

  const infoItems = [
    form.occupation && { icon: RiBriefcaseLine, val: form.occupation },
    form.location && { icon: RiMapPinLine, val: form.location },
    user?.email && { icon: RiShieldCheckLine, val: user.email },
  ].filter(Boolean);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          border: `3px solid ${accent}`,
          overflow: "hidden",
          background: `${accent}22`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: 24, fontWeight: 800, color: accent }}>
            {initial}
          </span>
        )}
      </div>
      <div>
        <div
          style={{
            fontSize: "clamp(15px,2vw,18px)",
            fontWeight: 900,
            color: t.text,
            letterSpacing: "-0.02em",
          }}
        >
          {user?.displayName || "Your Name"}
        </div>
        {form.bio && (
          <div
            style={{
              fontSize: 12,
              color: t.textSub,
              marginTop: 4,
              lineHeight: 1.6,
              maxWidth: 220,
            }}
          >
            {form.bio.slice(0, 80)}
            {form.bio.length > 80 ? "…" : ""}
          </div>
        )}
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {infoItems.map(({ icon: Icon, val }, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 10,
              background: t.pageBg,
              border: `1px solid ${t.border}`,
            }}
          >
            <Icon size={13} color={accent} />
            <span
              style={{
                fontSize: 12,
                color: t.textSub,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {val}
            </span>
          </div>
        ))}
      </div>
      <button
        onClick={onEdit}
        style={{
          width: "100%",
          padding: "9px 16px",
          borderRadius: 10,
          border: `1px solid ${t.border}`,
          background: t.pillBg,
          color: t.textSub,
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          transition: "all .18s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = accent;
          e.currentTarget.style.color = accent;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = t.border;
          e.currentTarget.style.color = t.textSub;
        }}
      >
        <RiUserSmileLine size={13} /> Edit Profile
      </button>
    </div>
  );
}

// ── Main ──────────────────────────────────────────
const FETCH_TIMEOUT = 2000; // 2 second hard cap

export default function Overview() {
  const { t } = useTheme();
  const accent = t.accent || "#e11d48";
  const navigate = useNavigate();

  const { user, form, loading: profileLoading } = useProfile();

  const [summary, setSummary] = useState({
    totalExpense: 0,
    totalIncome: 0,
    count: 0,
  });
  const [txList, setTxList] = useState([]);
  const [txLoading, setTxLoading] = useState(true);

 const API = import.meta.env.VITE_API_URL;

  // ── FIX: fetch as soon as uid is known, with 2s timeout ──
  const fetchedRef = useRef(false); // prevent double-fetch in StrictMode

  useEffect(() => {
    // Wait until profile resolves so we know if uid exists
    if (profileLoading) return;

    const uid = user?.uid ?? null;

    if (!uid) {
      setTxLoading(false);
      return;
    }

    // Already fetched (StrictMode double-invoke guard)
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    let cancelled = false;

    (async () => {
      setTxLoading(true);
      try {
        const [sumRes, txRes] = await Promise.all([
          fetch(`${API}/expenses/summary/monthly?uid=${uid}`, {
            signal: controller.signal,
          }),
          fetch(`${API}/expenses/recent?uid=${uid}&limit=5`, {
            signal: controller.signal,
          }),
        ]);
        const [sumData, txData] = await Promise.all([
          sumRes.json(),
          txRes.json(),
        ]);
        if (!cancelled) {
          setSummary({
            totalExpense: sumData.totalExpense ?? 0,
            totalIncome: sumData.totalIncome ?? 0,
            count: sumData.count ?? 0,
          });
          setTxList((txData || []).map((tx) => ({ ...tx, id: tx._id })));
        }
      } catch (e) {
        // AbortError = timed out; network error = just show empty state
        if (!cancelled) {
          console.warn(
            "Overview fetch failed or timed out:",
            e.name === "AbortError" ? "2s timeout" : e,
          );
        }
      } finally {
        clearTimeout(timeoutId);
        if (!cancelled) setTxLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [profileLoading, user?.uid, API]); // ← depend on profileLoading so we start right when ready

  const balance = summary.totalIncome - summary.totalExpense;

  // ── Instead of full-page spinner, show skeleton layout ──
  // Only block render if we truly have no user info yet AND profile is still loading
  if (profileLoading) {
    return (
      <div
        style={{
          background: t.pageBg,
          minHeight: "100vh",
          padding: "clamp(14px,3vw,32px) clamp(12px,3vw,28px)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Greeting skeleton */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Skeleton w={220} h={28} radius={8} />
              <Skeleton w={160} h={14} radius={6} />
            </div>
            <Skeleton w={120} h={40} radius={12} />
          </div>
          {/* Stat card skeletons */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%,200px), 1fr))",
              gap: "clamp(10px,2vw,18px)",
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <StatCardSkeleton key={i} t={t} />
            ))}
          </div>
        </div>
        <style>{`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          color: t.textSub,
        }}
      >
        <RiLockLine size={40} color={accent} />
        <p style={{ fontSize: 16, fontWeight: 600 }}>
          Please log in to view your dashboard.
        </p>
      </div>
    );
  }

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = user.displayName?.split(" ")[0] || "there";

  return (
    <>
      <Helmet>
        <title>Dashboard | OverView</title>
      </Helmet>

      <div
        style={{
          background: t.pageBg,
          minHeight: "100vh",
          padding: "clamp(14px,3vw,32px) clamp(12px,3vw,28px)",
          transition: "background .35s",
          fontFamily: "inherit",
        }}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(14px,2.5vw,22px)",
          }}
        >
          {/* ── GREETING ─────────────────────────────── */}
          <motion.div
            variants={fadeUp}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "clamp(18px,3vw,24px)",
                  fontWeight: 900,
                  color: t.text,
                  letterSpacing: "-0.03em",
                }}
              >
                {greeting}, {firstName} 👋
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: t.textSub }}>
                Here's your financial snapshot for{" "}
                {new Date().toLocaleDateString("en-GB", {
                  month: "long",
                  year: "numeric",
                })}
                .
              </p>
            </div>
            {/* <button
            onClick={() => navigate("add-expense")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "10px 18px",
              borderRadius: 12,
              background: accent,
              color: "#fff",
              border: "none",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              transition: "opacity .18s, transform .15s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <RiAddCircleLine size={16} /> Add Expense
          </button> */}
          </motion.div>

          {/* ── STAT CARDS ────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%,200px), 1fr))",
              gap: "clamp(10px,2vw,18px)",
            }}
          >
            <StatCard
              icon={RiWalletLine}
              label="Balance"
              value={fmt(balance)}
              sub={
                balance >= 0 ? "You're in the green ✓" : "Overspent this month"
              }
              accent={accent}
              t={t}
              color={accent}
            />
            <StatCard
              icon={RiArrowDownLine}
              label="Total Expenses"
              value={fmt(summary.totalExpense)}
              sub={`${summary.count} transaction${summary.count !== 1 ? "s" : ""} this month`}
              accent={accent}
              t={t}
              color="#ef4444"
            />
            <StatCard
              icon={RiArrowUpLine}
              label="Total Income"
              value={fmt(summary.totalIncome)}
              sub="This month"
              accent={accent}
              t={t}
              color="#22c55e"
            />
            <StatCard
              icon={RiFireLine}
              label="Transactions"
              value={summary.count}
              sub="This month"
              accent={accent}
              t={t}
              color="#f97316"
            />
          </div>

          {/* ── MAIN BODY ─────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%,300px), 1fr))",
              gap: "clamp(14px,2.5vw,22px)",
              alignItems: "start",
            }}
          >
            {/* Transactions list */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(14px,2.5vw,22px)",
              }}
            >
              <SectionCard
                title="Recent Transactions"
                icon={RiExchangeLine}
                accent={accent}
                t={t}
                action="See all"
                onAction={() => navigate("/dashboardLayout/transactions")}
              >
                {txLoading ? (
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "11px 14px",
                          borderRadius: 12,
                          background: t.pageBg,
                          border: `1px solid ${t.border}`,
                        }}
                      >
                        <Skeleton
                          w={36}
                          h={36}
                          radius={10}
                          style={{ flexShrink: 0 }}
                        />
                        <div
                          style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                          }}
                        >
                          <Skeleton w="55%" h={13} />
                          <Skeleton w="35%" h={10} />
                        </div>
                        <Skeleton
                          w={60}
                          h={14}
                          radius={6}
                          style={{ flexShrink: 0 }}
                        />
                      </div>
                    ))}
                  </div>
                ) : txList.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "28px 0",
                      color: t.textDim,
                      fontSize: 13,
                    }}
                  >
                    <RiExchangeLine
                      size={32}
                      style={{ marginBottom: 8, opacity: 0.4 }}
                    />
                    <br />
                    No transactions yet.{" "}
                    <span
                      onClick={() => navigate("/dashboardLayout/add-expense")}
                      style={{
                        color: accent,
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Add one →
                    </span>
                  </div>
                ) : (
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    <AnimatePresence>
                      {txList.map((tx) => (
                        <TxRow key={tx.id} tx={tx} t={t} accent={accent} />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </SectionCard>

              {/* Quick nav pills */}
              <motion.div
                variants={fadeUp}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(min(100%, 120px), 1fr))",
                  gap: 10,
                }}
              >
                {[
                  {
                    label: "Add Expense",
                    icon: RiAddCircleLine,
                    path: "/dashboardLayout/add-expense",
                  },
                  {
                    label: "Transactions",
                    icon: RiExchangeLine,
                    path: "/dashboardLayout/transactions",
                  },
                  {
                    label: "Charts",
                    icon: RiPieChartLine,
                    path: "/dashboardLayout/charts",
                  },
                ].map(({ label, icon: Icon, path }) => (
                  <button
                    key={path}
                    onClick={() => navigate(path)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      padding: "14px 10px",
                      borderRadius: 14,
                      border: `1px solid ${t.border}`,
                      background: t.cardBg,
                      color: t.textSub,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all .18s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = accent;
                      e.currentTarget.style.color = accent;
                      e.currentTarget.style.background = `${accent}10`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = t.border;
                      e.currentTarget.style.color = t.textSub;
                      e.currentTarget.style.background = t.cardBg;
                    }}
                  >
                    <Icon size={20} />
                    {label}
                  </button>
                ))}
              </motion.div>
            </div>

            {/* Profile snapshot + account info */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(14px,2.5vw,22px)",
              }}
            >
              <SectionCard
                title="Profile"
                icon={RiUserSmileLine}
                accent={accent}
                t={t}
                action="Edit"
                onAction={() => navigate("profile")}
              >
                <ProfileSnap
                  user={user}
                  form={form}
                  accent={accent}
                  t={t}
                  onEdit={() => navigate("profile")}
                />
              </SectionCard>

              <SectionCard
                title="Account Details"
                icon={RiCalendarLine}
                accent={accent}
                t={t}
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {[
                    {
                      label: "Member since",
                      val: user.metadata?.creationTime
                        ? new Date(
                            user.metadata.creationTime,
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—",
                    },
                    {
                      label: "Email verified",
                      val: user.emailVerified
                        ? "✅ Verified"
                        : "❌ Not verified",
                    },
                    {
                      label: "Auth",
                      val:
                        user.providerData?.[0]?.providerId === "google.com"
                          ? "🔵 Google"
                          : "📧 Email / Password",
                    },
                  ].map(({ label, val }) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 10,
                        padding: "9px 12px",
                        borderRadius: 10,
                        background: t.pageBg,
                        border: `1px solid ${t.border}`,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          color: t.textDim,
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                        }}
                      >
                        {label}
                      </span>
                      <span
                        style={{ fontSize: 12, color: t.text, fontWeight: 600 }}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          </div>
        </motion.div>

        <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      </div>
    </>
  );
}
