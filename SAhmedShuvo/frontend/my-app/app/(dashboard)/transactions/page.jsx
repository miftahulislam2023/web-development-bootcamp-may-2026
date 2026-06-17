"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ArrowDownCircle, ArrowUpCircle, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation"; // ✅ FIXED

const fmt = (n = 0) => "৳" + Number(n).toLocaleString("en-BD");

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");

  const router = useRouter(); // ✅ FIXED

  // fetch data
  useEffect(() => {
    fetchTransactions();
  }, []);

  // auth guard (safe in App Router)
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  async function fetchTransactions() {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://personal-expense-tracker-r33t.onrender.com/api/transaction/show",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to load transactions");
        return;
      }

      setTransactions(data.data || []);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      setDeletingId(id);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://personal-expense-tracker-r33t.onrender.com/api/transaction/delete/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to delete transaction");
        return;
      }

      setTransactions((prev) => prev.filter((item) => item._id !== id));

      toast.success("Transaction deleted");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setDeletingId("");
    }
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="w-full p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Recent Transactions
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            View and manage all your transactions
          </p>
        </div>

        {/* Table/Card Container */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Table Header */}
          <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr_80px] gap-4 border-b border-slate-100 bg-slate-50 px-6 py-4 text-sm font-semibold text-slate-500 md:grid">
            <p>Title</p>
            <p>Type</p>
            <p>Category</p>
            <p>Amount</p>
            <p>Date</p>
            <p className="text-center">Action</p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex h-64 items-center justify-center">
              <Loader2 size={28} className="animate-spin text-indigo-500" />
            </div>
          )}

          {/* Empty */}
          {!loading && transactions.length === 0 && (
            <div className="flex h-64 flex-col items-center justify-center">
              <p className="text-lg font-medium text-slate-500">
                No transactions found
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Your recent transactions will appear here
              </p>
            </div>
          )}

          {/* Desktop Table */}
          {!loading &&
            transactions.length > 0 &&
            transactions.map((item) => {
              const isIncome = item.type?.toLowerCase() === "income";

              return (
                <div
                  key={item._id}
                  className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr_80px] items-center gap-4 border-b border-slate-100 px-6 py-4 transition-colors hover:bg-slate-50 md:grid"
                >
                  {/* Title */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        isIncome ? "bg-emerald-50" : "bg-rose-50"
                      }`}
                    >
                      {isIncome ? (
                        <ArrowUpCircle size={20} className="text-emerald-500" />
                      ) : (
                        <ArrowDownCircle size={20} className="text-rose-500" />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-400">{item.category}</p>
                    </div>
                  </div>

                  {/* Type */}
                  <div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        isIncome
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>

                  {/* Category */}
                  <p className="text-sm text-slate-600">{item.category}</p>

                  {/* Amount */}
                  <p
                    className={`text-sm font-semibold ${
                      isIncome ? "text-emerald-600" : "text-rose-500"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    {fmt(item.amount)}
                  </p>

                  {/* Date */}
                  <p className="text-sm text-slate-500">
                    {formatDate(item.transactionDate)}
                  </p>

                  {/* Delete */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500"
                    >
                      {deletingId === item._id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}

          {/* Mobile Cards (UNCHANGED) */}
          {!loading && transactions.length > 0 && (
            <div className="flex flex-col md:hidden">
              {transactions.map((item) => {
                const isIncome = item.type?.toLowerCase() === "income";

                return (
                  <div key={item._id} className="border-b border-slate-100 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                            isIncome ? "bg-emerald-50" : "bg-rose-50"
                          }`}
                        >
                          {isIncome ? (
                            <ArrowUpCircle
                              size={20}
                              className="text-emerald-500"
                            />
                          ) : (
                            <ArrowDownCircle
                              size={20}
                              className="text-rose-500"
                            />
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {item.title}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {item.category}
                          </p>
                          <p className="mt-2 text-xs text-slate-400">
                            {formatDate(item.transactionDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <p
                          className={`text-sm font-bold ${
                            isIncome ? "text-emerald-600" : "text-rose-500"
                          }`}
                        >
                          {isIncome ? "+" : "-"}
                          {fmt(item.amount)}
                        </p>

                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={deletingId === item._id}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500"
                        >
                          {deletingId === item._id ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
