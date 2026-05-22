import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import TransactionModal from "../components/TransactionModal";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import {
  SkeletonCard,
  SkeletonChart,
  SkeletonRow,
} from "../components/Skeleton";
import {
  formatCurrency,
  MONTH_NAMES,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  pctChange,
} from "../utils/helpers";

const COLORS = [
  "#7c3aed",
  "#a855f7",
  "#ec4899",
  "#f97316",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#06b6d4",
  "#6366f1",
  "#84cc16",
  "#94a3b8",
];

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const cur = user?.currency || "USD";

  const fetch = async () => {
    try {
      const { data } = await api.get("/transactions/summary");
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  // Build monthly bar chart data
  const monthlyChartData = (() => {
    if (!summary?.monthlyTrend) return [];
    const map = {};
    summary.monthlyTrend.forEach(({ _id, total }) => {
      const key = `${MONTH_NAMES[_id.m - 1]} ${_id.y}`;
      if (!map[key])
        map[key] = { name: MONTH_NAMES[_id.m - 1], Income: 0, Expense: 0 };
      if (_id.type === "income") map[key].Income = Math.round(total);
      else map[key].Expense = Math.round(total);
    });
    return Object.values(map).slice(-6);
  })();

  const pieData =
    summary?.categoryBreakdown
      ?.slice(0, 8)
      .map((c) => ({ name: c._id, value: Math.round(c.total) })) || [];

  const savings =
    (summary?.thisMonth?.income || 0) - (summary?.thisMonth?.expense || 0);
  const expPct = pctChange(
    summary?.thisMonth?.expense,
    summary?.lastMonth?.expense,
  );
  const incPct = pctChange(
    summary?.thisMonth?.income,
    summary?.lastMonth?.income,
  );

  const greeting =
    new Date().getHours() < 12
      ? "Good morning"
      : new Date().getHours() < 17
        ? "Good afternoon"
        : "Good evening";

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="page-header">
          <div>
            <div className="skeleton-text w-48 h-8 mb-2" />
            <div className="skeleton-text w-64 h-4" />
          </div>
          <div className="skeleton h-10 w-40 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonChart />
          <SkeletonChart />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {greeting}, {user?.name?.split(" ")[0]} 
          </h1>
          <p className="page-sub">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <span className="text-xl leading-none">+</span> Add Transaction
        </button>
      </div>

      {/* Stat cards with staggered animation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Income"
          value={formatCurrency(summary?.thisMonth?.income || 0, cur)}
          icon="💰"
          color="bg-emerald-50 dark:bg-emerald-900/20"
          sub={
            incPct
              ? `${incPct > 0 ? "+" : ""}${incPct}% vs last month`
              : "No prior data"
          }
          trend={incPct > 0 ? "up" : incPct < 0 ? "down" : null}
        />
        <StatCard
          title="Monthly Expenses"
          value={formatCurrency(summary?.thisMonth?.expense || 0, cur)}
          icon="💸"
          color="bg-red-50 dark:bg-red-900/20"
          sub={
            expPct
              ? `${expPct > 0 ? "+" : ""}${expPct}% vs last month`
              : "No prior data"
          }
          trend={expPct > 0 ? "down" : expPct < 0 ? "up" : null}
        />
        <StatCard
          title="Net Savings"
          value={formatCurrency(savings, cur)}
          icon={savings >= 0 ? "🏦" : "⚠️"}
          color={
            savings >= 0
              ? "bg-primary-50 dark:bg-primary-900/20"
              : "bg-amber-50 dark:bg-amber-900/20"
          }
          sub="Income minus expenses"
        />
        <StatCard
          title="Transactions"
          value={summary?.recentTransactions?.length ?? 0}
          icon="📋"
          color="bg-blue-50 dark:bg-blue-900/20"
          sub="Recent entries"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart */}
        <div className="card p-6 lg:col-span-2 hover:shadow-card-hover transition-all duration-300">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">
              Income vs Expenses
            </h2>
            <Link
              to="/analytics"
              className="text-sm text-primary-600 hover:text-primary-700 dark:hover:text-primary-400 font-medium transition-colors"
            >
              Full analytics →
            </Link>
          </div>
          {monthlyChartData.length > 0 ? (
            <div className="animate-slide-up">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyChartData} barGap={4} barSize={20}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--tw-prose-hr, #f0f0f0)"
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
                    formatter={(v, n) => [`$${v}`, n]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      fontSize: "13px",
                    }}
                  />
                  <Bar dataKey="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Expense" fill="#f97316" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              icon="📊"
              title="No data yet"
              sub="Add transactions to see charts"
            />
          )}
        </div>

        {/* Pie chart */}
        <div className="card p-6 hover:shadow-card-hover transition-all duration-300">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-5">
            Spending by Category
          </h2>
          {pieData.length > 0 ? (
            <div className="animate-slide-up">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((e, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => `$${v}`}
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
          ) : (
            <EmptyState icon="🥧" title="No categories yet" />
          )}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="card p-6 hover:shadow-card-hover transition-all duration-300">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">
            Recent Transactions
          </h2>
          <Link
            to="/transactions"
            className="text-sm text-primary-600 hover:text-primary-700 dark:hover:text-primary-400 font-medium transition-colors"
          >
            View all →
          </Link>
        </div>
        {summary?.recentTransactions?.length > 0 ? (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {summary.recentTransactions.map((t, i) => (
              <div
                key={t._id}
                className="flex items-center justify-between py-3.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 px-2 rounded-lg"
                style={{ animation: `slideUp 0.4s ease-out ${i * 50}ms both` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-lg flex-shrink-0 transition-transform hover:scale-110">
                    {CATEGORY_ICONS[t.category] || "💳"}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                      {t.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t.category} · {new Date(t.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`font-bold text-sm transition-colors ${t.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}
                >
                  {t.type === "income" ? "+" : "−"}
                  {formatCurrency(t.amount, cur)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="📝"
            title="No transactions yet"
            sub="Add your first transaction to get started"
            action={
              <button
                onClick={() => setShowModal(true)}
                className="btn-primary btn-sm"
              >
                Add Transaction
              </button>
            }
          />
        )}
      </div>

      {showModal && (
        <TransactionModal
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
            fetch();
          }}
        />
      )}
    </div>
  );
}
