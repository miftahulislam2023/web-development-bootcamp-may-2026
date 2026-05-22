"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function AdminRevenueChart({ data }) {
  if (!data?.length) {
    return (
      <p className="py-12 text-center text-sm text-[var(--muted-foreground)]">
        No paid purchases in the last 30 days.
      </p>
    );
  }
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
          <YAxis tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} name="Revenue ($)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
