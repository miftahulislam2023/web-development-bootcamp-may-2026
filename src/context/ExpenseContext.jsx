import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { API_URL } from "../constants";

const ExpenseContext = createContext(null);

export function ExpenseProvider({ children }) {
  const [expenses,  setExpenses]  = useState([]);
  const [summary,   setSummary]   = useState({ totalIncome: 0, totalExpense: 0, balance: 0, count: 0 });
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  /* ── fetch all expenses (optional server-side filters) ── */
  const fetchExpenses = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.type   && filters.type   !== "All") params.set("type",   filters.type);
      if (filters.cat    && filters.cat    !== "All") params.set("cat",    filters.cat);
      if (filters.search && filters.search.trim())    params.set("search", filters.search);

      const res  = await fetch(`${API_URL}/expenses${params.toString() ? "?" + params : ""}`);
      if (!res.ok) throw new Error("Failed to fetch expenses");
      const data = await res.json();
      setExpenses(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── fetch summary totals ── */
  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/expenses/summary`);
      if (!res.ok) throw new Error("Failed to fetch summary");
      setSummary(await res.json());
    } catch (err) {
      console.error("Summary error:", err.message);
    }
  }, []);

  /* ── add expense ── */
  const addExpense = useCallback(async (expense) => {
    const res = await fetch(`${API_URL}/expenses`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(expense),
    });
    if (!res.ok) {
      const { error: msg } = await res.json();
      throw new Error(msg || "Failed to add expense");
    }
    const created = await res.json();
    setExpenses(prev => [created, ...prev]);   // optimistic prepend
    fetchSummary();
    return created;
  }, [fetchSummary]);

  /* ── update expense ── */
  const updateExpense = useCallback(async (id, updates) => {
    const res = await fetch(`${API_URL}/expenses/${id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(updates),
    });
    if (!res.ok) {
      const { error: msg } = await res.json();
      throw new Error(msg || "Failed to update");
    }
    const updated = await res.json();
    setExpenses(prev => prev.map(e => e._id === id ? updated : e));
    fetchSummary();
    return updated;
  }, [fetchSummary]);

  /* ── delete expense (optimistic) ── */
  const deleteExpense = useCallback(async (id) => {
    setExpenses(prev => prev.filter(e => e._id !== id));   // remove instantly
    try {
      const res = await fetch(`${API_URL}/expenses/${id}`, { method: "DELETE" });
      if (!res.ok) { fetchExpenses(); throw new Error("Delete failed"); } // rollback
      fetchSummary();
    } catch (err) {
      setError(err.message);
    }
  }, [fetchExpenses, fetchSummary]);

  /* ── derived helpers (same API as old context) ── */
  const totalIncome  = summary.totalIncome;
  const totalExpense = summary.totalExpense;
  const balance      = summary.balance;

  const now = new Date();

  const monthlyExpense = expenses
    .filter(e =>
      e.type === "expense" &&
      new Date(e.date).getMonth()    === now.getMonth() &&
      new Date(e.date).getFullYear() === now.getFullYear()
    )
    .reduce((s, e) => s + e.amt, 0);

  function byCategory() {
    const map = {};
    expenses
      .filter(e => e.type === "expense")
      .forEach(e => { map[e.cat] = (map[e.cat] || 0) + e.amt; });
    return map;
  }

  function byMonth(n = 6, type = "expense") {
    return Array.from({ length: n }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (n - 1) + i, 1);
      const total = expenses
        .filter(e =>
          e.type === type &&
          new Date(e.date).getMonth()    === d.getMonth() &&
          new Date(e.date).getFullYear() === d.getFullYear()
        )
        .reduce((s, e) => s + e.amt, 0);
      return { month: d.getMonth(), year: d.getFullYear(), total };
    });
  }

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, [fetchExpenses, fetchSummary]);

  return (
    <ExpenseContext.Provider value={{
      /* raw state */
      expenses, loading, error,
      /* actions */
      addExpense, updateExpense, deleteExpense, fetchExpenses, fetchSummary,
      /* summary */
      summary,
      /* derived — 100% backward-compatible with old context */
      totalIncome, totalExpense, balance, monthlyExpense,
      byCategory, byMonth,
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenses = () => {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error("useExpenses must be used inside <ExpenseProvider>");
  return ctx;
};