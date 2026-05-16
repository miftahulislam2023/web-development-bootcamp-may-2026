import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  PlusCircle,
  FileDown,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import api from "../services/api";
import { Link } from "react-router-dom";

export default function Overview() {

  const [transactions, setTransactions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const fetchTransactions =
    async () => {

      try {

        const res = await api.get(
          "/transactions/all"
        );

        setTransactions(res.data);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };

  useEffect(() => {

    fetchTransactions();

  }, []);

  const totalIncome =
    transactions
      .filter(
        (item) =>
          item.type === "income"
      )
      .reduce(
        (acc, item) =>
          acc + item.amount,
        0
      );

  const totalExpense =
    transactions
      .filter(
        (item) =>
          item.type === "expense"
      )
      .reduce(
        (acc, item) =>
          acc + item.amount,
        0
      );

  const totalBalance =
    totalIncome - totalExpense;

  const alerts = [];

  if (totalExpense > totalIncome) {

    alerts.push({

      type: "danger",

      title: "Overspending Alert",

      message:
        "Your expenses exceeded your income.",

    });
  }

  if (
    totalBalance > 0 &&
    totalBalance < 5000
  ) {

    alerts.push({

      type: "warning",

      title: "Low Balance Warning",

      message:
        "Your remaining balance is getting low.",

    });
  }

  if (
    totalExpense >
    totalIncome * 0.8
  ) {

    alerts.push({

      type: "warning",

      title: "High Spending Detected",

      message:
        "You already spent more than 80% of your income.",

    });
  }

  if (
    totalBalance >
    totalIncome * 0.3
  ) {

    alerts.push({

      type: "success",

      title: "Healthy Savings",

      message:
        "Great job! Your savings rate looks healthy.",

    });
  }

  const generatePDF = () => {

    const doc = new jsPDF();

    doc.setFontSize(24);

    doc.text(
      "FinTrack Pro - Finance Report",
      14,
      20
    );

    doc.setFontSize(14);

    doc.text(
      `Total Balance: ৳ ${totalBalance.toLocaleString()}`,
      14,
      40
    );

    doc.text(
      `Total Income: ৳ ${totalIncome.toLocaleString()}`,
      14,
      50
    );

    doc.text(
      `Total Expense: ৳ ${totalExpense.toLocaleString()}`,
      14,
      60
    );

    autoTable(doc, {

      startY: 80,

      head: [[
        "Category",
        "Type",
        "Amount",
        "Note",
      ]],

      body: transactions.map(
        (item) => [

          item.category,

          item.type,

          `৳ ${item.amount}`,

          item.note ||
            "General Transaction",
        ]
      ),
    });

    doc.save(
      "fintrack-report.pdf"
    );
  };

  if (loading) {

    return (
      <div className="flex flex-col gap-6 animate-pulse p-4">

        <div className="h-10 w-64 bg-white/5 rounded-xl mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {[1, 2, 3].map((i) => (

            <div
              key={i}
              className="h-32 bg-white/5 rounded-[2rem]"
            />
          ))}

        </div>

        <div className="h-64 bg-white/5 rounded-[2rem] mt-10" />

      </div>
    );
  }

  const statCards = [
    {
      title: "Total Balance",
      amount: totalBalance,
      icon: CreditCard,
      color: "cyan",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      text: "text-cyan-400",
    },

    {
      title: "Total Income",
      amount: totalIncome,
      icon: TrendingUp,
      color: "green",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
    },

    {
      title: "Total Expense",
      amount: totalExpense,
      icon: TrendingDown,
      color: "red",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      text: "text-rose-400",
    },
  ];

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="max-w-7xl mx-auto space-y-10"
    >

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>

          <h1 className="text-4xl font-black text-white tracking-tight">

            Dashboard
            {" "}
            <span className="text-cyan-400">

              Overview

            </span>

          </h1>

          <p className="text-gray-400 mt-2 font-medium">

            Monitoring your financial growth effectively.

          </p>

        </div>

        <div className="flex items-center gap-4 flex-wrap">

          <Link to={"/dashboard/transactions"}>

            <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]">

              <PlusCircle size={20} />

              New Transaction

            </button>

          </Link>

          <button
            onClick={generatePDF}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-2xl font-bold transition-all"
          >

            <FileDown size={20} />

            Export Report

          </button>

        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {statCards.map((card, i) => (

          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className={`${card.bg} ${card.border} border p-8 rounded-[2.5rem] relative overflow-hidden group transition-all duration-300`}
          >

            <div className="relative z-10">

              <div className={`w-12 h-12 ${card.bg} ${card.text} rounded-2xl flex items-center justify-center mb-6`}>

                <card.icon size={26} />

              </div>

              <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">

                {card.title}

              </p>

              <h2 className={`text-4xl font-black mt-2 ${card.text}`}>

                ৳ {card.amount.toLocaleString()}

              </h2>

            </div>

            <div className="absolute top-[-20%] right-[-10%] opacity-5 group-hover:opacity-10 transition-opacity">

              <card.icon size={150} />

            </div>

          </motion.div>
        ))}

      </div>

      <div className="space-y-4">

        {alerts.map((alert, index) => (

          <div
            key={index}
            className={`border rounded-[2rem] p-6 flex items-start gap-4 ${
              alert.type === "danger"
                ? "bg-rose-500/10 border-rose-500/20"
                : alert.type === "warning"
                ? "bg-yellow-500/10 border-yellow-500/20"
                : "bg-emerald-500/10 border-emerald-500/20"
            }`}
          >

            <div
              className={`p-3 rounded-2xl ${
                alert.type === "danger"
                  ? "bg-rose-500/10 text-rose-400"
                  : alert.type === "warning"
                  ? "bg-yellow-500/10 text-yellow-400"
                  : "bg-emerald-500/10 text-emerald-400"
              }`}
            >

              {alert.type === "success" ? (

                <ShieldCheck size={24} />

              ) : (

                <AlertTriangle size={24} />

              )}

            </div>

            <div>

              <h2 className="text-xl font-bold text-white">

                {alert.title}

              </h2>

              <p className="text-gray-400 mt-1">

                {alert.message}

              </p>

            </div>

          </div>
        ))}

      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 md:p-10">

        <div className="flex items-center justify-between mb-8">

          <div className="flex items-center gap-3">

            <div className="p-3 bg-white/5 rounded-2xl text-cyan-400">

              <History size={24} />

            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight">

              Recent Activity

            </h2>

          </div>

          <button className="text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors">

            View All

          </button>

        </div>

        <div className="space-y-4">

          {transactions.length === 0 ? (

            <div className="py-20 text-center">

              <div className="inline-flex p-6 bg-white/5 rounded-full mb-4 text-gray-600 italic">

                <CreditCard size={40} />

              </div>

              <h3 className="text-xl font-bold text-gray-300">

                No transactions yet

              </h3>

              <p className="text-gray-500">

                Your recent financial activities will appear here.

              </p>

            </div>

          ) : (

            transactions
              .slice(0, 5)
              .map((item) => (

                <motion.div
                  whileHover={{ x: 10 }}
                  key={item._id}
                  className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 p-5 rounded-[2rem] flex items-center justify-between transition-all"
                >

                  <div className="flex items-center gap-5">

                    <div
                      className={`p-4 rounded-2xl ${
                        item.type ===
                        "income"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-rose-500/10 text-rose-400"
                      }`}
                    >

                      {item.type ===
                      "income" ? (

                        <ArrowDownLeft size={24} />

                      ) : (

                        <ArrowUpRight size={24} />

                      )}

                    </div>

                    <div>

                      <h3 className="text-lg font-bold text-gray-200 group-hover:text-white transition-colors capitalize">

                        {item.category}

                      </h3>

                      <p className="text-gray-500 text-sm font-medium">

                        {item.note ||
                          "General Transaction"}

                      </p>

                    </div>

                  </div>

                  <div className="text-right">

                    <p
                      className={`text-xl font-black ${
                        item.type ===
                        "income"
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }`}
                    >

                      {item.type ===
                      "income"
                        ? "+"
                        : "-"}

                      {" "}
                      ৳
                      {item.amount.toLocaleString()}

                    </p>

                    <p className="text-[10px] text-gray-600 font-bold uppercase mt-1 tracking-widest">

                      Confirmed

                    </p>

                  </div>

                </motion.div>
              ))
          )}

        </div>

      </div>

    </motion.div>
  );
}