"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Wallet,
  DollarSign,
  FileText,
  StickyNote,
  Loader2,
  Plus,
} from "lucide-react";

const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Business",
  "Bonus",
  "Gift",
  "Refund",
  "Rental",
  "Other",
];

export default function AddIncomePage() {
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    accountId: "", // store _id directly — no need for .find() later
    title: "",
    amount: "",
    category: "Salary",
    note: "",
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    try {
      setLoadingAccounts(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        return;
      }

      const res = await fetch(
        "https://personal-expense-tracker-r33t.onrender.com/api/account/show",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to load accounts");
        return;
      }

      setAccounts(data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoadingAccounts(false);
    }
  }

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // ── Validation ──
    if (!formData.accountId) {
      toast.error("Please select an account");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        return;
      }

      const payload = {
        accountId: formData.accountId, // directly the _id — no .find() needed
        title: formData.title.trim(),
        amount: Number(formData.amount),
        category: formData.category,
        note: formData.note.trim(),
      };

      const res = await fetch(
        "https://personal-expense-tracker-r33t.onrender.com/api/transaction/addIncome",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to add income");
        return;
      }

      toast.success("Income added successfully!");

      // reset form
      setFormData({
        accountId: "",
        title: "",
        amount: "",
        category: "Salary",
        note: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Add Income</h1>
          <p className="mt-1 text-sm text-slate-400">
            Record your income transaction
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1 — Account + Amount */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Account */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Select Account
                </label>
                <div className="relative">
                  <Wallet
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <select
                    name="accountId"
                    value={formData.accountId}
                    onChange={handleChange}
                    disabled={loadingAccounts}
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {loadingAccounts
                        ? "Loading accounts..."
                        : "Select account"}
                    </option>
                    {accounts.map((acc) => (
                      <option key={acc._id} value={acc._id}>
                        {acc.name} — ৳{Number(acc.balance).toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                    ৳
                  </span>
                  <input
                    type="number"
                    name="amount"
                    min="1"
                    step="any"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </div>
            </div>

            {/* Row 2 — Title + Category */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Income Title
                </label>
                <div className="relative">
                  <FileText
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Salary for May"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                >
                  {INCOME_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Note{" "}
                <span className="font-normal text-slate-300">(optional)</span>
              </label>
              <div className="relative">
                <StickyNote
                  size={18}
                  className="absolute left-4 top-4 text-slate-400"
                />
                <textarea
                  rows={4}
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Add any additional notes..."
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white py-4 pl-11 pr-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || loadingAccounts}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 text-sm font-medium text-white transition-all hover:bg-emerald-600 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Add Income
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
