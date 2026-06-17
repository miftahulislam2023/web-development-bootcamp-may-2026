"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Calendar,
  Download,
  Search,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";

const fmt = (n = 0) => "৳" + Number(n).toLocaleString("en-BD");

export default function MonthlyReportPage() {
  const router = useRouter();

  const currentDate = new Date();

  const [month, setMonth] = useState(
    `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(
      2,
      "0",
    )}`,
  );

  const [loading, setLoading] = useState(false);

  const [report, setReport] = useState(null);

  // auth protection
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  async function handleFetchReport(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://personal-expense-tracker-r33t.onrender.com/api/user/report?month=${month}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to load report");
        return;
      }

      setReport(data);

      toast.success("Report loaded");
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://personal-expense-tracker-r33t.onrender.com/api/user/downloadReport?month=${month}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        toast.error("Download failed");
        return;
      }

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;

      a.download = `report-${month}.pdf`;

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Download started");
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    }
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Top */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">
          Monthly Report
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Review your monthly income and expenses
        </p>
      </div>

      {/* Filter */}
      <div className="border-b border-slate-200 pb-5">
        <form
          onSubmit={handleFetchReport}
          className="flex flex-wrap items-center gap-3"
        >
          {/* Month */}
          <div className="relative">
            <Calendar
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="
                h-10 rounded-xl border border-slate-200
                bg-white pl-10 pr-3 text-sm text-slate-700
                outline-none transition-all
                focus:border-indigo-400
              "
            />
          </div>

          {/* View */}
          <button
            type="submit"
            disabled={loading}
            className="
              flex h-10 items-center gap-2
              rounded-xl bg-indigo-500 px-4
              text-sm font-medium text-white
              transition-all hover:bg-indigo-600
              disabled:opacity-70
            "
          >
            <Search size={16} />

            {loading ? "Loading..." : "View"}
          </button>

          {/* Download */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={!report}
            className="
              flex h-10 items-center gap-2
              rounded-xl border border-slate-200
              bg-white px-4 text-sm font-medium
              text-slate-700 transition-all
              hover:bg-slate-50
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            <Download size={16} />
            Download
          </button>
        </form>
      </div>

      {/* Report */}
      {report && (
        <>
          {/* Summary */}
          <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Income */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <ArrowUpCircle size={18} className="text-emerald-500" />
                </div>

                <div>
                  <p className="text-sm text-slate-400">Income</p>

                  <h2 className="mt-1 text-xl font-semibold text-slate-900">
                    {fmt(report.totalIncome)}
                  </h2>
                </div>
              </div>
            </div>

            {/* Expense */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50">
                  <ArrowDownCircle size={18} className="text-rose-500" />
                </div>

                <div>
                  <p className="text-sm text-slate-400">Expense</p>

                  <h2 className="mt-1 text-xl font-semibold text-slate-900">
                    {fmt(report.totalExpense)}
                  </h2>
                </div>
              </div>
            </div>

            {/* Savings */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                  <Calendar size={18} className="text-indigo-500" />
                </div>

                <div>
                  <p className="text-sm text-slate-400">Savings</p>

                  <h2 className="mt-1 text-xl font-semibold text-slate-900">
                    {fmt(report.netSavings)}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {/* Header */}
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Transactions
              </h2>
            </div>

            {/* List */}
            <div className="divide-y divide-slate-100">
              {report.transactions?.length > 0 ? (
                report.transactions.map((tx) => (
                  <div
                    key={tx._id}
                    className="
                      flex flex-col gap-3
                      px-5 py-4
                      sm:flex-row sm:items-center sm:justify-between
                    "
                  >
                    {/* Left */}
                    <div className="flex items-start gap-3">
                      <div
                        className={`
                          flex h-10 w-10 items-center justify-center rounded-xl
                          ${
                            tx.type === "income"
                              ? "bg-emerald-50"
                              : "bg-rose-50"
                          }
                        `}
                      >
                        {tx.type === "income" ? (
                          <ArrowUpCircle
                            size={18}
                            className="text-emerald-500"
                          />
                        ) : (
                          <ArrowDownCircle
                            size={18}
                            className="text-rose-500"
                          />
                        )}
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-slate-800">
                          {tx.title}
                        </h3>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                          <span>{tx.category}</span>

                          <span>•</span>

                          <span>
                            {new Date(tx.transactionDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Amount */}
                    <div
                      className={`
                        text-sm font-semibold
                        ${
                          tx.type === "income"
                            ? "text-emerald-600"
                            : "text-rose-500"
                        }
                      `}
                    >
                      {tx.type === "income" ? "+" : "-"}
                      {fmt(tx.amount)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-5 py-10 text-center text-sm text-slate-400">
                  No transactions found
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
