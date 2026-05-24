import { ChevronDown } from "lucide-react";
import { NavLink } from "react-router";

export function MobileItem({ to, icon: Icon, label, isNew }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center justify-between px-5 py-4 rounded-3xl transition-all duration-300 font-bold text-lg group ${
          isActive
            ? "bg-primary text-white shadow-lg shadow-primary/30 scale-[1.02]"
            : "text-base-content/70 hover:bg-base-200/50 hover:text-base-content"
        }`
      }
    >
      <div className="flex items-center gap-4">
        <Icon className="w-6 h-6" />
        {label}
      </div>
      {isNew && (
        <span className="px-2 py-0.5 text-[0.6rem] font-black uppercase bg-white/20 text-white rounded-full">
          New
        </span>
      )}
      <ChevronDown className="w-5 h-5 -rotate-90 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </NavLink>
  );
}
