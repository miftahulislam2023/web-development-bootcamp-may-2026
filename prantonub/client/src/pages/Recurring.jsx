import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";
import { CATEGORIES, CATEGORY_ICONS, formatCurrency } from "../utils/helpers";

const FREQ_LABELS = { daily: "Daily", weekly: "Weekly", monthly: "Monthly" };

export default function Recurring() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food & Dining",
    type: "expense",
    frequency: "monthly",
    note: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const cur = user?.currency || "USD";

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/recurring");
      setItems(data.recurring);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm({
      title: "",
      amount: "",
      category: "Food & Dining",
      type: "expense",
      frequency: "monthly",
      note: "",
    });
    setError("");
    setShowModal(true);
  };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      title: item.title,
      amount: item.amount,
      category: item.category,
      type: item.type,
      frequency: item.frequency,
      note: item.note || "",
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (editItem)
        await api.put(`/recurring/${editItem._id}`, {
          ...form,
          amount: Number(form.amount),
        });
      else
        await api.post("/recurring", { ...form, amount: Number(form.amount) });
      setShowModal(false);
      fetch();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    await api.delete(`/recurring/${deleteId}`);
    setDeleteId(null);
    fetch();
  };
  const handleToggle = async (id) => {
    await api.patch(`/recurring/${id}/toggle`);
    fetch();
  };

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Recurring Transactions</h1>
          <p className="page-sub">Auto-generate transactions on schedule</p>
        </div>
        <button onClick={openAdd} className="btn-primary btn-sm">
          + Add Recurring
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : items.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No recurring transactions"
            sub="Set up automatic transactions for bills, salary, subscriptions..."
            action={
              <button onClick={openAdd} className="btn-primary btn-sm">
                + Add Recurring
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item) => {
            return (
              <div
                key={item._id}
                className={`card p-5 transition-all ${!item.isActive ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-400">{item.category}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1 text-gray-400 hover:text-primary-600 transition-colors text-lg"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => setDeleteId(item._id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors text-lg"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-xl font-bold ${item.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}
                    >
                      {item.type === "income" ? "+" : "−"}
                      {formatCurrency(item.amount, cur)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {/* FIX 1: Replaced BiCalendar with emoji */}
                      <span className="text-gray-500 text-sm">📅</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {FREQ_LABELS[item.frequency]}
                      </span>
                      <span
                        className={`badge text-xs ${item.type === "income" ? "badge-income" : "badge-expense"}`}
                      >
                        {item.type}
                      </span>
                    </div>
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={() => handleToggle(item._id)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${item.isActive ? "bg-primary-600" : "bg-gray-300 dark:bg-gray-600"}`}
                  >
                    <div
                      className={`absolute w-5 h-5 bg-white rounded-full top-0.5 shadow transition-all duration-200 ${item.isActive ? "left-6" : "left-0.5"}`}
                    />
                  </button>
                </div>

                {item.lastGenerated && (
                  <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                    Last generated:{" "}
                    {new Date(item.lastGenerated).toLocaleDateString()}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <Modal
          title={editItem ? "Edit Recurring" : "Add Recurring"}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSave} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 text-sm px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {["expense", "income"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: t }))}
                  className={`flex-1 py-2.5 text-sm font-semibold capitalize transition-all flex items-center justify-center gap-2 ${
                    form.type === t
                      ? t === "expense"
                        ? "bg-red-50 dark:bg-red-900/30 text-red-600"
                        : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600"
                      : "text-gray-400"
                  }`}
                >
                  {/* FIX 2 & 3: Replaced MdTrendingDown and MdTrendingUp with emojis */}
                  {t === "expense" ? <span>📉</span> : <span>📈</span>}
                  {t}
                </button>
              ))}
            </div>

            <div>
              <label className="label">Title</label>
              <input
                className="input"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="e.g. Netflix, Rent..."
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Amount</label>
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, amount: e.target.value }))
                  }
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="label">Frequency</label>
                <select
                  className="input"
                  value={form.frequency}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, frequency: e.target.value }))
                  }
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">Category</label>
              <select
                className="input"
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">
                Note <span className="text-gray-400">(optional)</span>
              </label>
              <input
                className="input"
                value={form.note}
                onChange={(e) =>
                  setForm((f) => ({ ...f, note: e.target.value }))
                }
                placeholder="e.g. Monthly subscription"
              />
            </div>
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
                {saving ? "Saving..." : editItem ? "Update" : "Add Recurring"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete Recurring"
          message="Delete this recurring transaction?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
