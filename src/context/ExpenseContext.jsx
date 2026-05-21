// context/ExpenseContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import useAuth from "../hooks/useAuth";
import { API_URL } from "../constants";

const ExpenseContext = createContext();

export function ExpenseProvider({ children }) {
  // const { user } = useAuth(); // ← Firebase user থেকে uid ও email নেওয়া হচ্ছে

  const auth = useAuth();
  const user = auth?.user ?? null;

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Fetch expenses (with optional filters) ──────────────────────────────
  const fetchExpenses = useCallback(
    async ({ type, cat, search } = {}) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();

        // ✅ Always send uid so each user sees only their data
        if (user?.uid) params.set("uid", user.uid);
        else if (user?.email) params.set("email", user.email);

        if (type && type !== "All") params.set("type", type);
        if (cat && cat !== "All") params.set("cat", cat);
        if (search) params.set("search", search);

        const res = await fetch(`${API_URL}/expenses?${params}`);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setExpenses(data);
      } catch (err) {
        setError(err.message);
        console.error("fetchExpenses error:", err);
      } finally {
        setLoading(false);
      }
    },
    [user],
  );

  // ── Add expense ──────────────────────────────────────────────────────────
  const addExpense = useCallback(
    async ({ desc, amt, type, cat, date }) => {
      const res = await fetch(`${API_URL}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          desc,
          amt,
          type,
          cat,
          date,
          // ✅ uid + email দুটোই পাঠাচ্ছি
          uid: user?.uid || null,
          email: user?.email || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add expense");
      }

      const newExpense = await res.json();
      // Optimistically prepend to list
      setExpenses((prev) => [newExpense, ...prev]);
      return newExpense;
    },
    [user],
  );

  // ── Delete expense ───────────────────────────────────────────────────────
  const deleteExpense = useCallback(async (id) => {
    const res = await fetch(`${API_URL}/expenses/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to delete expense");
    }

    // Remove from local state immediately
    setExpenses((prev) => prev.filter((e) => e._id !== id));
  }, []);

  // ── Update expense ───────────────────────────────────────────────────────
  const updateExpense = useCallback(async (id, updates) => {
    const res = await fetch(`${API_URL}/expenses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update expense");
    }

    const updated = await res.json();
    setExpenses((prev) => prev.map((e) => (e._id === id ? updated : e)));
    return updated;
  }, []);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        loading,
        error,
        fetchExpenses,
        addExpense,
        deleteExpense,
        updateExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error("useExpenses must be used inside ExpenseProvider");
  return ctx;
}
