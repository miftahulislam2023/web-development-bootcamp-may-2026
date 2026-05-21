import { useState } from "react";
import {
  FiPenTool, FiDollarSign, FiTrendingDown, FiTrendingUp,
  FiTag, FiCalendar, FiSave, FiX, FiAlertCircle, FiCheckCircle, FiLoader,
} from "react-icons/fi";
import { useExpenses } from "../context/ExpenseContext";
import { useTheme }    from "../context/ThemeContext";
import { CATEGORIES }  from "../constants";
import { Helmet } from "react-helmet-async";

export default function AddExpense({ onSuccess }) {
  const { addExpense } = useExpenses();
  const { t }          = useTheme();

  const today = new Date().toISOString().split("T")[0];

  const [desc,    setDesc]    = useState("");
  const [amt,     setAmt]     = useState("");
  const [type,    setType]    = useState("expense");
  const [cat,     setCat]     = useState(CATEGORIES[0].name);
  const [date,    setDate]    = useState(today);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);
  const [saving,  setSaving]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!desc.trim())                     { setError("Enter a description");  return; }
    if (!amt || isNaN(+amt) || +amt <= 0) { setError("Enter a valid amount"); return; }
    if (!date)                            { setError("Pick a date");          return; }
    setSaving(true);
    try {
      await addExpense({ desc: desc.trim(), amt: parseFloat(amt), type, cat, date });
      setDesc(""); setAmt(""); setDate(today);
      setSuccess(true);
      setTimeout(() => { setSuccess(false); if (onSuccess) onSuccess(); }, 1500);
    } catch (err) {
      setError(err.message || "Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  /* ── design tokens ── */
  const ACCENT       = "#6366F1";          // indigo — primary action
  const ACCENT_HOVER = "#4F46E5";
  const ACCENT_DIM   = "#a5b4fc";          // disabled state

  const labelStyle = {
    fontSize: 11, fontWeight: 700, color: t.textSub,
    textTransform: "uppercase", letterSpacing: "0.08em",
    marginBottom: 6, display: "flex", alignItems: "center", gap: 5,
  };
  const inputStyle = {
    width: "100%", padding: "10px 13px", borderRadius: 10,
    background: t.cardBg, border: `1px solid ${t.border}`,
    color: t.text, fontSize: 14, outline: "none",
    transition: "border-color 0.18s", fontFamily: "inherit",
    boxSizing: "border-box",
  };

  return (
    <>
    <Helmet>
        <title>Dashboard | AddExpense</title>
      </Helmet>


    <div style={{ display: "flex", justifyContent: "center", padding: "clamp(10px, 3vw, 20px)" }}>
      <div style={{
        background: t.phoneBg2,
        border: `1px solid ${t.border}`,
        borderRadius: 18,
        padding: "clamp(14px, 5vw, 28px)",
        width: "100%",
        maxWidth: 480,
        boxShadow: `0 20px 50px ${t.shadow}`,
        boxSizing: "border-box",
      }}>

        {/* ── Header ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          fontSize: "clamp(15px, 4vw, 17px)", fontWeight: 800,
          color: t.text, marginBottom: 20,
        }}>
          <FiSave size={18} color={ACCENT} />
          Add new expense
        </div>

        {/* ── Alerts ── */}
        {error && (
          <div style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "rgba(239,68,68,0.10)",
            border: "1px solid rgba(239,68,68,0.30)",
            borderRadius: 9, padding: "9px 13px",
            fontSize: 13, color: "#ef4444", marginBottom: 14,
          }}>
            <FiAlertCircle size={14} /> {error}
          </div>
        )}
        {success && (
          <div style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "rgba(16,185,129,0.12)",
            border: "1px solid rgba(16,185,129,0.30)",
            borderRadius: 9, padding: "9px 13px",
            fontSize: 13, color: "#10b981", marginBottom: 14,
          }}>
            <FiCheckCircle size={14} /> Saved successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Description */}
          <div>
            <label style={labelStyle}><FiPenTool size={12} /> Description</label>
            <input
              style={inputStyle}
              placeholder="e.g. Lunch at pizza hut"
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
          </div>

          {/* Amount */}
          <div>
            <label style={labelStyle}><FiDollarSign size={12} /> Amount</label>
            <input
              style={inputStyle}
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
            <label style={labelStyle}><FiTrendingDown size={12} /> Type</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { key: "expense", Icon: FiTrendingDown, label: "Expense",
                  active: { background: "#FEF3C7", border: "1px solid #F59E0B", color: "#92400E" } },
                { key: "income",  Icon: FiTrendingUp,   label: "Income",
                  active: { background: "#D1FAE5", border: "1px solid #10B981", color: "#065F46" } },
              ].map(({ key, Icon, label: lbl, active: aStyle }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setType(key)}
                  style={{
                    flex: 1, padding: "9px 12px", borderRadius: 9, cursor: "pointer",
                    fontSize: 13, fontWeight: 700, fontFamily: "inherit",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    transition: "all 0.15s",
                    ...(type === key
                      ? aStyle
                      : { background: t.cardBg, border: `1px solid ${t.border}`, color: t.textSub }),
                  }}
                >
                  <Icon size={14} /> {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* Category grid */}
          <div>
            <label style={labelStyle}><FiTag size={12} /> Category</label>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(clamp(60px, 18vw, 76px), 1fr))",
              gap: 6,
            }}>
              {CATEGORIES.map(({ name, Icon, icon, color }) => {
                const active = cat === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setCat(name)}
                    style={{
                      padding: "8px 4px 7px", borderRadius: 9, cursor: "pointer",
                      fontSize: 10, fontWeight: 700, fontFamily: "inherit",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                      transition: "all 0.15s",
                      /* active: use that category's own color tinted */
                      ...(active
                        ? {
                            background: color + "22",   // 13 % opacity tint
                            border: `1.5px solid ${color}`,
                            color: color,
                          }
                        : {
                            background: t.cardBg,
                            border: `1px solid ${t.border}`,
                            color: t.textSub,
                          }),
                    }}
                  >
                    {Icon
                      ? <Icon size={16} color={active ? color : undefined} />
                      : <span style={{ fontSize: 16 }}>{icon}</span>
                    }
                    {name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date */}
          <div>
            <label style={labelStyle}><FiCalendar size={12} /> Date</label>
            <input
              style={{ ...inputStyle, colorScheme: "dark light" }}
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>

          {/* ── Actions ── */}
          <div style={{ display: "flex", gap: 10, marginTop: 4, flexWrap: "wrap" }}>

            {/* Cancel — ghost, uses accent colour on hover */}
            <button
              type="button"
              onClick={() => onSuccess && onSuccess()}
              style={{
                flex: "1 1 100px", padding: "11px", borderRadius: 10,
                border: `1.5px solid ${t.border}`,
                background: "transparent",
                color: t.textSub,
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                fontFamily: "inherit", transition: "all 0.18s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = ACCENT;
                e.currentTarget.style.color       = ACCENT;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = t.border;
                e.currentTarget.style.color       = t.textSub;
              }}
            >
              <FiX size={14} /> Cancel
            </button>

            {/* Save — solid indigo, same ACCENT used everywhere */}
            <button
              type="submit"
              disabled={saving}
              style={{
                flex: "2 1 160px", padding: "11px", borderRadius: 10,
                border: `1.5px solid ${saving ? ACCENT_DIM : ACCENT_HOVER}`,
                background: saving ? ACCENT_DIM : ACCENT,
                color: "#ffffff",
                fontSize: 13, fontWeight: 700,
                cursor: saving ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                fontFamily: "inherit", transition: "background 0.18s, border-color 0.18s",
              }}
              onMouseEnter={e => {
                if (!saving) e.currentTarget.style.background = ACCENT_HOVER;
              }}
              onMouseLeave={e => {
                if (!saving) e.currentTarget.style.background = ACCENT;
              }}
            >
              {saving
                ? <><FiLoader size={14} style={{ animation: "spin 1s linear infinite" }} /> Saving…</>
                : <><FiSave   size={14} /> Save expense</>
              }
            </button>
          </div>

        </form>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        /* make date-input readable in both themes */
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; }

        /* tighten category grid on very small screens */
        @media (max-width: 360px) {
          .cat-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
      `}</style>
    </div>
    </>
  );
}