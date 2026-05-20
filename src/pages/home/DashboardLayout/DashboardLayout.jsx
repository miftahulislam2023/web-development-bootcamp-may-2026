import { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { NavLink, Outlet } from "react-router";
import {
  RiAddCircleLine,
  RiExchangeLine,
  RiPieChartLine,
  RiSunLine,
  RiMoonLine,
  RiMenu3Line,
  RiCloseLine,
  RiWallet3Line,
  RiHandHeartLine,
} from "react-icons/ri";

const links = [
  { name: "Add Expense", path: "add-expense", icon: RiAddCircleLine },
  { name: "Transactions", path: "transactions", icon: RiExchangeLine },
  { name: "Charts", path: "charts", icon: RiPieChartLine },
];

export default function DashboardLayout() {
  const { dark, toggle, t } = useTheme();
  const [open, setOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <RiWallet3Line size={24} color={t.accent} />
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Expense App</h2>
      </div>

      <div style={{ width: "100%", height: 1, background: t.border, margin: "8px 0 12px" }} />

      {links.map((l) => {
        const Icon = l.icon;
        return (
          <NavLink
            key={l.path}
            to={l.path}
            onClick={() => setOpen(false)}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 10,
              textDecoration: "none",
              color: isActive ? t.accentTx : t.textSub,
              background: isActive ? t.accent : "transparent",
              fontWeight: 600,
              transition: "all 0.2s",
            })}
          >
            <Icon size={18} />
            {l.name}
          </NavLink>
        );
      })}

      <button
        onClick={toggle}
        style={{
          marginTop: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "10px",
          borderRadius: 10,
          border: `1px solid ${t.border}`,
          background: t.pillBg,
          color: t.text,
          cursor: "pointer",
          fontWeight: 600,
          width: "100%",
        }}
      >
        {dark ? <RiMoonLine size={18} /> : <RiSunLine size={18} />}
        {dark ? "Dark Mode" : "Light Mode"}
      </button>
    </>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: t.pageBg, color: t.text }}>

      {/* ───────── DESKTOP SIDEBAR ───────── */}
      <aside
        className="sidebar"
        style={{
          width: 260,
          background: t.cardBg,
          borderRight: `1px solid ${t.border}`,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <SidebarContent />
      </aside>

      {/* ───────── MAIN AREA ───────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* TOPBAR */}
        <header
          style={{
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            borderBottom: `1px solid ${t.border}`,
            background: t.navBg,
            backdropFilter: "blur(12px)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          {/* hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="hamburger"
            style={{
              display: "none",
              background: "none",
              border: "none",
              color: t.text,
              cursor: "pointer",
              padding: 4,
              borderRadius: 8,
            }}
          >
            {open ? <RiCloseLine size={26} /> : <RiMenu3Line size={26} />}
          </button>

          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Dashboard</h3>

          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: t.textSub }}>
            <RiHandHeartLine size={16} />
            Welcome
          </div>
        </header>

        {/* CONTENT */}
        <main style={{ padding: 20, flex: 1 }}>
          <Outlet />
        </main>
      </div>

      {/* ───────── MOBILE DRAWER ───────── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 99,
            backdropFilter: "blur(2px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 260,
              height: "100%",
              background: t.cardBg,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              boxShadow: "4px 0 24px rgba(0,0,0,0.2)",
            }}
          >
            <SidebarContent />
          </div>
        </div>
      )}

      {/* ───────── RESPONSIVE CSS ───────── */}
      <style>{`
        @media (max-width: 768px) {
          .sidebar { display: none !important; }
          .hamburger { display: flex !important; align-items: center; }
        }
      `}</style>
    </div>
  );
}