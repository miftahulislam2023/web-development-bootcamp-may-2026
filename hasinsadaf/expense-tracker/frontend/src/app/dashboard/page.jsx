"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  BarChartIcon,
  ListBulletIcon,
  PlusIcon,
  StarFilledIcon,
  TargetIcon,
  BellIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import { getExpenses, getCategories, getToken, getBudgets, getProfile } from "@/lib/api";
import MonthlyChart from "@/components/MonthlyChart";
import CategoryChart from "@/components/CategoryChart";
import Navbar from "@/components/Navbar";
import RightPanel from "@/components/RightPanel";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardPage() {
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCardPanel, setSelectedCardPanel] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        if (!token) {
          router.push("/login");
          return;
        }

        const [expensesData, categoriesData, budgetsData, profileData] = await Promise.all([
          getExpenses(),
          getCategories(),
          getBudgets(),
          getProfile(),
        ]);
        setExpenses(expensesData);
        setCategories(categoriesData);
        setBudgets(budgetsData);
        setProfile(profileData);
      } catch (error) {
        toast.error(error.message || "Failed to fetch data");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const metrics = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthExpenses = expenses.filter((expense) => {
      const date = new Date(expense.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const totalThisMonth = monthExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    const totalAllTime = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    const averageTransaction = expenses.length ? totalAllTime / expenses.length : 0;
    const currentMonthKey = new Date().toISOString().slice(0, 7);
    const spentThisMonth = expenses
      .filter((e) => e.date.startsWith(currentMonthKey))
      .reduce((sum, e) => sum + Number(e.amount), 0);
    const income = profile?.monthly_income || 0;
    const savings = income - spentThisMonth;

    const categoryMap = {};
    expenses.forEach((expense) => {
      categoryMap[expense.category_id] =
        (categoryMap[expense.category_id] || 0) + Number(expense.amount);
    });

    const topCategoryId = Object.keys(categoryMap).sort(
      (a, b) => categoryMap[b] - categoryMap[a]
    )[0];
    const topCategory = categories.find((category) => String(category.id) === String(topCategoryId));

    return {
      monthExpenses,
      totalThisMonth,
      totalAllTime,
      averageTransaction,
      income,
      savings,
      topCategory,
      topCategoryAmount: topCategoryId ? categoryMap[topCategoryId] : 0,
    };
  }, [categories, expenses, profile]);

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const currentMonthKey = new Date().toISOString().slice(0, 7);
  const categoryBudgets = budgets
    .filter((budget) => budget.month === currentMonthKey)
    .map((budget) => {
      const category = budget.categories ||
        categories.find((item) => String(item.id) === String(budget.category_id));
      const limit = Number(budget.monthly_limit) || 0;
      const spent = expenses
        .filter(
          (expense) =>
            String(expense.category_id) === String(budget.category_id) &&
            expense.date.startsWith(budget.month)
        )
        .reduce((sum, expense) => sum + Number(expense.amount), 0);

      return {
        id: budget.id,
        name: category?.name || "Unknown",
        spent,
        limit,
        color: category?.color || "var(--color-primary)",
        percent: limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0,
        isDefault: budget.is_default,
      };
    })
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 4);

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => String(c.id) === String(categoryId));
    return category?.name || "Uncategorized";
  };

  const currentDate = new Date();
  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return (
      <div className="loading-screen">
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
            <h1 className="topbar-title">Dashboard</h1>
            <div className="topbar-subtitle">{monthYear} overview</div>
          </div>
          <div className="topbar-actions">
            <span className="mobile-theme-toggle">
              <ThemeToggle />
            </span>
          </div>
        </header>

        <div className="page-container">
          <div className="page-header">
            <div>
              <div className="eyebrow">Financial command center</div>
              <h2 className="page-title">Calm, clear spending intelligence.</h2>
              <p className="page-description">
                Track monthly cash flow, understand category concentration, and keep everyday transactions easy to review.
              </p>
            </div>
            <Link href="/expenses" className="btn btn-primary">
              <PlusIcon width={17} height={17} />
              Add expense
            </Link>
          </div>

          <section
            className="stats-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 16 }}
          >
            <button className="card stat-card card-hover" onClick={() => setSelectedCardPanel("monthly")}>
              <div className="stat-top">
                <div>
                  <div className="stat-label">Spent this month</div>
                  <div className="stat-value">৳{metrics.totalThisMonth.toFixed(2)}</div>
                  <div className="stat-helper">{metrics.monthExpenses.length} transactions this month</div>
                </div>
                <div className="stat-icon"><BarChartIcon width={20} height={20} /></div>
              </div>
            </button>

            <button className="card stat-card card-hover" onClick={() => setSelectedCardPanel("expenses")}>
              <div className="stat-top">
                <div>
                  <div className="stat-label">Total transactions</div>
                  <div className="stat-value">{expenses.length}</div>
                  <div className="stat-helper">All recorded expenses</div>
                </div>
                <div className="stat-icon"><ListBulletIcon width={20} height={20} /></div>
              </div>
            </button>

            <button className="card stat-card card-hover" onClick={() => setSelectedCardPanel("category")}>
              <div className="stat-top">
                <div>
                  <div className="stat-label">Top category</div>
                  <div className="stat-value" style={{ fontSize: "24px" }}>
                    {metrics.topCategory?.name || "N/A"}
                  </div>
                  <div className="stat-helper">৳{metrics.topCategoryAmount.toFixed(2)} total</div>
                </div>
                <div className="stat-icon"><StarFilledIcon width={20} height={20} /></div>
              </div>
            </button>

            <div className="card stat-card">
              <div className="stat-top">
                <div>
                  <div className="stat-label">Monthly Savings</div>
                  <div
                    className="stat-value"
                    style={{ color: metrics.savings >= 0 ? "var(--color-success)" : "var(--color-danger)" }}
                  >
                    {metrics.income > 0
                      ? (metrics.savings >= 0 ? "+" : "-") + "৳" + Math.abs(metrics.savings).toFixed(2)
                      : "Set income"}
                  </div>
                  <div className="stat-helper">
                    {metrics.income > 0 && metrics.savings >= 0
                      ? "Great job! 🎉"
                      : metrics.income > 0 && metrics.savings < 0
                        ? "Over budget ⚠️"
                        : "Go to Profile to set your income"}
                  </div>
                </div>
                <div className="stat-icon"><RocketIcon width={20} height={20} /></div>
              </div>
            </div>
          </section>

          {/* Budget Alerts Section */}
          {(() => {
            const currentMonth = new Date().toISOString().slice(0, 7);
            const budgetAlerts = budgets
              .map((budget) => {
                const spent = expenses
                  .filter(
                    (e) =>
                      e.category_id === budget.category_id &&
                      e.date.startsWith(budget.month)
                  )
                  .reduce((sum, e) => sum + Number(e.amount), 0);
                const percentUsed = (spent / budget.monthly_limit) * 100;
                return {
                  ...budget,
                  spent,
                  percentUsed,
                };
              })
              .filter((b) => b.percentUsed >= 80);

            if (budgetAlerts.length > 0) {
              return (
                <section style={{ marginBottom: "20px" }}>
                  <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <BellIcon width={20} height={20} />
                    <h3 className="section-title">Budget Alerts</h3>
                  </div>
                  <div>
                    {budgetAlerts.map((alert) => {
                      const overage = alert.spent - alert.monthly_limit;
                      const percent = Math.round(alert.percentUsed);
                      const categoryName =
                        categories.find((c) => c.id === alert.category_id)?.name || "Unknown";
                      const monthName = new Date(alert.month + "-01").toLocaleDateString(
                        "en-US",
                        { month: "long", year: "numeric" }
                      );

                      return (
                        <div
                          key={alert.id}
                          style={{
                            background: "var(--bg-surface)",
                            border: "1px solid var(--border)",
                            borderLeft:
                              alert.percentUsed >= 100
                                ? "4px solid var(--color-danger)"
                                : "4px solid var(--color-warning)",
                            borderRadius: "var(--radius-md)",
                            padding: "12px 16px",
                            marginBottom: "8px",
                          }}
                        >
                          {alert.percentUsed >= 100 ? (
                            <span>
                              ⚠️ You exceeded your {categoryName} budget for {monthName} by ৳
                              {overage.toFixed(2)}
                            </span>
                          ) : (
                            <span>
                              🔔 You have used {percent}% of your {categoryName} budget for {monthName}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            }
          })()}

          <section className="dashboard-grid">
            <div className="card section-card">
              <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <h3 className="section-title">Recent transactions</h3>
                  <p className="section-subtitle">Latest activity from your expense ledger.</p>
                </div>
                <Link href="/expenses" className="btn btn-ghost">View all</Link>
              </div>

              <div className="transaction-list">
                {recentExpenses.length === 0 ? (
                  <div className="empty-state">No recent transactions yet.</div>
                ) : (
                  recentExpenses.map((expense) => (
                    <div className="transaction-item" key={expense.id}>
                      <div>
                        <div className="item-title">{expense.description || "Expense"}</div>
                        <div className="item-meta">
                          {getCategoryName(expense.category_id)} · {new Date(expense.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                      <div className="amount">৳{Number(expense.amount).toFixed(2)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card section-card">
              <h3 className="section-title">Budget overview</h3>
              <p className="section-subtitle">Category pacing based on your recorded spend.</p>
              <div className="budget-list" style={{ marginTop: "18px" }}>
                {categoryBudgets.length === 0 ? (
                  <div className="empty-state">No current-month budgets available.</div>
                ) : (
                  categoryBudgets.map((category) => (
                    <div className="budget-item" key={category.id} style={{ display: "block" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "10px" }}>
                        <div>
                          <div className="item-title">{category.name}</div>
                          <div className="item-meta">
                            ৳{category.spent.toFixed(2)} of ৳{category.limit.toFixed(2)}
                            {category.isDefault ? " · default" : ""}
                          </div>
                        </div>
                        <span className="badge">{category.percent}%</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${category.percent}%`, background: category.color }} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="chart-grid">
            <div className="card section-card">
              <div style={{ marginBottom: "18px" }}>
                <h3 className="section-title">Monthly spending</h3>
                <p className="section-subtitle">Clean trend view of spending by month.</p>
              </div>
              <MonthlyChart expenses={expenses} />
            </div>
            <div className="card section-card">
              <div style={{ marginBottom: "18px" }}>
                <h3 className="section-title">Category analytics</h3>
                <p className="section-subtitle">Distribution across your active categories.</p>
              </div>
              <CategoryChart expenses={expenses} categories={categories} />
            </div>
          </section>
        </div>
      </main>

      <RightPanel
        isOpen={selectedCardPanel === "monthly"}
        onClose={() => setSelectedCardPanel(null)}
        title="Monthly details"
      >
        <div className="card section-card">
          <div className="stat-label">Total this month</div>
          <div className="stat-value">৳{metrics.totalThisMonth.toFixed(2)}</div>
          <p className="section-subtitle">Review this number alongside recent transactions to spot changes in spending rhythm.</p>
        </div>
      </RightPanel>

      <RightPanel
        isOpen={selectedCardPanel === "expenses"}
        onClose={() => setSelectedCardPanel(null)}
        title="Expense overview"
      >
        <div className="transaction-list">
          {recentExpenses.map((expense) => (
            <div className="transaction-item" key={expense.id}>
              <div>
                <div className="item-title">{expense.description || "Expense"}</div>
                <div className="item-meta">{getCategoryName(expense.category_id)}</div>
              </div>
              <div className="amount">৳{Number(expense.amount).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </RightPanel>

      <RightPanel
        isOpen={selectedCardPanel === "category"}
        onClose={() => setSelectedCardPanel(null)}
        title="Top category"
      >
        <div className="card section-card">
          <div className="stat-label">Highest spend area</div>
          <div className="stat-value">{metrics.topCategory?.name || "N/A"}</div>
          <p className="section-subtitle">
            Total tracked spend: ৳{metrics.topCategoryAmount.toFixed(2)}
          </p>
        </div>
      </RightPanel>

    </div>
  );
}
