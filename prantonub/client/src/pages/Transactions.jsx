import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import TransactionModal from "../components/TransactionModal";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";
import {
  CATEGORIES,
  CATEGORY_ICONS,
  formatCurrency,
  formatDate,
} from "../utils/helpers";

export default function Transactions() {
  const { user } = useAuth();
  const [data, setData] = useState({ transactions: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    type: "",
    search: "",
    page: 1,
    startDate: "",
    endDate: "",
  });
  const cur = user?.currency || "USD";

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page: filters.page, limit: 15 });
      if (filters.category) p.set("category", filters.category);
      if (filters.type) p.set("type", filters.type);
      if (filters.search) p.set("search", filters.search);
      if (filters.startDate) p.set("startDate", filters.startDate);
      if (filters.endDate) p.set("endDate", filters.endDate);
      const { data: res } = await api.get(`/transactions?${p}`);
      setData({
        transactions: res.transactions,
        total: res.total,
        pages: res.pages,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleDelete = async () => {
    await api.delete(`/transactions/${deleteId}`);
    setDeleteId(null);
    fetch();
  };

  const setFilter = (k, v) => setFilters((f) => ({ ...f, [k]: v, page: 1 }));
  const clearFilters = () =>
    setFilters({ category: "", type: "", search: "", page: 1, startDate: "", endDate: "" });
  const hasFilters =
    filters.category || filters.type || filters.search || filters.startDate || filters.endDate;

  const handleExportCSV = async () => {
    try {
      const p = new URLSearchParams();
      if (filters.type) p.set("type", filters.type);
      if (filters.category) p.set("category", filters.category);
      if (filters.startDate) p.set("startDate", filters.startDate);
      if (filters.endDate) p.set("endDate", filters.endDate);

      const response = await api.get(`/export/csv?${p}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `transactions-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("CSV export failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-sub">{data.total} total records</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="btn-secondary btn-sm">
            ⬇️ CSV
          </button>
          <button onClick={() => setModal("add")} className="btn-primary btn-sm">
            <span>+</span> Add
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <input
            className="input text-sm col-span-2 md:col-span-1"
            placeholder="🔍 Search..."
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
          />
          <select
            className="input text-sm"
            value={filters.category}
            onChange={(e) => setFilter("category", e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            className="input text-sm"
            value={filters.type}
            onChange={(e) => setFilter("type", e.target.value)}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input
            className="input text-sm"
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilter("startDate", e.target.value)}
          />
          <div className="flex gap-2">
            <input
              className="input text-sm flex-1"
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilter("endDate", e.target.value)}
            />
            {hasFilters && (
              <button onClick={clearFilters} className="btn-secondary btn-sm whitespace-nowrap">
                ✕ Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : data.transactions.length === 0 ? (
          <EmptyState
            icon="📭"
            title="No transactions found"
            sub="Try adjusting your filters or add a new transaction"
            action={
              <button onClick={() => setModal("add")} className="btn-primary btn-sm">
                + Add Transaction
              </button>
            }
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    {["Transaction", "Category", "Date", "Type", "Amount", "Actions"].map((h) => (
                      <th
                        key={h}
                        className={`px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider ${
                          h === "Amount" || h === "Actions" ? "text-right" : "text-left"
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
                  {data.transactions.map((t) => (
                    <tr
                      key={t._id}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl w-8 text-center flex-shrink-0">
                            {CATEGORY_ICONS[t.category] || "💳"}
                          </span>
                          <div>
                            <p className="font-medium text-sm text-gray-800 dark:text-gray-200">
                              {t.title}
                            </p>
                            {t.note && (
                              <p className="text-xs text-gray-400 truncate max-w-[200px]">
                                {t.note}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-full">
                          {t.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(t.date)}
                      </td>
                      <td className="px-5 py-4">
                        <span className={t.type === "income" ? "badge-income" : "badge-expense"}>
                          {t.type}
                        </span>
                      </td>
                      <td
                        className={`px-5 py-4 text-right font-bold text-sm ${
                          t.type === "income"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-500 dark:text-red-400"
                        }`}
                      >
                        {t.type === "income" ? "+" : "−"}
                        {formatCurrency(t.amount, cur)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setModal(t)}
                            className="btn-secondary btn-sm"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => setDeleteId(t._id)}
                            className="btn btn-sm bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-50 dark:divide-gray-800">
              {data.transactions.map((t) => (
                <div
                  key={t._id}
                  className="flex items-center justify-between px-4 py-4 gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl flex-shrink-0">
                      {CATEGORY_ICONS[t.category] || "💳"}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate">
                        {t.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {t.category} · {formatDate(t.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`font-bold text-sm ${
                        t.type === "income" ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {t.type === "income" ? "+" : "−"}
                      {formatCurrency(t.amount, cur)}
                    </span>
                    <button
                      onClick={() => setModal(t)}
                      className="text-primary-600 p-1 hover:text-primary-700"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setDeleteId(t._id)}
                      className="text-red-500 p-1 hover:text-red-600"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data.pages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-400">
                  Page {filters.page} of {data.pages}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={filters.page === 1}
                    onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                    className="btn-secondary btn-sm disabled:opacity-40"
                  >
                    ← Prev
                  </button>
                  <button
                    disabled={filters.page === data.pages}
                    onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                    className="btn-secondary btn-sm disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {modal && (
        <TransactionModal
          transaction={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSave={() => {
            setModal(null);
            fetch();
          }}
        />
      )}
      {deleteId && (
        <ConfirmDialog
          title="Delete Transaction"
          message="This action cannot be undone. Are you sure?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}