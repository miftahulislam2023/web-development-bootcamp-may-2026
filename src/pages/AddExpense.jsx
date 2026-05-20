import { useState } from "react";
import {
  FiPenTool,
  FiDollarSign,
  FiTrendingDown,
  FiTrendingUp,
  FiTag,
  FiCalendar,
  FiSave,
  FiX,
  FiAlertCircle,
  FiCheckCircle,
  FiCoffee,
  FiTruck,
  FiActivity,
  FiShoppingBag,
  FiCreditCard,
  FiStar,
  FiNavigation,
  FiMoreHorizontal,
} from "react-icons/fi";
import { useExpenses } from "../context/ExpenseContext";
import { useTheme } from "../context/ThemeContext";

const CATEGORIES = [
  { name: "Food",      Icon: FiCoffee },
  { name: "Transport", Icon: FiTruck },
  { name: "Health",    Icon: FiActivity },
  { name: "Shopping",  Icon: FiShoppingBag },
  { name: "Bills",     Icon: FiCreditCard },
  { name: "Fun",       Icon: FiStar },
  { name: "Travel",    Icon: FiNavigation },
  { name: "Other",     Icon: FiMoreHorizontal },
];

export default function AddExpense({ onSuccess }) {
  const { addExpense } = useExpenses();
  const { t } = useTheme();

  const today = new Date().toISOString().split("T")[0];

  const [desc,    setDesc]    = useState("");
  const [amt,     setAmt]     = useState("");
  const [type,    setType]    = useState("expense");
  const [cat,     setCat]     = useState("Food");
  const [date,    setDate]    = useState(today);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!desc.trim())                       { setError("Enter a description");   return; }
    if (!amt || isNaN(+amt) || +amt <= 0)   { setError("Enter a valid amount");  return; }
    if (!date)                              { setError("Pick a date");           return; }

    addExpense({ desc: desc.trim(), amt: parseFloat(amt), type, cat, date });
    setDesc(""); setAmt(""); setDate(today);
    setSuccess(true);
    setTimeout(() => { setSuccess(false); if (onSuccess) onSuccess(); }, 1500);
  }

  /* ── shared style helpers ── */
  const label = {
    fontSize: 11, fontWeight: 700, color: t.textSub,
    textTransform: "uppercase", letterSpacing: "0.08em",
    marginBottom: 6, display: "flex", alignItems: "center", gap: 5,
  };

  const input = {
    width: "100%", padding: "10px 13px", borderRadius: 10,
    background: t.cardBg, border: `1px solid ${t.border}`,
    color: t.text, fontSize: 14, outline: "none",
    transition: "border-color 0.18s", fontFamily: "inherit",
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px 16px" }}>
      <div style={{
        background: t.phoneBg2, border: `1px solid ${t.border}`,
        borderRadius: 18, padding: "clamp(18px, 5vw, 32px)",
        width: "100%", maxWidth: 480,
        boxShadow: `0 20px 50px ${t.shadow}`,
      }}>

        {/* ── Header ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 17, fontWeight: 800, color: t.text, marginBottom: 22,
        }}>
          <FiSave size={18} color={t.accent} />
          Add new expense
        </div>

        {/* ── Alerts ── */}
        {error && (
          <div style={{
            display: "flex", alignItems: "center", gap: 7,
            background: t.badge, border: `1px solid ${t.badgeBd}`,
            borderRadius: 9, padding: "9px 13px",
            fontSize: 13, color: t.accent, marginBottom: 14,
          }}>
            <FiAlertCircle size={14} />
            {error}
          </div>
        )}

        {success && (
          <div style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: 9, padding: "9px 13px",
            fontSize: 13, color: "#10b981", marginBottom: 14,
          }}>
            <FiCheckCircle size={14} />
            Saved successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Description */}
          <div>
            <label style={label}>
              <FiPenTool size={12} /> Description
            </label>
            <input
              style={input}
              placeholder="e.g. Lunch at pizza hut"
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
          </div>

          {/* Amount */}
          <div>
            <label style={label}>
              <FiDollarSign size={12} /> Amount ($)
            </label>
            <input
              style={input}
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={amt}
              onChange={e => setAmt(e.target.value)}
            />
          </div>

          {/* Type toggle */}
          <div>
            <label style={label}>
              <FiTrendingDown size={12} /> Type
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { key: "expense", Icon: FiTrendingDown, label: "Expense" },
                { key: "income",  Icon: FiTrendingUp,   label: "Income"  },
              ].map(({ key, Icon, label: lbl }) => {
                const active = type === key;
                const activeStyle = key === "expense"
                  ? { background: "#FEF3C7", border: "1px solid #F59E0B", color: "#92400E" }
                  : { background: "#D1FAE5", border: "1px solid #10B981", color: "#065F46" };
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setType(key)}
                    style={{
                      flex: 1, padding: "9px 12px", borderRadius: 9, cursor: "pointer",
                      fontSize: 13, fontWeight: 700, fontFamily: "inherit",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      transition: "all 0.15s",
                      ...(active
                        ? activeStyle
                        : { background: t.cardBg, border: `1px solid ${t.border}`, color: t.textSub }),
                    }}
                  >
                    <Icon size={14} />
                    {lbl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category grid */}
          <div>
            <label style={label}>
              <FiTag size={12} /> Category
            </label>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))",
              gap: 7,
            }}>
              {CATEGORIES.map(({ name, Icon }) => {
                const active = cat === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setCat(name)}
                    style={{
                      padding: "9px 4px 7px", borderRadius: 9, cursor: "pointer",
                      fontSize: 10, fontWeight: 700, fontFamily: "inherit",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                      transition: "all 0.15s",
                      ...(active
                        ? { background: "#EEF2FF", border: "1px solid #6366F1", color: "#4338CA" }
                        : { background: t.cardBg,  border: `1px solid ${t.border}`, color: t.textSub }),
                    }}
                  >
                    <Icon size={17} />
                    {name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date */}
          <div>
            <label style={label}>
              <FiCalendar size={12} /> Date
            </label>
            <input
              style={{ ...input, colorScheme: "dark light" }}
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div style={{
            display: "flex", gap: 10, marginTop: 4,
            flexWrap: "wrap",
          }}>
            <button
              type="button"
              onClick={() => onSuccess && onSuccess()}
              style={{
                flex: "1 1 100px", padding: "11px", borderRadius: 10,
                border: `1px solid ${t.border}`,
                background: "transparent", color: t.textSub,
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                fontFamily: "inherit", transition: "all 0.18s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = t.pillBg; e.currentTarget.style.color = t.text; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = t.textSub; }}
            >
              <FiX size={14} /> Cancel
            </button>

            <button className=""
              type="submit"
              style={{
                flex: "2 1 160px", padding: "11px", borderRadius: 10,
                border: "none", background: "#6366F1", color: "#ffffff",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                fontFamily: "inherit", transition: "opacity 0.18s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <FiSave size={14} /> Save expense
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}