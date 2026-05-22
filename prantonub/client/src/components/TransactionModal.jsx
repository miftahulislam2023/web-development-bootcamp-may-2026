import { useState } from "react";
import api from "../api/axios";
import Modal from "./Modal";
import { CATEGORIES } from "../utils/helpers";

export default function TransactionModal({ transaction, onClose, onSave }) {
  const [form, setForm] = useState({
    title: transaction?.title || "",
    amount: transaction?.amount || "",
    category: transaction?.category || "Food & Dining",
    type: transaction?.type || "expense",
    date: transaction?.date ? new Date(transaction.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    note: transaction?.note || "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (transaction) await api.put(`/transactions/${transaction._id}`, form);
      else await api.post("/transactions", form);
      onSave();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save");
    } finally { setLoading(false); }
  };

  return (
    <Modal title={transaction ? "Edit Transaction" : "Add Transaction"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>}

        {/* Type Toggle */}
        <div className="flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {["expense","income"].map(t => (
            <button key={t} type="button" onClick={() => set("type", t)}
              className={`flex-1 py-2.5 text-sm font-semibold capitalize transition-all ${
                form.type === t
                  ? t === "expense" ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                  : "text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}>
              {t === "expense" ? "💸 Expense" : "💰 Income"}
            </button>
          ))}
        </div>

        <div>
          <label className="label">Title</label>
          <input className="input" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. Grocery shopping" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Amount</label>
            <input className="input" type="number" step="0.01" min="0.01" value={form.amount} onChange={e=>set("amount",e.target.value)} placeholder="0.00" required />
          </div>
          <div>
            <label className="label">Date</label>
            <input className="input" type="date" value={form.date} onChange={e=>set("date",e.target.value)} required />
          </div>
        </div>
        <div>
          <label className="label">Category</label>
          <select className="input" value={form.category} onChange={e=>set("category",e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Note <span className="text-gray-400">(optional)</span></label>
          <textarea className="input resize-none" rows={2} value={form.note} onChange={e=>set("note",e.target.value)} placeholder="Add a note..." />
        </div>
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? "Saving..." : transaction ? "Update" : "Add"}</button>
        </div>
      </form>
    </Modal>
  );
}
