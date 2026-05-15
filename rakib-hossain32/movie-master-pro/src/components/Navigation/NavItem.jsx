import { NavLink } from "react-router";
import { motion,  } from "framer-motion";

export function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-500 group overflow-hidden ${
          isActive ? "text-primary" : "text-secondary hover:text-secondary/80"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Active Background Morph */}
          {isActive && (
            <motion.div
              layoutId="active-nav-bg"
              className="absolute inset-0 bg-base-100 dark:bg-base-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] rounded-full -z-10"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}

          <Icon
            className={`w-5 h-5 transition-all duration-300 ${
              isActive
                ? "text-primary fill-primary/10 scale-110"
                : "group-hover:scale-110 group-hover:text-primary"
            }`}
          />
          <span className="relative z-10">{label}</span>

          {/* Hover Glow */}
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full -z-10 blur-md"></div>
        </>
      )}
    </NavLink>
  );
}
