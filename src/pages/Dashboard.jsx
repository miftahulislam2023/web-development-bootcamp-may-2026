import { useExpenses } from "../context/ExpenseContext";
import { useTheme } from "../context/ThemeContext";
import { CATEGORIES, MONTHS } from "../constants";
import {
  RiScales3Line,
  RiCalendarLine,
  RiArrowUpCircleLine,
  RiStackLine,
  RiBarChartGroupedLine,
  RiPieChartLine,
  RiTimeLine,
  RiArrowRightSLine,
  RiDeleteBin6Line,
} from "react-icons/ri";

/* ── Stat Card ─────────────────────────────────────────────── */
function StatCard({ label, value, sub, dotColor, icon: Icon }) {
  const { t } = useTheme();
  return (
    <div style={{
      background: t.phoneBg2,
      border: `1px solid ${t.border}`,
      borderRadius: 16,
      padding: "16px 18px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      transition: "transform 0.18s, box-shadow 0.18s",
      cursor: "default",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 8px 24px ${dotColor}22`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 10, color: t.textDim, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
          {label}
        </span>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: dotColor + "18",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={16} color={dotColor} />
        </div>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: t.text, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, color: t.textSub, display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: dotColor, display: "inline-block", flexShrink: 0 }} />
        {sub}
      </div>
    </div>
  );
}

/* ── Bar Chart ─────────────────────────────────────────────── */
function BarChart({ data, maxH = 110 }) {
  const { t } = useTheme();
  const max = Math.max(...data.map(d => d.total), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: maxH + 24, paddingTop: 8 }}>
      {data.map((d, i) => {
        const isLast = i === data.length - 1;
        const h = Math.max(6, Math.round(d.total / max * maxH));
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, flex: 1 }}>
            <div
              title={`$${d.total}`}
              style={{
                width: "100%",
                borderRadius: "6px 6px 0 0",
                height: h,
                background: isLast
                  ? `linear-gradient(180deg, ${t.accent}, ${t.accent}bb)`
                  : t.pillBg,
                transition: "opacity 0.18s, transform 0.18s",
                cursor: "default",
                position: "relative",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            />
            <div style={{ fontSize: 9, color: t.textDim, fontWeight: 600 }}>{MONTHS[d.month]}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Donut Chart ───────────────────────────────────────────── */
function DonutChart({ byCategory }) {
  const { t } = useTheme();
  const entries = CATEGORIES
    .map(c => ({ ...c, val: byCategory[c.name] || 0 }))
    .filter(c => c.val > 0);
  const total = entries.reduce((s, c) => s + c.val, 0) || 1;

  const r = 38, cx = 50, cy = 50, circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 20,
      flexWrap: "wrap",
    }}>
      <svg width="110" height="110" viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
        {entries.map((c, i) => {
          const pct  = c.val / total;
          const dash = pct * circ;
          const gap  = circ - dash;
          const el = (
            <circle key={i}
              cx={cx} cy={cy} r={r}
              fill="none" stroke={c.color} strokeWidth="14"
              strokeDasharray={`${dash.toFixed(2)} ${gap.toFixed(2)}`}
              strokeDashoffset={`${(-offset * circ).toFixed(2)}`}
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          );
          offset += pct;
          return el;
        })}
        <circle cx={cx} cy={cy} r="27" fill={t.phoneBg2} />
        <text x={cx} y={cy - 4} textAnchor="middle" fill={t.textDim} fontSize="7">Total</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill={t.text} fontSize="10" fontWeight="800">
          ${total.toFixed(0)}
        </text>
      </svg>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minWidth: 100 }}>
        {entries.slice(0, 5).map(c => (
          <div key={c.name} style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", fontSize: 11,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: t.textSub }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: c.color, display: "inline-block", flexShrink: 0,
              }} />
              {c.name}
            </div>
            <span style={{ fontWeight: 700, color: t.text }}>${c.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Transaction Row ───────────────────────────────────────── */
export function TxRow({ expense, showDelete, onDelete }) {
  const { t } = useTheme();
  const cat = CATEGORIES.find(c => c.name === expense.cat) || CATEGORIES[7];
  const pos = expense.type === "income";

  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 8px", borderRadius: 10,
        borderBottom: `1px solid ${t.border}`,
        transition: "background 0.15s", cursor: "default",
      }}
      onMouseEnter={e => e.currentTarget.style.background = t.pillBg}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 11, flexShrink: 0,
        background: cat.color + "20",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 17,
      }}>
        {cat.icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12, fontWeight: 700, color: t.text,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {expense.desc}
        </div>
        <div style={{ fontSize: 10, color: t.textSub, marginTop: 2 }}>
          {expense.cat} · {expense.date}
        </div>
      </div>

      <div style={{ textAlign: "right", flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: pos ? "#10b981" : t.accent }}>
          {pos ? "+" : "-"}${expense.amt.toFixed(2)}
        </div>
        {showDelete && (
          <button
            onClick={() => onDelete(expense.id)}
            title="Delete"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: t.textDim, display: "flex", alignItems: "center",
              padding: 4, borderRadius: 6, transition: "color 0.15s, background 0.15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = t.accent;
              e.currentTarget.style.background = t.accent + "18";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = t.textDim;
              e.currentTarget.style.background = "transparent";
            }}
          >
            <RiDeleteBin6Line size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Card wrapper ──────────────────────────────────────────── */
function Card({ title, badge, onBadgeClick, icon: Icon, children }) {
  const { t } = useTheme();
  return (
    <div style={{
      background: t.phoneBg2,
      border: `1px solid ${t.border}`,
      borderRadius: 16,
      padding: 18,
    }}>
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {Icon && (
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: t.pillBg,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon size={14} color={t.textSub} />
            </div>
          )}
          <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{title}</span>
        </div>
        {badge && (
          <button
            onClick={onBadgeClick}
            style={{
              fontSize: 10, padding: "4px 10px", borderRadius: 999,
              background: t.pillBg, color: t.textSub,
              cursor: onBadgeClick ? "pointer" : "default",
              border: "none", display: "flex", alignItems: "center", gap: 3,
              fontWeight: 600, transition: "background 0.15s",
            }}
            onMouseEnter={e => onBadgeClick && (e.currentTarget.style.background = t.border)}
            onMouseLeave={e => e.currentTarget.style.background = t.pillBg}
          >
            {badge}
            {onBadgeClick && <RiArrowRightSLine size={12} />}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   DASHBOARD PAGE
══════════════════════════════════════════════════════════ */
export default function Dashboard({ setPage }) {
  const { t } = useTheme();
  const {
    expenses, deleteExpense,
    totalIncome, totalExpense, balance, monthlyExpense,
    byCategory, byMonth,
  } = useExpenses();

  const recent  = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const catData = byCategory();
  const barData = byMonth(6);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Stat Cards ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 12,
      }}>
        <StatCard
          label="Balance"
          value={`$${balance.toLocaleString()}`}
          sub="All time"
          dotColor="#10b981"
          icon={RiScales3Line}
        />
        <StatCard
          label="This Month"
          value={`$${monthlyExpense.toFixed(0)}`}
          sub="Expenses"
          dotColor={t.accent}
          icon={RiCalendarLine}
        />
        <StatCard
          label="Total Income"
          value={`$${totalIncome.toLocaleString()}`}
          sub="All sources"
          dotColor="#3b82f6"
          icon={RiArrowUpCircleLine}
        />
        <StatCard
          label="Transactions"
          value={expenses.length}
          sub="All records"
          dotColor="#8b5cf6"
          icon={RiStackLine}
        />
      </div>

      {/* ── Charts Row ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 16,
      }}>
        <Card title="Monthly Spending" badge="Last 6 months" icon={RiBarChartGroupedLine}>
          <BarChart data={barData} maxH={110} />
        </Card>
        <Card title="By Category" icon={RiPieChartLine}>
          <DonutChart byCategory={catData} />
        </Card>
      </div>

      {/* ── Recent Transactions ── */}
      <Card
        title="Recent Transactions"
        badge="See all"
        onBadgeClick={() => setPage("transactions")}
        icon={RiTimeLine}
      >
        {recent.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "28px 0",
            color: t.textDim, fontSize: 12,
          }}>
            No transactions yet
          </div>
        ) : (
          recent.map(e => (
            <TxRow key={e.id} expense={e} showDelete={false} onDelete={deleteExpense} />
          ))
        )}
      </Card>

    </div>
  );
}

export { BarChart, DonutChart };