"use client";

import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const PIE_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

function Empty({ message }) {
  return (
    <p className="flex h-48 items-center justify-center text-sm text-[var(--muted-foreground)]">
      {message}
    </p>
  );
}

export function AdminOverviewCharts({
  revenueSeries,
  userGrowth,
  purchaseDistribution,
  templateUsage,
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartCard title="Revenue (30 days)" subtitle="Succeeded payments per day">
        {revenueSeries?.length ? (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueSeries}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} name="USD" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <Empty message="No revenue in the last 30 days." />
        )}
      </ChartCard>

      <ChartCard title="User growth" subtitle="New registrations per day">
        {userGrowth?.length ? (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Line type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={2} dot={false} name="Users" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <Empty message="No new users in the last 30 days." />
        )}
      </ChartCard>

      <ChartCard title="Purchase distribution" subtitle="All purchase records by status">
        {purchaseDistribution?.length ? (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={purchaseDistribution} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>
                  {purchaseDistribution.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <Empty message="No purchase data." />
        )}
      </ChartCard>

      <ChartCard title="Template sales" subtitle="Top templates by successful purchases">
        {templateUsage?.length ? (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={templateUsage} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <Empty message="No template sales yet." />
        )}
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
      <h3 className="font-display text-sm font-semibold">{title}</h3>
      <p className="mb-4 text-xs text-[var(--muted-foreground)]">{subtitle}</p>
      {children}
    </div>
  );
}
