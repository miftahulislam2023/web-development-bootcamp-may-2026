import { useState, useEffect } from "react";
import { useExpenses } from "../context/ExpenseContext";
import { useTheme } from "../context/ThemeContext";
import { CATEGORIES } from "../constants.js";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch, FaTrash, FaFilter, FaMoneyBillWave, FaCalendarAlt, FaSpinner,
} from "react-icons/fa";
import { Helmet } from "react-helmet-async";

export default function Transactions() {
  const { expenses, deleteExpense, loading, error, fetchExpenses } = useExpenses();
  const { t, dark } = useTheme();

  const [search,    setSearch]    = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [deletingId, setDeletingId] = useState(null);

  const cats = ["All", ...CATEGORIES.map((c) => c.name)];

  /* re-fetch when search/filter changes (debounced) */
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExpenses({ cat: filterCat, search });
    }, 300);
    return () => clearTimeout(timer);
  }, [search, filterCat, fetchExpenses]);

  /* client-side sort only (server already filters) */
  const filtered = [...expenses].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt )
  );

  async function handleDelete(id) {
    setDeletingId(id);
    await deleteExpense(id);
    setDeletingId(null);
  }

  return (
    <>
    <Helmet>
        <title>Dashboard | Transaction</title>
      </Helmet>


    <div className="lg:pt-20" style={{ minHeight: "100vh", width: "100%", background: t.pageBg }}>
      <div
        style={{
          width: "100%", maxWidth: 720, margin: "0 auto",
          padding: "clamp(12px, 4vw, 24px)",
          display: "flex", flexDirection: "column", gap: 16,
        }}
      >
        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 style={{
            fontSize: "clamp(20px, 5vw, 26px)", fontWeight: 800,
            color: t.text, display: "flex", alignItems: "center", gap: 8, marginBottom: 14,
          }}>
            <FaMoneyBillWave /> Transactions
          </h2>

          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: t.phoneBg2, border: `1px solid ${t.border}`,
            borderRadius: 12, padding: "10px 14px", marginBottom: 10,
          }}>
            <FaSearch style={{ color: t.textDim, flexShrink: 0 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions..."
              style={{
                flex: 1, background: "transparent", border: "none",
                outline: "none", fontSize: 14, color: t.text, fontFamily: "inherit",
                minWidth: 0,
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: t.textDim, fontSize: 16, lineHeight: 1, flexShrink: 0,
                }}
              >
                ×
              </button>
            )}
          </div>

          {/* Category filters */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
            <FaFilter style={{ color: t.textDim, fontSize: 12 }} />
            {cats.map((c) => (
              <motion.button
                key={c}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterCat(c)}
                style={{
                  padding: "5px 12px", borderRadius: 99, fontSize: 11, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit", border: `1px solid ${t.border}`,
                  background: filterCat === c ? t.accent : t.pillBg,
                  color: filterCat === c ? "#fff" : t.textSub,
                  transition: "all 0.15s",
                }}
              >
                {c}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── Error banner ── */}
        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#ef4444",
          }}>
            ⚠️ {error} — <button onClick={() => fetchExpenses()} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit" }}>retry</button>
          </div>
        )}

        {/* ── List ── */}
        <div style={{
          background: t.phoneBg2, border: `1px solid ${t.border}`,
          borderRadius: 16, padding: "10px",
        }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: t.textDim }}>
              <FaSpinner style={{ fontSize: 24, animation: "spin 1s linear infinite", display: "block", margin: "0 auto 8px" }} />
              <span style={{ fontSize: 13 }}>Loading…</span>
            </div>
          ) : (
            <AnimatePresence>
              {filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ textAlign: "center", padding: "40px 0", fontSize: 13, color: t.textDim }}
                >
                  No transactions found
                </motion.div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {filtered.map((e, i) => (
                    <motion.div
                      key={e._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.025 }}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        gap: 10, padding: "11px 13px", borderRadius: 10,
                        background: t.cardBg, border: `1px solid ${t.border}`,
                        opacity: deletingId === e._id ? 0.4 : 1,
                        transition: "opacity 0.2s",
                      }}
                    >
                      {/* Left */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: 13, fontWeight: 600, color: t.text,
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                          marginBottom: 3,
                        }}>
                          {e.desc}
                        </p>
                        <div style={{
                          display: "flex", alignItems: "center", flexWrap: "wrap",
                          gap: "3px 6px", fontSize: 11, color: t.textDim,
                        }}>
                          <FaCalendarAlt style={{ fontSize: 10 }} />
                          {new Date(e.date).toLocaleDateString(undefined, {
                            year: "numeric", month: "short", day: "numeric",
                          })}
                          <span>•</span>
                          {e.cat}
                          <span>•</span>
                          <span style={{
                            fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: 99,
                            background: e.type === "income" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.1)",
                            color: e.type === "income" ? "#10b981" : "#ef4444",
                          }}>
                            {e.type}
                          </span>
                        </div>
                      </div>

                      {/* Right */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                        <span style={{
                          fontSize: 14, fontWeight: 700,
                          color: e.type === "income" ? "#22c55e" : "#ef4444",
                        }}>
                          {e.type === "income" ? "+" : "-"}৳{Number(e.amt).toFixed(2)}
                        </span>

                        <motion.button
                          whileTap={{ scale: 0.88 }}
                          onClick={() => handleDelete(e._id)}
                          disabled={deletingId === e._id}
                          style={{
                            padding: "7px", borderRadius: 8, border: "none", cursor: "pointer",
                            background: dark ? "rgba(239,68,68,0.18)" : "rgba(239,68,68,0.09)",
                            color: "#ef4444", display: "flex", alignItems: "center",
                          }}
                        >
                          {deletingId === e._id
                            ? <FaSpinner style={{ fontSize: 13, animation: "spin 1s linear infinite" }} />
                            : <FaTrash style={{ fontSize: 13 }} />
                          }
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Count */}
        <div style={{ fontSize: 11, textAlign: "right", color: t.textDim }}>
          {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
    </>
  );
}