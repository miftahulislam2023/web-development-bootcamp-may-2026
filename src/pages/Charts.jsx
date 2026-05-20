import { useExpenses } from "../context/ExpenseContext";
import { useTheme } from "../context/ThemeContext";
import { MONTHS } from "../constants";
import { BarChart, DonutChart } from "./Dashboard";

function Card({ title, children }) {
  const { t } = useTheme();
  return (
    <div style={{ background: t.phoneBg2, border: `1px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 14 }}>{title}</div>
      {children}
    </div>
  );
}

/* Income vs Expense grouped bars */
function IncVsExp({ byMonth }) {
  const { t } = useTheme();
  const incData = byMonth(6, "income");
  const expData = byMonth(6, "expense");
  const max = Math.max(...incData.map(d => d.total), ...expData.map(d => d.total), 1);
  const maxH = 120;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: maxH + 20 }}>
        {incData.map((d, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}>
            <div style={{ display: "flex", gap: 2, alignItems: "flex-end", width: "100%" }}>
              <div style={{
                flex: 1, borderRadius: "4px 4px 0 0",
                height: Math.max(4, Math.round(d.total / max * maxH)),
                background: "#10b981",
              }} title={`Income $${d.total}`} />
              <div style={{
                flex: 1, borderRadius: "4px 4px 0 0",
                height: Math.max(4, Math.round(expData[i].total / max * maxH)),
                background: t.accent,
              }} title={`Expense $${expData[i].total}`} />
            </div>
            <div style={{ fontSize: 9, color: t.textDim }}>{MONTHS[d.month]}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 14, marginTop: 10, fontSize: 11, color: t.textSub }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
          Income
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.accent, display: "inline-block" }} />
          Expenses
        </span>
      </div>
    </div>
  );
}

export default function Charts() {
  const { byCategory, byMonth } = useExpenses();
  const catData = byCategory();
  const barData = byMonth(6);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
        <Card title="Spending trend — last 6 months">
          <BarChart data={barData} maxH={130} />
        </Card>
        <Card title="Category breakdown">
          <DonutChart byCategory={catData} />
        </Card>
      </div>
      <Card title="Income vs Expenses">
        <IncVsExp byMonth={byMonth} />
      </Card>
    </div>
  );
}