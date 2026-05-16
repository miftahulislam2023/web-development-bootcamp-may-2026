"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  CalendarIcon,
  PlusIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import {
  getExpenses,
  getCategories,
  createExpense,
  updateExpense,
  deleteExpense,
  getToken,
} from "@/lib/api";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import Navbar from "@/components/Navbar";
import RightPanel from "@/components/RightPanel";
import ProfilePanel from "@/components/ProfilePanel";
import ThemeToggle from "@/components/ThemeToggle";

function decodeUser(token) {
  const tokenParts = token.split(".");
  if (tokenParts.length !== 3) return { id: "unknown", email: "unknown", name: "User" };

  try {
    const payload = JSON.parse(atob(tokenParts[1]));
    return { id: payload.id, email: payload.email, name: payload.name || "User" };
  } catch {
    return { id: "unknown", email: "unknown", name: "User" };
  }
}

export default function ExpensesPage() {
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [profilePanelOpen, setProfilePanelOpen] = useState(false);
  const [user, setUser] = useState(null);

  const fetchData = async () => {
    try {
      const [expensesData, categoriesData] = await Promise.all([
        getExpenses(),
        getCategories(),
      ]);
      setExpenses(expensesData);
      setCategories(categoriesData);
    } catch (error) {
      toast.error(error.message || "Failed to fetch data");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadInitialData = async () => {
      try {
        const token = getToken();
        if (!token) {
          router.push("/login");
          return;
        }

        setUser(decodeUser(token));

        const [expensesData, categoriesData] = await Promise.all([
          getExpenses(),
          getCategories(),
        ]);
        if (ignore) return;
        setExpenses(expensesData);
        setCategories(categoriesData);
      } catch (error) {
        if (ignore) return;
        toast.error(error.message || "Failed to fetch data");
        router.push("/login");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadInitialData();

    return () => {
      ignore = true;
    };
  }, [router]);

  const totalSpend = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const latestExpense = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  const handleAddClick = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleSave = async (formData) => {
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, formData);
        toast.success("Expense updated successfully.");
      } else {
        await createExpense(formData);
        toast.success("Expense added successfully.");
      }
      setShowForm(false);
      setEditingExpense(null);
      await fetchData();
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      toast.success("Expense deleted.");
      await fetchData();
      setShowForm(false);
      setEditingExpense(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete expense");
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar onProfileClick={() => setProfilePanelOpen(true)} />

      <main className="main-with-sidebar">
        <header className="topbar">
          <div>
            <h1 className="topbar-title">Expenses</h1>
            <div className="topbar-subtitle">Review, search, and manage every transaction</div>
          </div>
          <div className="topbar-actions">
            <span className="mobile-theme-toggle">
              <ThemeToggle />
            </span>
            <button
              className="btn btn-secondary"
              onClick={() => setProfilePanelOpen(true)}
            >
              <PersonIcon width={16} height={16} />
              Profile
            </button>
          </div>
        </header>

        <div className="page-container">
          <div className="page-header">
            <div>
              <div className="eyebrow">Expense ledger</div>
              <h2 className="page-title">A clean record of your spending.</h2>
              <p className="page-description">
                Keep transactions organized, searchable, and ready for analysis across categories and dates.
              </p>
            </div>
            <button className="btn btn-primary" onClick={handleAddClick}>
              <PlusIcon width={17} height={17} />
              Add expense
            </button>
          </div>

          <section className="stats-grid" style={{ marginBottom: "18px" }}>
            <div className="card stat-card">
              <div className="stat-top">
                <div>
                  <div className="stat-label">Total spend</div>
                  <div className="stat-value">BDT {totalSpend.toFixed(2)}</div>
                  <div className="stat-helper">All tracked expenses</div>
                </div>
              </div>
            </div>
            <div className="card stat-card">
              <div className="stat-top">
                <div>
                  <div className="stat-label">Transactions</div>
                  <div className="stat-value">{expenses.length}</div>
                  <div className="stat-helper">Rows in your ledger</div>
                </div>
              </div>
            </div>
            <div className="card stat-card">
              <div className="stat-top">
                <div>
                  <div className="stat-label">Categories</div>
                  <div className="stat-value">{categories.length}</div>
                  <div className="stat-helper">Available spending groups</div>
                </div>
              </div>
            </div>
            <div className="card stat-card">
              <div className="stat-top">
                <div>
                  <div className="stat-label">Latest activity</div>
                  <div className="stat-value" style={{ fontSize: "22px" }}>
                    {latestExpense
                      ? new Date(latestExpense.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                        })
                      : "N/A"}
                  </div>
                  <div className="stat-helper">
                    <CalendarIcon width={13} height={13} style={{ display: "inline", marginRight: "4px" }} />
                    Most recent transaction
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="card section-card">
            <div style={{ marginBottom: "18px" }}>
              <h3 className="section-title">Transactions</h3>
              <p className="section-subtitle">Filter by keyword or category, then edit records directly from the table.</p>
            </div>
            <ExpenseList
              expenses={expenses}
              categories={categories}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddClick={handleAddClick}
            />
          </section>

          <ExpenseForm
            key={editingExpense?.id || "new-expense"}
            isOpen={showForm}
            expense={editingExpense}
            categories={categories}
            onClose={() => {
              setShowForm(false);
              setEditingExpense(null);
            }}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        </div>
      </main>

      <RightPanel
        isOpen={profilePanelOpen}
        onClose={() => setProfilePanelOpen(false)}
        title="Profile"
      >
        {user && <ProfilePanel user={user} onClose={() => setProfilePanelOpen(false)} />}
      </RightPanel>
    </div>
  );
}
