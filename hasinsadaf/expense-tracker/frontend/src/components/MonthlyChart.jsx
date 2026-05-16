"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function MonthlyChart({ expenses }) {
  const monthlyMap = {};

  expenses.forEach((expense) => {
    const dateObj = new Date(expense.date);
    const yearMonth = `${dateObj.getFullYear()}-${String(
      dateObj.getMonth() + 1
    ).padStart(2, "0")}`;

    monthlyMap[yearMonth] = (monthlyMap[yearMonth] || 0) + Number(expense.amount);
  });

  const data = Object.keys(monthlyMap)
    .sort()
    .map((month) => ({
      month,
      amount: parseFloat(monthlyMap[month].toFixed(2)),
    }));

  if (data.length === 0) {
    return <div className="chart-empty">No spending data yet</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
        <Tooltip
          formatter={(value) => `BDT ${Number(value).toFixed(2)}`}
          contentStyle={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            color: "var(--text-primary)",
            boxShadow: "var(--shadow-card)",
          }}
        />
        <Legend wrapperStyle={{ color: "var(--text-secondary)", fontSize: 12 }} />
        <Bar dataKey="amount" fill="#4F46E5" name="Amount" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
