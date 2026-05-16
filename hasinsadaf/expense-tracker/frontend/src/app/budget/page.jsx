"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BarChartIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  Pencil1Icon,
  TargetIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import {
  getBudgets,
  getCategories,
  getExpenses,
  getProfile,
  saveBudget,
  deleteBudget,
  updateBudget,
  getToken,
} from "@/lib/api";
import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ThemeToggle";

export default function BudgetPage() {
  const router = useRouter();
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [profile, setProfile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletingBudgetId, setDeletingBudgetId] = useState(null);
  const [editingBudgetId, setEditingBudgetId] = useState(null);
  const [editingLimit, setEditingLimit] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    setSelectedMonth(currentMonth);

    const fetchData = async () => {
      try {
        const [budgetsData, categoriesData, expensesData, profileData] = await Promise.all([
          getBudgets(),
          getCategories(),
          getExpenses(),
          getProfile(),
        ]);
        setBudgets(budgetsData);
        setCategories(categoriesData);
        setExpenses(expensesData);
        setProfile(profileData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleSave = async () => {
    if (!selectedCategory || !monthlyLimit || !selectedMonth) {
      alert("Please fill all fields");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    try {
      await saveBudget({
        category_id: selectedCategory,
        monthly_limit: parseFloat(monthlyLimit),
        month: selectedMonth,
      });

      const updatedBudgets = await getBudgets();
      setBudgets(updatedBudgets);

      setSelectedCategory("");
      setMonthlyLimit("");
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      setSelectedMonth(currentMonth);

      setShowConfirm(false);
    } catch (err) {
      console.error("Failed to save budget:", err);
      alert("Failed to save budget");
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    try {
      await deleteBudget(budgetId);
      const updatedBudgets = await getBudgets();
      setBudgets(updatedBudgets);
      setDeletingBudgetId(null);
    } catch (err) {
      console.error("Failed to delete budget:", err);
      alert("Failed to delete budget");
    }
  };

  async function handleUpdateBudget(id, newLimit) {
    if (!newLimit || Number(newLimit) <= 0) {
      toast.error("Please enter a valid amount greater than 0");
      return;
    }
    try {
      await updateBudget(id, { monthly_limit: Number(newLimit) });
      toast.success("Budget updated!");
      setEditingBudgetId(null);
      const updated = await getBudgets();
      setBudgets(updated);
    } catch (err) {
      console.error("Failed to update budget:", err);
      toast.error("Failed to update budget");
    }
  }

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : "Unknown";
  };

  const getCategoryColor = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.color : "#999";
  };

  const calculateSpent = (categoryId, month) => {
    return expenses
      .filter((e) => e.category_id === categoryId && e.date.startsWith(month))
      .reduce((sum, e) => sum + Number(e.amount), 0);
  };

  const formatMonth = (monthStr) => {
    const date = new Date(monthStr + "-01");
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthText = new Date(currentMonth + "-01").toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const totalSpentThisMonth = expenses
    .filter((e) => e.date.startsWith(currentMonth))
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const totalBudgetThisMonth = budgets
    .filter((b) => b.month === currentMonth)
    .reduce((sum, b) => sum + Number(b.monthly_limit), 0);
  const monthlyIncome = profile?.monthly_income || 0;
  const savings = monthlyIncome - totalSpentThisMonth;
  const savingsPercent = monthlyIncome > 0
    ? Math.round((savings / monthlyIncome) * 100)
    : 0;
  const budgetUsedPercent = totalBudgetThisMonth > 0
    ? Math.round((totalSpentThisMonth / totalBudgetThisMonth) * 100)
    : 0;
  const budgetRemaining = totalBudgetThisMonth - totalSpentThisMonth;

  const statBoxStyle = {
    background: "var(--bg-surface-2)",
    borderRadius: "var(--radius-md)",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  };

  const iconCircleStyle = {
    width: 36,
    height: 36,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar />

      <main className="main-with-sidebar">
        <header className="topbar">
          <div>
            <h1 className="topbar-title">Budget Planner</h1>
            <div className="topbar-subtitle">Manage your monthly spending limits</div>
          </div>
          <div className="topbar-actions">
            <span className="mobile-theme-toggle">
              <ThemeToggle />
            </span>
          </div>
        </header>

        <div className="page-container">
          <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="card" style={{ padding: "24px", marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  marginBottom: "18px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <BarChartIcon width={22} height={22} />
                  <h2 className="section-title">Monthly Overview</h2>
                </div>
                <span style={{ color: "var(--text-secondary)", fontSize: "14px", fontWeight: 700 }}>
                  {currentMonthText}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "14px" }}>
                <div style={statBoxStyle}>
                  <div style={{ ...iconCircleStyle, background: "rgba(16, 185, 129, 0.14)", color: "var(--color-success)" }}>
                    <ArrowUpIcon width={18} height={18} />
                  </div>
                  <div className="stat-label">Monthly Income</div>
                  <div className="stat-value" style={{ fontSize: "24px" }}>
                    {monthlyIncome > 0 ? "৳" + Number(monthlyIncome).toLocaleString() : "Not set"}
                  </div>
                  {monthlyIncome <= 0 && (
                    <button
                      className="link-accent"
                      style={{ background: "transparent", border: 0, padding: 0, textAlign: "left", cursor: "pointer", fontSize: "13px" }}
                      onClick={() => router.push("/profile")}
                    >
                      Set income →
                    </button>
                  )}
                </div>

                <div style={statBoxStyle}>
                  <div style={{ ...iconCircleStyle, background: "rgba(239, 68, 68, 0.14)", color: "var(--color-danger)" }}>
                    <ArrowDownIcon width={18} height={18} />
                  </div>
                  <div className="stat-label">Total Spent</div>
                  <div className="stat-value" style={{ fontSize: "24px" }}>৳{totalSpentThisMonth.toFixed(2)}</div>
                  <div className="stat-helper">{budgetUsedPercent}% of total budget used</div>
                </div>

                <div style={statBoxStyle}>
                  <div
                    style={{
                      ...iconCircleStyle,
                      background: savings >= 0 ? "rgba(16, 185, 129, 0.14)" : "rgba(239, 68, 68, 0.14)",
                      color: savings >= 0 ? "var(--color-success)" : "var(--color-danger)",
                    }}
                  >
                    {savings >= 0 ? <CheckCircledIcon width={18} height={18} /> : <CrossCircledIcon width={18} height={18} />}
                  </div>
                  <div className="stat-label">Savings</div>
                  <div
                    className="stat-value"
                    style={{
                      fontSize: "24px",
                      color: savings >= 0 ? "var(--color-success)" : "var(--color-danger)",
                    }}
                  >
                    {monthlyIncome > 0 ? "৳" + Math.abs(savings).toFixed(2) : "Set income first"}
                  </div>
                  <div className="stat-helper">
                    {monthlyIncome > 0
                      ? savings >= 0
                        ? `You saved ${savingsPercent}% of income 🎉`
                        : "You overspent by ৳" + Math.abs(savings).toFixed(2) + " ⚠️"
                      : "Add salary in profile"}
                  </div>
                </div>

                <div style={statBoxStyle}>
                  <div style={{ ...iconCircleStyle, background: "rgba(79, 70, 229, 0.14)", color: "var(--color-primary)" }}>
                    <TargetIcon width={18} height={18} />
                  </div>
                  <div className="stat-label">Budget Remaining</div>
                  <div
                    className="stat-value"
                    style={{
                      fontSize: "24px",
                      color: budgetRemaining >= 0 ? "var(--color-success)" : "var(--color-danger)",
                    }}
                  >
                    ৳{budgetRemaining.toFixed(2)}
                  </div>
                  <div className="stat-helper">across all categories</div>
                </div>
              </div>
            </div>

            {/* Form Card */}
            <div className="card" style={{ padding: "24px" }}>
        <div className="flex items-center gap-3 mb-2">
          <TargetIcon width={24} height={24} />
          <h1 className="text-2xl font-bold">Budget Planner</h1>
        </div>
        <p className="text-sm text-gray-600 mb-6">Set monthly spending limits per category</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Category Select */}
          <div>
            <label className="label">Category</label>
            <select
              className="input"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Monthly Limit */}
          <div>
            <label className="label">Monthly Limit (৳)</label>
            <input
              type="number"
              className="input"
              min="0"
              placeholder="e.g. 5000"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
            />
          </div>

          {/* Month Picker */}
          <div>
            <label className="label">Month</label>
            <input
              type="month"
              className="input"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              min={new Date().toISOString().slice(0, 7)}
            />
          </div>
        </div>

        <button className="btn btn-primary w-full flex items-center justify-center gap-2" onClick={handleSave}>
          <TargetIcon width={18} height={18} />
          Set Budget
        </button>
      </div>

      {/* Budget Confirmation Dialog */}
      <AlertDialog.Root open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="modal-overlay" />
          <AlertDialog.Content className="modal-card dialog-card">
            <AlertDialog.Title className="section-title">Confirm Budget</AlertDialog.Title>
            <AlertDialog.Description className="section-subtitle">
              Set a monthly limit of ৳{monthlyLimit} for{" "}
              {getCategoryName(selectedCategory)} in {formatMonth(selectedMonth)}?
            </AlertDialog.Description>
            <div className="flex justify-end gap-2" style={{ marginTop: "24px" }}>
              <AlertDialog.Cancel asChild>
                <button className="btn btn-ghost">Cancel</button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  className="btn btn-primary"
                  onClick={handleConfirmSave}
                >
                  Confirm
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>

      {/* Budgets Table Card */}
      <div className="card" style={{ padding: "24px" }}>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <TargetIcon width={24} height={24} />
          Current Budgets
        </h2>

        {budgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <TargetIcon width={48} height={48} className="text-gray-400 mb-4" />
            <p className="text-gray-600">No budgets set yet. Use the form above to set your first budget.</p>
          </div>
        ) : (
          <div className="table-wrapper overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Month</th>
                  <th className="text-left py-3 px-4">Limit</th>
                  <th className="text-left py-3 px-4">Spent</th>
                  <th className="text-left py-3 px-4">Remaining</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map((budget) => {
                  const spent = calculateSpent(budget.category_id, budget.month);
                  const remaining = budget.monthly_limit - spent;
                  const percentUsed = (spent / budget.monthly_limit) * 100;

                  let statusBadge;
                  if (percentUsed >= 100) {
                    statusBadge = (
                      <span
                        className="badge"
                        style={{ background: "#fee2e2", color: "#dc2626" }}
                      >
                        Over Budget
                      </span>
                    );
                  } else if (percentUsed >= 80) {
                    statusBadge = (
                      <span
                        className="badge"
                        style={{ background: "#fef3c7", color: "#d97706" }}
                      >
                        Near Limit
                      </span>
                    );
                  } else {
                    statusBadge = (
                      <span
                        className="badge"
                        style={{ background: "#dcfce7", color: "#16a34a" }}
                      >
                        On Track
                      </span>
                    );
                  }

                  return (
                    <tr key={budget.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: budget.categories?.color || "#999" }}
                          ></span>
                          {budget.categories?.name || "Unknown"}
                        </div>
                      </td>
                      <td className="py-3 px-4">{formatMonth(budget.month)}</td>
                      <td className="py-3 px-4">
                        {editingBudgetId === budget.id ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <input
                              type="number"
                              className="input"
                              style={{ width: 100, padding: "4px 8px" }}
                              value={editingLimit}
                              onChange={(e) => setEditingLimit(e.target.value)}
                              autoFocus
                            />
                            <button
                              className="btn btn-primary"
                              style={{ padding: "4px 10px", fontSize: 12 }}
                              onClick={() => handleUpdateBudget(budget.id, editingLimit)}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-ghost"
                              style={{ padding: "4px 8px", fontSize: 12 }}
                              onClick={() => setEditingBudgetId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span>৳{Number(budget.monthly_limit).toFixed(2)}</span>
                            {budget.is_default && (
                              <span
                                className="badge"
                                style={{
                                  background: "var(--bg-surface-2)",
                                  color: "var(--text-muted)",
                                  fontSize: 11,
                                  marginLeft: 6,
                                }}
                              >
                                default
                              </span>
                            )}
                            <button
                              className="btn btn-ghost"
                              style={{ padding: "3px 6px" }}
                              onClick={() => {
                                setEditingBudgetId(budget.id);
                                setEditingLimit(budget.monthly_limit);
                              }}
                            >
                              <Pencil1Icon width={13} height={13} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">৳{spent.toFixed(2)}</td>
                      <td className="py-3 px-4" style={{ color: remaining < 0 ? "var(--color-danger)" : "inherit" }}>
                        ৳{remaining.toFixed(2)}
                      </td>
                      {/*
                      <td className="py-3 px-4">৳{budget.monthly_limit.toFixed(2)}</td>
                      <td className="py-3 px-4">৳{spent.toFixed(2)}</td>
                      <td className="py-3 px-4" style={{ color: remaining < 0 ? "var(--color-danger)" : "inherit" }}>
                        ৳{remaining.toFixed(2)}
                      </td>
                      */}
                      <td className="py-3 px-4">{statusBadge}</td>
                      <td className="py-3 px-4">
                        <AlertDialog.Root
                          open={deletingBudgetId === budget.id}
                          onOpenChange={(open) =>
                            setDeletingBudgetId(open ? budget.id : null)
                          }
                        >
                          <AlertDialog.Trigger asChild>
                            <button
                              className="btn btn-danger flex items-center gap-1"
                              onClick={() => setDeletingBudgetId(budget.id)}
                            >
                              <TrashIcon width={16} height={16} />
                            </button>
                          </AlertDialog.Trigger>
                          <AlertDialog.Portal>
                            <AlertDialog.Overlay className="modal-overlay" />
                            <AlertDialog.Content className="modal-card dialog-card">
                              <AlertDialog.Title className="section-title">Delete Budget</AlertDialog.Title>
                              <AlertDialog.Description className="section-subtitle">
                                Remove the budget limit for {budget.categories?.name} in{" "}
                                {formatMonth(budget.month)}?
                              </AlertDialog.Description>
                              <div className="flex justify-end gap-2" style={{ marginTop: "24px" }}>
                                <AlertDialog.Cancel asChild>
                                  <button className="btn btn-ghost">Cancel</button>
                                </AlertDialog.Cancel>
                                <AlertDialog.Action asChild>
                                  <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                      handleDeleteBudget(budget.id)
                                    }
                                  >
                                    Delete
                                  </button>
                                </AlertDialog.Action>
                              </div>
                            </AlertDialog.Content>
                          </AlertDialog.Portal>
                        </AlertDialog.Root>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
      </div>
      </main>
    </div>
  );
}
