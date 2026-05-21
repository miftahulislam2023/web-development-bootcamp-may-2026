import { useEffect } from "react";
import { useExpenses } from "../context/ExpenseContext";
import { useTheme }    from "../context/ThemeContext";
import { MONTHS, CATEGORIES } from "../constants";
import { Helmet } from "react-helmet-async";

function Card({ title, subtitle, children }) {
  const { t } = useTheme();
  return (
    <div style={{
      background: t.phoneBg2, border: `1px solid ${t.border}`,
      borderRadius: 14, padding: "clamp(14px,4vw,20px)",
    }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: t.textDim, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

function Empty({ label = "No data yet" }) {
  const { t } = useTheme();
  return (
    <div style={{ textAlign: "center", padding: "28px 0", fontSize: 12, color: t.textDim }}>
      {label}
    </div>
  );
}

function SpendingTrend({ data }) {
  const { t } = useTheme();
  const ACCENT = "#6366F1";
  const max    = Math.max(...data.map(d => d.total), 1);
  const maxH   = 110;
  if (data.every(d => d.total === 0)) return <Empty label="Add expenses to see trend" />;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: maxH + 28, paddingTop: 8 }}>
      {data.map((d, i) => {
        const h = Math.max(4, Math.round((d.total / max) * maxH));
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ fontSize: 8, color: t.textDim, marginBottom: 2 }}>
              {d.total > 0 ? `৳${d.total >= 1000 ? (d.total/1000).toFixed(1)+"k" : d.total}` : ""}
            </div>
            <div
              title={`${MONTHS[d.month]}: ৳${d.total}`}
              style={{
                width: "100%", height: h,
                background: i === data.length - 1 ? ACCENT : ACCENT + "70",
                borderRadius: "5px 5px 0 0",
                transition: "height 0.4s ease",
              }}
            />
            <div style={{ fontSize: 9, color: t.textDim }}>{MONTHS[d.month]}</div>
          </div>
        );
      })}
    </div>
  );
}

function CategoryDonut({ catData }) {
  const { t } = useTheme();
  const entries = Object.entries(catData).sort((a, b) => b[1] - a[1]);
  const total   = entries.reduce((s, [, v]) => s + v, 0);
  if (total === 0) return <Empty label="Add expenses to see breakdown" />;

  const R = 52, r = 32, cx = 70, cy = 70;
  const circumference = 2 * Math.PI * R;
  let offset = 0;
  const slices = entries.map(([name, val]) => {
    const pct    = val / total;
    const dash   = pct * circumference;
    const catDef = CATEGORIES.find(c => c.name === name);
    const color  = catDef?.color ?? "#6b7280";
    const slice  = { name, val, pct, dash, offset, color };
    offset += dash;
    return slice;
  });
  const topCat = entries[0];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <svg width={140} height={140} viewBox="0 0 140 140">
          {slices.map((s, i) => (
            <circle key={i} cx={cx} cy={cy} r={R}
              fill="none" stroke={s.color} strokeWidth={R - r}
              strokeDasharray={`${s.dash} ${circumference - s.dash}`}
              strokeDashoffset={-s.offset + circumference * 0.25}
            />
          ))}
          <text x={cx} y={cy - 6} textAnchor="middle" fill={t.text} fontSize={11} fontWeight={700}>{topCat[0]}</text>
          <text x={cx} y={cy + 10} textAnchor="middle" fill={t.textDim} fontSize={9}>৳{topCat[1].toFixed(0)}</text>
        </svg>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7, flex: 1, minWidth: 110 }}>
        {slices.slice(0, 6).map(s => (
          <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: 11, color: t.textSub, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.text, flexShrink: 0 }}>{Math.round(s.pct * 100)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IncomeVsExpense({ incData, expData }) {
  const { t } = useTheme();
  const max  = Math.max(...incData.map(d => d.total), ...expData.map(d => d.total), 1);
  const maxH = 110;
  const hasData = incData.some(d => d.total > 0) || expData.some(d => d.total > 0);
  if (!hasData) return <Empty label="Add income or expenses to compare" />;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "clamp(4px,2vw,10px)", height: maxH + 32, paddingTop: 8 }}>
        {incData.map((inc, i) => {
          const exp = expData[i];
          const iH  = Math.max(inc.total > 0 ? 4 : 0, Math.round((inc.total / max) * maxH));
          const eH  = Math.max(exp.total > 0 ? 4 : 0, Math.round((exp.total / max) * maxH));
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ display: "flex", gap: 2, alignItems: "flex-end", width: "100%", height: maxH }}>
                <div title={`Income ৳${inc.total}`} style={{ flex: 1, height: iH, borderRadius: "4px 4px 0 0", background: "#10b981", transition: "height 0.4s ease" }} />
                <div title={`Expense ৳${exp.total}`} style={{ flex: 1, height: eH, borderRadius: "4px 4px 0 0", background: "#ef4444", transition: "height 0.4s ease" }} />
              </div>
              <div style={{ fontSize: 9, color: t.textDim }}>{MONTHS[inc.month]}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 11, color: t.textSub }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }} /> Income
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} /> Expenses
        </span>
      </div>
    </div>
  );
}

