"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#06B6D4", "#8B5CF6", "#F97316"];

export default function CategoryChart({ expenses, categories }) {
  const categoryMap = {};

  expenses.forEach((expense) => {
    categoryMap[expense.category_id] =
      (categoryMap[expense.category_id] || 0) + Number(expense.amount);
  });

  const data = Object.keys(categoryMap).map((categoryId) => {
    const category = categories.find(
      (c) => String(c.id) === String(categoryId)
    );
    return {
      name: category ? category.name : "Unknown",
      value: parseFloat(categoryMap[categoryId].toFixed(2)),
    };
  });

  if (data.length === 0) {
    return <div className="chart-empty">No category data yet</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name }) => name}
          innerRadius={54}
          outerRadius={88}
          fill="#8884d8"
          dataKey="value"
          paddingAngle={3}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
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
      </PieChart>
    </ResponsiveContainer>
  );
}
