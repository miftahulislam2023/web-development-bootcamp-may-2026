import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";
import { CATEGORIES, CATEGORY_ICONS, formatCurrency } from "../utils/helpers";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function BudgetCard({ budget, currency, onDelete }) {
  const { category, amount, spent, percentage } = budget;
  const safe = percentage < 70,
    warn = percentage >= 70 && percentage < 100,
    over = percentage >= 100;
  const color = over ? "bg-red-500" : warn ? "bg-amber-400" : "bg-emerald-500";
  const badge = over
    ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
    : warn
      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
      : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
  const statusColor = over
    ? "text-red-500"
    : warn
      ? "text-amber-500"
      : "text-emerald-500";
  const statusText = over ? "Over Budget" : warn ? "Near Limit" : "On Track";

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {category}
            </p>
            <div className={`badge text-xs ${badge} flex items-center gap-1`}>
              ● {statusText}
            </div>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="text-gray-300 hover:text-red-400 transition-colors p-1 text-lg"
        >
          ✕
        </button>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Spent:{" "}
            <strong className="text-gray-800 dark:text-gray-200">
              {formatCurrency(spent, currency)}
            </strong>
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            Budget: <strong>{formatCurrency(amount, currency)}</strong>
          </span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${color}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 text-right">
          {percentage}% used ·{" "}
          {formatCurrency(Math.max(amount - spent, 0), currency)} remaining
        </p>
      </div>
    </div>
  );
}

export default function Budgets() {
  const { user } = useAuth();
  const now = new Date();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [form, setForm] = useState({ category: "Food & Dining", amount: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const cur = user?.currency || "USD";

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/budgets?month=${month}&year=${year}`);
      setBudgets(data.budgets);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [month, year]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.post("/budgets", {
        ...form,
        month,
        year,
        amount: Number(form.amount),
      });
      setShowModal(false);
      setForm({ category: "Food & Dining", amount: "" });
      fetch();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    await api.delete(`/budgets/${deleteId}`);
    setDeleteId(null);
    fetch();
  };

  const totalBudget = budgets.reduce((s, b) => s + b.amount, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);

  const usedCategories = budgets.map((b) => b.category);
  const availableCategories = CATEGORIES.filter(
    (c) => !usedCategories.includes(c),
  );

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Budget Goals</h1>
          <p className="page-sub">Set and track monthly spending limits</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            className="input text-sm !w-auto"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {MONTHS.map((m, i) => (
              <option key={i} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <select
            className="input text-sm !w-auto"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {[2023, 2024, 2025, 2026].map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
          {availableCategories.length > 0 && (
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary btn-sm whitespace-nowrap"
            >
              + Set Budget
            </button>
          )}
        </div>
      </div>

      {/* Summary cards */}
      {budgets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card p-5 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Total Budget
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalBudget, cur)}
            </p>
          </div>
          <div className="card p-5 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Total Spent
            </p>
            <p className="text-2xl font-bold text-red-500">
              {formatCurrency(totalSpent, cur)}
            </p>
          </div>
          <div className="card p-5 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Remaining
            </p>
            <p
              className={`text-2xl font-bold ${totalBudget - totalSpent >= 0 ? "text-emerald-600" : "text-red-500"}`}
            >
              {formatCurrency(Math.max(totalBudget - totalSpent, 0), cur)}
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : budgets.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No budgets set"
            sub={`Set spending limits for ${MONTHS[month - 1]} ${year}`}
            action={
              availableCategories.length > 0 ? (
                <button
                  onClick={() => setShowModal(true)}
                  className="btn-primary btn-sm"
                >
                  + Set Budget
                </button>
              ) : null
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {budgets.map((b) => (
            <BudgetCard
              key={b._id}
              budget={b}
              currency={cur}
              onDelete={() => setDeleteId(b._id)}
            />
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="Set Budget" onClose={() => setShowModal(false)} size="sm">
          <form onSubmit={handleSave} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="label">Category</label>
              <select
                className="input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {availableCategories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Budget Amount ({cur})</label>
              <input
                className="input"
                type="number"
                min="1"
                step="0.01"
                placeholder="500.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </div>
            <p className="text-xs text-gray-400">
              Budget for {MONTHS[month - 1]} {year}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex-1"
              >
                {saving ? "Saving..." : "Save Budget"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          title="Remove Budget"
          message="Remove this budget goal?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
