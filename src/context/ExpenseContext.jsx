import { createContext, useContext, useState } from "react";

const ExpenseCtx = createContext(null);

const SEED = [
  { id: 1,  desc: "Pizza Hut",       amt: 15,   type: "expense", cat: "Food",          date: "2025-05-10" },
  { id: 2,  desc: "Spotify",          amt: 9,    type: "expense", cat: "Entertainment", date: "2025-05-09" },
  { id: 3,  desc: "Uber",             amt: 12,   type: "expense", cat: "Transport",     date: "2025-05-08" },
  { id: 4,  desc: "Gym membership",   amt: 30,   type: "expense", cat: "Sport",         date: "2025-05-07" },
  { id: 5,  desc: "Salary",           amt: 3200, type: "income",  cat: "Other",         date: "2025-05-01" },
  { id: 6,  desc: "Electricity bill", amt: 55,   type: "expense", cat: "Bills",         date: "2025-04-28" },
  { id: 7,  desc: "Groceries",        amt: 48,   type: "expense", cat: "Food",          date: "2025-04-25" },
  { id: 8,  desc: "Netflix",          amt: 14,   type: "expense", cat: "Entertainment", date: "2025-04-20" },
  { id: 9,  desc: "Pharmacy",         amt: 22,   type: "expense", cat: "Health",        date: "2025-04-18" },
  { id: 10, desc: "Freelance",        amt: 800,  type: "income",  cat: "Other",         date: "2025-04-15" },
  { id: 11, desc: "Zara",             amt: 65,   type: "expense", cat: "Shopping",      date: "2025-04-10" },
  { id: 12, desc: "Bus pass",         amt: 18,   type: "expense", cat: "Transport",     date: "2025-04-05" },
];

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState(SEED);

  function addExpense(entry) {
    setExpenses(prev => [{ ...entry, id: Date.now() }, ...prev]);
  }

  function deleteExpense(id) {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }

  /* ── derived helpers ── */
  const totalIncome  = expenses.filter(e => e.type === "income").reduce((s, e) => s + e.amt, 0);
  const totalExpense = expenses.filter(e => e.type === "expense").reduce((s, e) => s + e.amt, 0);
  const balance      = totalIncome - totalExpense;

  const now = new Date();
  const monthlyExpense = expenses
    .filter(e => e.type === "expense" && new Date(e.date).getMonth() === now.getMonth())
    .reduce((s, e) => s + e.amt, 0);

  /** spending per category (expenses only) */
  function byCategory() {
    const map = {};
    expenses.filter(e => e.type === "expense").forEach(e => {
      map[e.cat] = (map[e.cat] || 0) + e.amt;
    });
    return map;
  }

  /** spending per month for last N months */
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

  return (
    <ExpenseCtx.Provider value={{
      expenses, addExpense, deleteExpense,
      totalIncome, totalExpense, balance, monthlyExpense,
      byCategory, byMonth,
    }}>
      {children}
    </ExpenseCtx.Provider>
  );
}

export const useExpenses = () => useContext(ExpenseCtx);