import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const NAV = [
  { id: "dashboard",    label: "Dashboard",    icon: "⊞" },
  { id: "transactions", label: "Transactions", icon: "☰" },
  { id: "add",          label: "Add Expense",  icon: "＋" },
  { id: "charts",       label: "Charts",       icon: "▦" },
];

export default function Sidebar({ page, setPage }) {
  const { user, logout } = useAuth();
  const { t } = useTheme();

  const initials = user?.name
    ? user.name.trim().split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <aside style={{
      width: 220, flexShrink: 0,
      background: t.phoneBg2,
      borderRight: `1px solid ${t.border}`,
      display: "flex", flexDirection: "column",
      transition: "background 0.4s",
    }}>
      {/* logo */}
      <div style={{ padding: "22px 20px 18px", fontSize: 18, fontWeight: 900, color: t.text, letterSpacing: "-0.03em" }}>
        Spend<span style={{ color: t.accent }}>ora</span>
      </div>

      {/* nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 2, padding: "0 8px" }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 9, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600, textAlign: "left",
              background:   page === n.id ? t.pillBg     : "transparent",
              color:        page === n.id ? t.text        : t.textSub,
              borderLeft:  `3px solid ${page === n.id ? t.accent : "transparent"}`,
              transition:  "all 0.15s",
            }}
            onMouseEnter={e => { if (page !== n.id) { e.currentTarget.style.background = t.hoverBg; e.currentTarget.style.color = t.text; } }}
            onMouseLeave={e => { if (page !== n.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = t.textSub; } }}
          >
            <span style={{ fontSize: 16 }}>{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>

      {/* user footer */}
      <div style={{ marginTop: "auto", padding: "16px 12px", borderTop: `1px solid ${t.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: t.accent, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 800, flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
            <div style={{ fontSize: 10, color: t.textSub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.email}</div>
          </div>
        </div>
        <button onClick={logout} style={{
          width: "100%", padding: "8px", borderRadius: 9,
          border: `1px solid ${t.border}`,
          background: "transparent", color: t.textSub,
          fontSize: 12, fontWeight: 600, cursor: "pointer",
          transition: "all 0.18s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = t.pillBg; e.currentTarget.style.color = t.text; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = t.textSub; }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}