function TopCategories({ catData }) {
  const { t } = useTheme();
  const entries = Object.entries(catData).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const total   = entries.reduce((s, [, v]) => s + v, 0);
  if (total === 0) return <Empty label="No expense data yet" />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {entries.map(([name, val]) => {
        const catDef = CATEGORIES.find(c => c.name === name);
        const color  = catDef?.color ?? "#6366F1";
        const pct    = total > 0 ? (val / total) * 100 : 0;
        return (
          <div key={name}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: t.text, fontWeight: 600 }}>{name}</span>
              <span style={{ color: t.textDim }}>৳{val.toFixed(0)} · {pct.toFixed(0)}%</span>
            </div>
            <div style={{ height: 7, background: t.border, borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: color, transition: "width 0.5s ease" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RecentActivity({ expenses }) {
  const { t } = useTheme();
  const recent = [...expenses]
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
    .slice(0, 5);
  if (recent.length === 0) return <Empty label="No transactions yet" />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {recent.map(e => {
        const catDef = CATEGORIES.find(c => c.name === e.cat);
        const color  = catDef?.color ?? "#6b7280";
        const isInc  = e.type === "income";
        return (
          <div key={e._id ?? e.id} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 10px", borderRadius: 10,
            background: t.cardBg, border: `1px solid ${t.border}`,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9, flexShrink: 0,
              background: color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
            }}>
              {catDef?.icon ?? "•"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.desc}</div>
              <div style={{ fontSize: 10, color: t.textDim }}>{e.cat} · {new Date(e.date + "T12:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, flexShrink: 0, color: isInc ? "#10b981" : "#ef4444" }}>
              {isInc ? "+" : "-"}৳{Number(e.amt).toFixed(0)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── helper: build monthly data from expenses array ── */
function buildMonthlyData(expenses, months = 6, type = "expense") {
  return Array.from({ length: months }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (months - 1 - i));
    const m = d.getMonth();
    const y = d.getFullYear();
    const total = expenses
      .filter(e => {
        const ed = new Date(e.createdAt || e.date);
        return e.type === type && ed.getMonth() === m && ed.getFullYear() === y;
      })
      .reduce((s, e) => s + Number(e.amt), 0);
    return { month: m, year: y, total };
  });
}

export default function Charts() {
  const { expenses, fetchExpenses } = useExpenses();

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // ✅ Calculate everything locally from expenses array
  const catData = expenses
    .filter(e => e.type === "expense")
    .reduce((acc, e) => {
      acc[e.cat] = (acc[e.cat] || 0) + Number(e.amt);
      return acc;
    }, {});

  const barData  = buildMonthlyData(expenses, 6, "expense");
  const incData  = buildMonthlyData(expenses, 6, "income");
  const expData  = buildMonthlyData(expenses, 6, "expense");

  return (
    <>
      <Helmet><title>Dashboard | Charts</title></Helmet>
      <div style={{
        display: "flex", flexDirection: "column", gap: 16,
        padding: "clamp(10px,3vw,20px)", width: "100%", boxSizing: "border-box",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))", gap: 16 }}>
          <Card title="Spending trend" subtitle="Last 6 months · expenses">
            <SpendingTrend data={barData} />
          </Card>
          <Card title="Category breakdown" subtitle="All-time expenses">
            <CategoryDonut catData={catData} />
          </Card>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))", gap: 16 }}>
          <Card title="Income vs Expenses" subtitle="Last 6 months">
            <IncomeVsExpense incData={incData} expData={expData} />
          </Card>
          <Card title="Top categories" subtitle="By spending amount" >
            <TopCategories catData={catData} />
          </Card>
        </div>
        <Card title="Recent activity" subtitle="Last 5 transactions">
          <RecentActivity expenses={expenses} />
        </Card>
      </div>
    </>
  );
}