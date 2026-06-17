"use client";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  ShoppingCart,
  Bike,
  UtensilsCrossed,
  Wifi,
  Building2,
} from "lucide-react";

const PIE_COLORS = [
  "#6366F1",
  "#10B981",
  "#EF4444",
  "#F59E0B",
  "#94A3B8",
  "#8B5CF6",
  "#06B6D4",
  "#F97316",
  "#14B8A6",
  "#A855F7",
  "#E11D48",
  "#22C55E",
  "#3B82F6",
  "#FACC15",
];

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
  Legend, // ← add these
} from "recharts";

export default function DashboardPage() {
  const [userName, setUserName] = useState("there");
  const [summary, setSummary] = useState({ balance: 0, income: 0, expense: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, []);
  // ── fetch username from localStorage ──
  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      const user = JSON.parse(stored);
      setUserName(user.name);
    }
  }, []);

  // ── fetch summary API ──
  const token =
  typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          "https://personal-expense-tracker-r33t.onrender.com/api/user/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await res.json();
        setSummary({
          balance: data.currentBalance,
          income: data.totalIncome,
          expense: data.totalExpense,
        });
        console.log(data);
      } catch (err) {
        toast.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  //- fetching chart data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          "https://personal-expense-tracker-r33t.onrender.com/api/user/chartData",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await res.json();
        setChartData(data);
        console.log(data);
      } catch (err) {
        toast.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  //pie chart data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          "https://personal-expense-tracker-r33t.onrender.com/api/user/expenseCategories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await res.json();
        console.log("hello");
        console.log(data);
        setExpenseCategories(data);
        console.log(data);
      } catch (err) {
        toast.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          "https://personal-expense-tracker-r33t.onrender.com/api/transaction/show",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await res.json();
        setTransactions(data);
        console.log(data);
      } catch (err) {
        toast.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const fmt = (n) => "৳" + Number(n).toLocaleString("en-BD");

  const now = new Date().toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* ── Welcome ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Wellcome back, {userName}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Track your transaction with ExpenseTracker
          </p>
        </div>
        <div className="text-xs text-slate-400 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
          {now}
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<Wallet size={18} />}
          iconClass="bg-indigo-50 text-indigo-500"
          label="Total Balance"
          value={fmt(summary.balance)}
          trendUp
          loading={loading}
        />
        <StatCard
          icon={<ArrowUpCircle size={18} />}
          iconClass="bg-emerald-50 text-emerald-500"
          label="Total Income"
          value={fmt(summary.income)}
          valueClass="text-emerald-500"
          trendUp
          loading={loading}
        />
        <StatCard
          icon={<ArrowDownCircle size={18} />}
          iconClass="bg-rose-50 text-rose-500"
          label="Total Expense"
          value={fmt(summary.expense)}
          valueClass="text-rose-500"
          trendUp={false}
          loading={loading}
        />
      </div>

      {/* ── Chart + Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        {/* Bar chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-slate-800">
                Income vs Expense
              </p>
              <p className="text-xs text-slate-300">Recent months</p>
            </div>
            <div className="flex gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block" />
                Income
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" />
                Expense
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barCategoryGap="35%">
              <CartesianGrid vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94A3B8" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                tickFormatter={(v) => `৳${v / 1000}k`}
              />
              <Tooltip
                formatter={(v) => fmt(v)}
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #E2E8F0",
                  fontSize: 12,
                  color: "#1E293B",
                }}
              />
              <Bar dataKey="income" fill="#6366F1" radius={[5, 5, 0, 0]} />
              <Bar dataKey="expense" fill="#EF4444" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expense breakdown */}
        {/* Expense breakdown — Pie chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-slate-800">
              Expense breakdown
            </p>
          </div>

          {loading ? (
            <div className="h-[200px] bg-slate-50 rounded-xl animate-pulse" />
          ) : expenseCategories.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-xs text-slate-300">
              No expense data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={expenseCategories}
                  dataKey="amount" // ← your API field name for the value
                  nameKey="category" // ← your API field name for the label
                  cx="50%"
                  cy="45%"
                  innerRadius={55} // donut hole — set 0 for full pie
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => fmt(value)}
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #E2E8F0",
                    fontSize: 12,
                    color: "#1E293B",
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ fontSize: 11, color: "#64748B" }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Recent Transactions ── */}
      {/* <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-slate-800">
            Recent transactions
          </p>
        </div>

        <div className="flex flex-col gap-1">
          {loading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-14 bg-slate-50 rounded-xl animate-pulse"
                  />
                ))
            : transactions.map((txn) => (
                <TxnRow key={txn.id} txn={txn} fmt={fmt} />
              ))}
        </div>

        <div className="text-center mt-4">
          <a
            href="/transactions"
            className="text-sm text-indigo-500 hover:text-indigo-600"
          >
            View all transactions →
          </a>
        </div>
      </div> */}
    </div>
  );
}

// ── Sub-components ──

function StatCard({
  icon,
  iconClass,
  label,
  value,
  valueClass,
  trend,
  trendUp,
  loading,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconClass}`}
        >
          {icon}
        </div>
        <span
          className={`text-[11px] font-medium px-2 py-1 rounded-full ${
            trendUp
              ? "bg-emerald-50 text-emerald-600"
              : "bg-rose-50 text-rose-500"
          }`}
        >
          {trendUp ? "↑" : "↓"} {trend}
        </span>
      </div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        {loading ? (
          <div className="h-7 w-28 bg-slate-100 rounded animate-pulse mt-1" />
        ) : (
          <p
            className={`text-[22px] font-semibold tracking-tight mt-0.5 ${valueClass ?? "text-slate-900"}`}
          >
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

function TxnRow({ txn, fmt }) {
  return (
    <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: txn.type === "income" ? "#ECFDF5" : "#FFF5F5" }}
      >
        <txn.Icon
          size={17}
          color={txn.type === "income" ? "#10B981" : "#EF4444"}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-medium text-slate-800 truncate">
          {txn.name}
        </p>
        <p className="text-[11px] text-slate-300">{txn.date}</p>
      </div>
      <span className="text-[11px] text-slate-400 bg-slate-50 border border-slate-100 rounded-full px-2 py-0.5 hidden sm:block">
        {txn.category}
      </span>
      <p
        className={`text-sm font-semibold ${txn.type === "income" ? "text-emerald-500" : "text-rose-500"}`}
      >
        {txn.type === "income" ? "+" : "-"}
        {fmt(txn.amount)}
      </p>
    </div>
  );
}
