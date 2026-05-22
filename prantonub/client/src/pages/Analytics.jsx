import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import { CATEGORY_ICONS, formatCurrency, MONTH_NAMES } from "../utils/helpers";

const COLORS = [
  "#7c3aed",
  "#ec4899",
  "#f97316",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#06b6d4",
  "#6366f1",
  "#84cc16",
  "#a855f7",
  "#94a3b8",
];

export default function Analytics() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const cur = user?.currency || "USD";

  useEffect(() => {
    api
      .get("/transactions/summary")
      .then((r) => setSummary(r.data.summary))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );

  // Area + Line trend
  const trendData = (() => {
    if (!summary?.monthlyTrend) return [];
    const map = {};
    summary.monthlyTrend.forEach(({ _id, total }) => {
      const key = `${MONTH_NAMES[_id.m - 1]}`;
      if (!map[key]) map[key] = { name: key, Income: 0, Expense: 0 };
      if (_id.type === "income") map[key].Income = Math.round(total);
      else map[key].Expense = Math.round(total);
    });
    return Object.values(map)
      .slice(-6)
      .map((m) => ({ ...m, Savings: m.Income - m.Expense }));
  })();

  const pieData =
    summary?.categoryBreakdown
      ?.slice(0, 10)
      .map((c) => ({ name: c._id, value: Math.round(c.total) })) || [];
  const barData =
    summary?.categoryBreakdown?.slice(0, 8).map((c) => ({
      name: c._id.split(" ")[0],
      full: c._id,
      amount: Math.round(c.total),
      count: c.count,
    })) || [];
  const totalExpense = summary?.thisMonth?.expense || 0;

  const noData = trendData.length === 0 && pieData.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Analytics</h1>
        <p className="page-sub">Deep insights into your spending patterns</p>
      </div>

      {noData ? (
        <div className="card p-6">
          <EmptyState
            title="No data to analyze"
            sub="Add transactions to see your spending analytics"
          />
        </div>
      ) : (
        <>
          {/* Area chart — trend */}
          {trendData.length > 0 && (
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 dark:text-white mb-5">
                6-Month Cash Flow
              </h2>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="gInc" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#10b981"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#f97316"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    formatter={(v, n) => [formatCurrency(v, cur), n]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      fontSize: "13px",
                    }}
                  />
                  <Legend iconType="circle" iconSize={8} />
                  <Area
                    type="monotone"
                    dataKey="Income"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fill="url(#gInc)"
                  />
                  <Area
                    type="monotone"
                    dataKey="Expense"
                    stroke="#f97316"
                    strokeWidth={2.5}
                    fill="url(#gExp)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Savings line + Pie */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {trendData.length > 0 && (
              <div className="card p-6">
                <h2 className="font-bold text-gray-900 dark:text-white mb-5">
                  Monthly Savings Trend
                </h2>
                <ResponsiveContainer width="100%" height={230}>
                  <LineChart data={trendData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f0f0"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${v}`}
                    />
                    <Tooltip
                      formatter={(v) => [formatCurrency(v, cur), "Savings"]}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Savings"
                      stroke="#7c3aed"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "#7c3aed" }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {pieData.length > 0 && (
              <div className="card p-6">
                <h2 className="font-bold text-gray-900 dark:text-white mb-5">
                  Expense Breakdown
                </h2>
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="45%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => [formatCurrency(v, cur)]}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                        fontSize: "12px",
                      }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(v) => (
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {v}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Horizontal bar + category table */}
          {barData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card p-6">
                <h2 className="font-bold text-gray-900 dark:text-white mb-5">
                  Top Spending Categories
                </h2>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barData} layout="vertical" barSize={14}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f0f0"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${v}`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      axisLine={false}
                      tickLine={false}
                      width={65}
                    />
                    <Tooltip
                      labelFormatter={(_, p) => p?.[0]?.payload?.full || ""}
                      formatter={(v) => [formatCurrency(v, cur), "Amount"]}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                      }}
                    />
                    <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                      {barData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Category detail table */}
              <div className="card p-6">
                <h2 className="font-bold text-gray-900 dark:text-white mb-5">
                  Category Details
                </h2>
                <div className="space-y-3">
                  {summary?.categoryBreakdown?.slice(0, 8).map((cat, i) => {
                    const pct =
                      totalExpense > 0
                        ? ((cat.total / totalExpense) * 100).toFixed(1)
                        : 0;
                    return (
                      <div key={cat._id} className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700 dark:text-gray-300 truncate">
                              {cat._id}
                            </span>
                            <span className="text-gray-400 ml-2 flex-shrink-0">
                              {formatCurrency(cat.total, cur)} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full"
                              style={{
                                width: `${Math.min(pct, 100)}%`,
                                backgroundColor: COLORS[i % COLORS.length],
                              }}
                            />
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {cat.count}x
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
