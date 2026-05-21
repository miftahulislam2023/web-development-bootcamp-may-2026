import { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router";
import {
  RiAddCircleLine, RiExchangeLine, RiPieChartLine,
  RiSunLine, RiMoonLine, RiMenu3Line, RiCloseLine,
  RiWallet3Line, RiHandHeartLine, RiArrowLeftSLine,
  RiDashboardLine,
} from "react-icons/ri";
import { CgProfile } from "react-icons/cg";

const links = [
  { name: "Overview",     path: "overview",     icon: RiDashboardLine  },
  { name: "Profile",      path: "profile",      icon: CgProfile        },
  { name: "Add Expense",  path: "add-expense",  icon: RiAddCircleLine  },
  { name: "Transactions", path: "transactions", icon: RiExchangeLine   },
  { name: "Charts",       path: "charts",       icon: RiPieChartLine   },
];

/* page title from current path */
function usePageTitle() {
  const { pathname } = useLocation();
  const seg = pathname.split("/").filter(Boolean).pop();
  return links.find(l => l.path === seg)?.name ?? "Dashboard";
}

export default function DashboardLayout() {
  const { dark, toggle, t } = useTheme();
  const [open, setOpen]     = useState(false);
  const navigate            = useNavigate();
  const pageTitle           = usePageTitle();

  /* ── Sidebar nav links ── */
  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: t.accent, display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <RiWallet3Line size={18} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: t.text, lineHeight: 1.1 }}>Expense App</div>
          <div style={{ fontSize: 10, color: t.textDim }}>Track · Analyse · Save</div>
        </div>
      </div>

      <div style={{ height: 1, background: t.border, margin: "10px 0" }} />

      {/* Nav links */}
      {links.map(({ name, path, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          onClick={() => setOpen(false)}
          style={({ isActive }) => ({
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 10,
            textDecoration: "none", fontWeight: 600, fontSize: 13,
            transition: "all 0.18s",
            color:      isActive ? "#fff"   : t.textSub,
            background: isActive ? t.accent : "transparent",
          })}
        >
          <Icon size={17} />
          {name}
        </NavLink>
      ))}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Theme toggle */}
      <button
        onClick={toggle}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "10px", borderRadius: 10,
          border: `1px solid ${t.border}`, background: t.pillBg, color: t.text,
          cursor: "pointer", fontWeight: 600, fontSize: 13, width: "100%",
          transition: "all 0.18s",
        }}
      >
        {dark ? <RiMoonLine size={17} /> : <RiSunLine size={17} />}
        {dark ? "Dark Mode" : "Light Mode"}
      </button>
    </>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: t.pageBg, color: t.text }}>

      {/* ── Desktop sidebar ── */}
      <aside className="db-sidebar" style={{
        width: 240, background: t.cardBg, borderRight: `1px solid ${t.border}`,
        padding: "18px 14px", display: "flex", flexDirection: "column", gap: 6,
        position: "sticky", top: 0, height: "100vh", overflowY: "auto",
        flexShrink: 0,
      }}>
        <SidebarContent />
      </aside>

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* ── Topbar ── */}
        <header style={{
          height: 56, display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 8,
          padding: "0 clamp(10px, 3vw, 20px)",
          borderBottom: `1px solid ${t.border}`,
          background: t.navBg, backdropFilter: "blur(12px)",
          position: "sticky", top: 0, zIndex: 10,
          boxSizing: "border-box",
        }}>

          {/* Left: hamburger + EXIT back button + page title */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>

            {/* Hamburger — mobile only */}
            <button
              className="db-hamburger"
              onClick={() => setOpen(!open)}
              style={{
                display: "none", background: "none", border: "none",
                color: t.text, cursor: "pointer", padding: 4, borderRadius: 8,
                flexShrink: 0, alignItems: "center",
              }}
            >
              {open ? <RiCloseLine size={24} /> : <RiMenu3Line size={24} />}
            </button>

            {/* ← Exit Dashboard button (goes to wherever user came from outside dashboard) */}
            <button
              onClick={() => navigate(-1)}
              title="Go back"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 4, padding: "6px 10px", borderRadius: 8, flexShrink: 0,
                border: `1px solid ${t.border}`, background: t.pillBg,
                color: t.textSub, cursor: "pointer", fontSize: 12, fontWeight: 600,
                fontFamily: "inherit", transition: "all 0.18s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = t.accent;
                e.currentTarget.style.color       = t.accent;
                e.currentTarget.style.background  = `${t.accent}18`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = t.border;
                e.currentTarget.style.color       = t.textSub;
                e.currentTarget.style.background  = t.pillBg;
              }}
            >
              <RiArrowLeftSLine size={16} />
              {/* Label hidden on very small screens via class */}
              <span className="db-back-label">Back</span>
            </button>

            {/* Divider */}
            <div style={{
              width: 1, height: 20, background: t.border, flexShrink: 0,
            }} />

            {/* Page title */}
            <h3 style={{
              margin: 0,
              fontSize: "clamp(13px, 2.5vw, 16px)",
              fontWeight: 700,
              color: t.text,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              minWidth: 0,
            }}>
              {pageTitle}
            </h3>
          </div>

          {/* Right: welcome */}
          <div style={{
            display: "flex", alignItems: "center", gap: 5,
            fontSize: 13, color: t.textSub, flexShrink: 0,
          }}>
            <RiHandHeartLine size={15} />
            <span className="db-welcome-text">Welcome</span>
          </div>
        </header>

        {/* Page content */}
        <main style={{
          flex: 1,
          padding: "clamp(10px, 3vw, 20px)",
          boxSizing: "border-box",
          minWidth: 0,
          width: "100%",
        }}>
          <Outlet />
        </main>
      </div>

      {/* ── Mobile drawer overlay ── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.45)", zIndex: 99,
            backdropFilter: "blur(3px)",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: 240, height: "100%",
              background: t.cardBg,
              padding: "18px 14px",
              display: "flex", flexDirection: "column", gap: 6,
              boxShadow: "6px 0 28px rgba(0,0,0,0.25)",
              animation: "db-slideIn 0.22s ease",
              overflowY: "auto",
            }}
          >
            <SidebarContent />
          </div>
        </div>
      )}

      <style>{`
        @keyframes db-slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }

        /* ── Tablet (≤ 900px): narrow sidebar ── */
        @media (max-width: 900px) {
          .db-sidebar {
            width: 60px !important;
            padding: 14px 8px !important;
            align-items: center;
          }
          .db-sidebar a span,
          .db-sidebar button span {
            display: none;
          }
          .db-sidebar a {
            justify-content: center;
            padding: 10px !important;
          }
          .db-sidebar button {
            padding: 10px !important;
            gap: 0 !important;
          }
          /* hide logo text on narrow sidebar */
          .db-sidebar > div:first-child > div:last-child {
            display: none;
          }
        }

        /* ── Mobile (≤ 640px): hide sidebar, show hamburger ── */
        @media (max-width: 640px) {
          .db-sidebar       { display: none !important; }
          .db-hamburger     { display: flex !important; }
          .db-welcome-text  { display: none; }
          .db-back-label    { display: none; }
        }
      `}</style>
    </div>
  );
}