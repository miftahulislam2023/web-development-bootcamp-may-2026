import { useState } from "react";
import { useExpenses } from "../context/ExpenseContext";
import { useTheme } from "../context/ThemeContext";
import { CATEGORIES } from "../constants";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaTrash,
  FaFilter,
  FaMoneyBillWave,
  FaCalendarAlt,
} from "react-icons/fa";

export default function Transactions() {
  const { expenses, deleteExpense } = useExpenses();
  const { t, dark } = useTheme();

  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");

  const cats = ["All", ...CATEGORIES.map((c) => c.name)];

  const filtered = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter((e) => filterCat === "All" || e.cat === filterCat)
    .filter(
      (e) =>
        !search ||
        e.desc.toLowerCase().includes(search.toLowerCase())
    );

  return (
    // ✅ FULL SCREEN FIX WRAPPER (THIS FIXES SIDE BACKGROUND ISSUE)
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: t.pageBg,
      }}
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          <h2
            className="text-2xl sm:text-3xl font-bold flex items-center gap-2"
            style={{ color: t.text }}
          >
            <FaMoneyBillWave /> Transactions
          </h2>

          {/* SEARCH */}
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{
              background: t.phoneBg2,
              border: `1px solid ${t.border}`,
            }}
          >
            <FaSearch style={{ color: t.textDim }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="w-full bg-transparent outline-none text-sm"
              style={{ color: t.text }}
            />
          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap gap-2 items-center">
            <FaFilter style={{ color: t.textDim }} />

            {cats.map((c) => (
              <motion.button
                key={c}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterCat(c)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: filterCat === c ? t.accent : t.pillBg,
                  color: filterCat === c ? "#fff" : t.textSub,
                  border: `1px solid ${t.border}`,
                }}
              >
                {c}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* LIST */}
        <div
          className="rounded-2xl p-2 sm:p-3"
          style={{
            background: t.phoneBg2,
            border: `1px solid ${t.border}`,
          }}
        >
          <AnimatePresence>
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-10 text-sm"
                style={{ color: t.textDim }}
              >
                No transactions found
              </motion.div>
            ) : (
              <div className="flex flex-col gap-2">
                {filtered.map((e, i) => (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl"
                    style={{
                      background: t.cardBg,
                      border: `1px solid ${t.border}`,
                    }}
                  >
                    {/* LEFT */}
                    <div className="flex flex-col gap-1">
                      <p
                        className="text-sm font-semibold truncate max-w-[180px] sm:max-w-xs"
                        style={{ color: t.text }}
                      >
                        {e.desc}
                      </p>

                      <div
                        className="flex items-center gap-2 text-xs"
                        style={{ color: t.textDim }}
                      >
                        <FaCalendarAlt />
                        {new Date(e.date).toLocaleDateString()}
                        <span>•</span>
                        {e.cat}
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-3">
                      <span
                        className="text-sm font-bold"
                        style={{
                          color: e.amount > 0 ? "#22c55e" : "#ef4444",
                        }}
                      >
                        {e.amount > 0 ? "+" : ""}${e.amount}
                      </span>

                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteExpense(e.id)}
                        className="p-2 rounded-lg"
                        style={{
                          background: dark
                            ? "rgba(239,68,68,0.15)"
                            : "rgba(239,68,68,0.08)" ,
                          color: "#ef4444",
                        }}
                      >
                        <FaTrash />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* COUNT */}
        <div
          className="text-xs text-right"
          style={{ color: t.textDim }}
        >
          {filtered.length} transaction
          {filtered.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}