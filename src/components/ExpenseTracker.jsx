import { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

/* ─── constants ──────────────────────────────────────────── */
const BUDGET = 3000;
const CAT_BUDGETS = {
  Food: 600, Transport: 300, Shopping: 400,
  Health: 200, Entertainment: 250, Bills: 500, Other: 200,
};
const CAT_COLORS = {
  Food: "#e11d48", Transport: "#f43f5e", Shopping: "#fb7185",
  Health: "#fda4af", Entertainment: "#fecdd3", Bills: "#9f1239", Other: "#be123c",
};
const CAT_ICONS = {
  Food: "🍕", Transport: "🚌", Shopping: "🛍",
  Health: "💊", Entertainment: "🎬", Bills: "🏠", Other: "📦",
};
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CATEGORIES = Object.keys(CAT_BUDGETS);

const SEED_EXPENSES = [
  { id: 1, desc: "Grocery run",  amt: 87.50, cat: "Food",          day: 0 },
  { id: 2, desc: "Uber ride",    amt: 14.20, cat: "Transport",     day: 1 },
  { id: 3, desc: "Netflix",      amt: 15.99, cat: "Entertainment", day: 1 },
  { id: 4, desc: "Pharmacy",     amt: 34.00, cat: "Health",        day: 2 },
  { id: 5, desc: "Lunch",        amt: 22.00, cat: "Food",          day: 3 },
  { id: 6, desc: "Electric bill",amt: 120.00,cat: "Bills",         day: 4 },
  { id: 7, desc: "T-shirt",      amt: 45.00, cat: "Shopping",      day: 5 },
  { id: 8, desc: "Coffee",       amt: 8.50,  cat: "Food",          day: 6 },
];

const fmt = (n) => "$" + (Math.round(n * 100) / 100).toFixed(2);

/* ─── Donut SVG ──────────────────────────────────────────── */
function DonutChart({ expenses, t }) {
  const cats = {};
  expenses.forEach((e) => { cats[e.cat] = (cats[e.cat] || 0) + e.amt; });
  const total = Object.values(cats).reduce((s, v) => s + v, 0) || 1;
  const entries = Object.entries(cats).sort((a, b) => b[1] - a[1]);

  const R = 42, cx = 55, cy = 55, tau = Math.PI * 2;
  let offset = 0;
  const segs = entries.map(([cat, amt]) => {
    const frac = amt / total;
    const start = offset;
    offset += frac;
    return { cat, amt, frac, start };
  });

  const arc = (frac, start) => {
    const a1 = start * tau - Math.PI / 2;
    const a2 = (start + frac) * tau - Math.PI / 2;
    const laf = frac > 0.5 ? 1 : 0;
    const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
    const x2 = cx + R * Math.cos(a2), y2 = cy + R * Math.sin(a2);
    return `M ${x1} ${y1} A ${R} ${R} 0 ${laf} 1 ${x2} ${y2}`;
  };

  return (
    <div style={styles.donutRow}>
      <div style={styles.donutBox}>
        <svg width="110" height="110" viewBox="0 0 110 110" aria-label="Spending by category donut chart" role="img">
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(225,29,72,0.12)" strokeWidth="14" />
          {segs.map((s) => (
            <path key={s.cat} d={arc(s.frac, s.start)} fill="none"
              stroke={CAT_COLORS[s.cat]} strokeWidth="14" strokeLinecap="butt" />
          ))}
        </svg>
        <div style={styles.donutCenter}>
          <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{fmt(total)}</div>
          <div style={{ fontSize: 10, color: t.textSub }}>total</div>
        </div>
      </div>

      <div style={styles.legend}>
        {segs.slice(0, 5).map((s) => (
          <div key={s.cat} style={styles.legItem}>
            <div style={{ ...styles.legDot, background: CAT_COLORS[s.cat] }} />
            <span style={{ flex: 1, fontSize: 12, color: t.textSub }}>{s.cat}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: t.text }}>
              {Math.round(s.frac * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Line Chart (react-chartjs-2) ──────────────────────── */
function SpendingChart({ expenses, t }) {
  const byDay = DAYS.map((_, i) =>
    expenses.filter((e) => e.day === i).reduce((s, e) => s + e.amt, 0)
  );
  const textCol = t.textSub;
  const gridCol = t.border;

  const data = {
    labels: DAYS,
    datasets: [{
      label: "Spent",
      data: byDay,
      borderColor: "#e11d48",
      backgroundColor: "rgba(225,29,72,0.10)",
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: "#e11d48",
      fill: true,
      tension: 0.35,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { color: textCol, font: { size: 11 } },
        grid: { color: gridCol },
      },
      y: {
        ticks: {
          color: textCol, font: { size: 11 },
          callback: (v) => "$" + Math.round(v),
        },
        grid: { color: gridCol },
      },
    },
  };

  return (
    <div style={{ position: "relative", width: "100%", height: 180 }}>
      <Line data={data} options={options} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function ExpenseTracker() {
  const { dark, t } = useTheme();
  const [expenses, setExpenses] = useState(SEED_EXPENSES);
  const [nextId, setNextId] = useState(9);
  const [desc, setDesc]     = useState("");
  const [amt, setAmt]       = useState("");
  const [cat, setCat]       = useState("Food");
  const [error, setError]   = useState(false);

  /* derived stats */
  const total     = expenses.reduce((s, e) => s + e.amt, 0);
  const budLeft   = BUDGET - total;
  const avgDay    = total / 7;

  const catTotals = {};
  expenses.forEach((e) => { catTotals[e.cat] = (catTotals[e.cat] || 0) + e.amt; });

  /* add expense */
  const addExpense = () => {
    const parsed = parseFloat(amt);
    if (!desc.trim() || isNaN(parsed) || parsed <= 0) {
      setError(true);
      setTimeout(() => setError(false), 1500);
      return;
    }
    setExpenses((prev) => [
      ...prev,
      { id: nextId, desc: desc.trim(), amt: parsed, cat, day: Math.floor(Math.random() * 7) },
    ]);
    setNextId((n) => n + 1);
    setDesc(""); setAmt("");
  };

  /* ── inline style helpers ── */
  const s = styles;
  const card  = { ...s.card,  background: t.cardBg,  border: `1px solid ${t.border}` };
  const pill  = { background: t.pillBg };
  const pillH = { background: t.pillHov };

  /* ── render ── */
  return (
    <div style={{ ...s.wrap, background: t.pageBg, transition: "background 0.35s" }}>

      {/* page title */}
      <div style={s.topBar}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 600, color: t.text }}>Expense Tracker</div>
          <div style={{ fontSize: 13, color: t.textSub, marginTop: 2 }}>May 2025 overview</div>
        </div>
      </div>

      {/* ── summary cards ── */}
      <div style={s.summaryGrid}>
        {[
          {
            icon: "💳", label: "Total spent",
            val: fmt(total),
            sub: "↑ vs last month", subColor: t.textSub,
          },
          {
            icon: "📊", label: "Budget left",
            val: fmt(Math.max(budLeft, 0)),
            sub: budLeft > 0 ? "within budget" : "over budget!",
            subColor: budLeft > 0 ? "#4ade80" : "#f87171",
          },
          {
            icon: "🧾", label: "Transactions",
            val: expenses.length,
            sub: `${expenses.length} entries`, subColor: t.textSub,
          },
          {
            icon: "📈", label: "Avg / day",
            val: fmt(avgDay),
            sub: "this month", subColor: t.textSub,
          },
        ].map((c) => (
          <div key={c.label} style={{ ...card, ...s.scard }}>
            <div style={{ fontSize: 12, color: t.textSub, marginBottom: 6 }}>
              {c.icon} {c.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 600, color: t.text, lineHeight: 1 }}>
              {c.val}
            </div>
            <div style={{ fontSize: 12, marginTop: 5, color: c.subColor }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* ── add expense form ── */}
      <div style={{ ...card, ...s.addCard }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: t.text, marginBottom: 14 }}>
          ➕ Add expense
        </div>
        <div style={s.formRow3}>
          {/* description */}
          <div>
            <div style={{ fontSize: 11, color: t.textSub, marginBottom: 4 }}>Description</div>
            <input
              type="text" placeholder="e.g. Groceries"
              value={desc} onChange={(e) => setDesc(e.target.value)}
              style={{
                ...s.input,
                background: t.pillBg, color: t.text,
                border: `1px solid ${error && !desc.trim() ? "#e11d48" : t.border}`,
              }}
            />
          </div>
          {/* amount */}
          <div>
            <div style={{ fontSize: 11, color: t.textSub, marginBottom: 4 }}>Amount ($)</div>
            <input
              type="number" placeholder="0.00" min="0" step="0.01"
              value={amt} onChange={(e) => setAmt(e.target.value)}
              style={{
                ...s.input,
                background: t.pillBg, color: t.text,
                border: `1px solid ${error && !amt ? "#e11d48" : t.border}`,
              }}
            />
          </div>
          {/* category */}
          <div>
            <div style={{ fontSize: 11, color: t.textSub, marginBottom: 4 }}>Category</div>
            <select
              value={cat} onChange={(e) => setCat(e.target.value)}
              style={{ ...s.input, background: t.pillBg, color: t.text, border: `1px solid ${t.border}` }}
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <button
          onClick={addExpense}
          style={s.addBtn}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
        >
          Add expense
        </button>
      </div>

      {/* ── charts row ── */}
      <div style={s.twoCol}>
        {/* spending over time */}
        <div style={card}>
          <div style={s.panelTitle}>
            <span style={{ color: t.text }}>Spending over time</span>
            <span style={{ fontSize: 12, color: t.textSub }}>last 7 days</span>
          </div>
          <SpendingChart expenses={expenses} t={t} />
        </div>

        {/* donut */}
        <div style={card}>
          <div style={s.panelTitle}>
            <span style={{ color: t.text }}>By category</span>
            <span style={{ fontSize: 12, color: t.textSub }}>this month</span>
          </div>
          <DonutChart expenses={expenses} t={t} />
        </div>
      </div>

      {/* ── transactions + budget row ── */}
      <div style={s.twoCol}>
        {/* recent transactions */}
        <div style={card}>
          <div style={s.panelTitle}>
            <span style={{ color: t.text }}>Recent transactions</span>
            <span style={{ fontSize: 12, color: t.textSub }}>{expenses.length} total</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[...expenses].reverse().slice(0, 6).map((e) => (
              <div key={e.id} style={{ ...s.txRow, background: t.pillBg }}>
                <div style={{
                  ...s.txIcon,
                  background: CAT_COLORS[e.cat] + "22",
                }}>
                  {CAT_ICONS[e.cat]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{e.desc}</div>
                  <div style={{ fontSize: 11, color: t.textSub, marginTop: 1 }}>
                    {e.cat} · {DAYS[e.day]}
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: t.accent || "#e11d48" }}>
                  -{fmt(e.amt)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* budget progress */}
        <div style={card}>
          <div style={s.panelTitle}>
            <span style={{ color: t.text }}>Budget progress</span>
            <span style={{ fontSize: 12, color: t.textSub }}>monthly</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {CATEGORIES.map((c) => {
              const spent = catTotals[c] || 0;
              const bud   = CAT_BUDGETS[c];
              const pct   = Math.min((spent / bud) * 100, 100);
              const over  = spent > bud;
              return (
                <div key={c}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: t.textSub, marginBottom: 5 }}>
                    <strong style={{ color: t.text, fontWeight: 500 }}>{c}</strong>
                    <span>{fmt(spent)} / {fmt(bud)}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 999, background: t.pillBg, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 999,
                      width: `${pct}%`,
                      background: over ? "#f87171" : CAT_COLORS[c],
                      transition: "width 0.5s",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}

/* ─── Static styles ──────────────────────────────────────── */
const styles = {
  wrap: {
    width: "100%", padding: "24px 20px 48px",
    boxSizing: "border-box", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
  },
  topBar: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", marginBottom: 24,
    flexWrap: "wrap", gap: 12,
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
    gap: 12, marginBottom: 20,
  },
  scard: { padding: "14px 16px", borderRadius: 12 },
  card: {
    borderRadius: 14, padding: 18,
    marginBottom: 16, boxSizing: "border-box",
    transition: "background 0.35s",
  },
  addCard: { padding: 18 },
  formRow3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
    gap: 10, marginBottom: 12,
  },
  input: {
    width: "100%", padding: "9px 12px",
    borderRadius: 9, fontSize: 13,
    outline: "none", boxSizing: "border-box",
  },
  addBtn: {
    width: "100%", padding: "11px",
    borderRadius: 10, border: "none",
    background: "#e11d48", color: "#fff",
    fontSize: 14, fontWeight: 500,
    cursor: "pointer", transition: "opacity 0.2s",
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
    gap: 16, marginBottom: 0,
  },
  panelTitle: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", marginBottom: 14,
    fontSize: 14, fontWeight: 500,
  },
  txRow: {
    display: "flex", alignItems: "center",
    gap: 10, padding: "9px 12px",
    borderRadius: 10,
  },
  txIcon: {
    width: 34, height: 34, borderRadius: 9,
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: 16, flexShrink: 0,
  },
  /* donut */
  donutRow: {
    display: "flex", alignItems: "center",
    gap: 16, flexWrap: "wrap",
  },
  donutBox: { position: "relative", width: 110, height: 110, flexShrink: 0 },
  donutCenter: {
    position: "absolute", inset: 0,
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
  },
  legend: { display: "flex", flexDirection: "column", gap: 7, flex: 1, minWidth: 100 },
  legItem: { display: "flex", alignItems: "center", gap: 8 },
  legDot: { width: 9, height: 9, borderRadius: "50%", flexShrink: 0 },
};