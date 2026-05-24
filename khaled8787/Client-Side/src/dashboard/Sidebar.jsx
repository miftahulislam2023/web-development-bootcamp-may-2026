import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Wallet,
  LogOut,
  RefreshCcw,
  ChevronRight,
  Brain,
  Lightbulb
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; 

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinks = [
    { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { name: "Transactions", path: "/dashboard/transactions", icon: Receipt },
    { name: "Mood Tracker", path: "/dashboard/mood-tracker", icon: Lightbulb },
    { name: "Analytics", path: "/dashboard/analytics", icon: PieChart },
    { name: "Budgets", path: "/dashboard/budgets", icon: Wallet },
    {
  name: "Recurring",
  path: "/dashboard/recurring",
  icon: RefreshCcw,
},
{
  name: "AI Insights",
  path: "/dashboard/insights",
  icon: Brain,
},

  ];

  return (
    <aside className="w-80 bg-[#050b1d] border-r border-white/5 min-h-screen p-6 sticky top-0 flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.3)]">
      
      <div className="px-4 py-8">
        <Link to={"/"} className="group flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] group-hover:rotate-12 transition-transform duration-500">
            <Wallet className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Fin<span className="text-cyan-400">Track</span>
            <span className="text-[10px] ml-1 px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded uppercase tracking-widest">Pro</span>
          </h1>
        </Link>
      </div>

      <nav className="mt-6 flex-1 space-y-2">
        {navLinks.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            end={item.path === "/dashboard"}
            className={({ isActive }) =>
              `group relative flex items-center justify-between px-5 py-4 rounded-2xl font-semibold transition-all duration-300 overflow-hidden ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-transparent text-cyan-400 shadow-[inset_4px_0_0_0_#06b6d4]"
                  : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.03]"
              }`
            }
          >
            <div className="flex items-center gap-4 relative z-10">
              <item.icon size={22} className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
              <span className="tracking-wide text-sm">{item.name}</span>
            </div>
            
            <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="group w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
        >
          <div className="p-2 rounded-lg bg-gray-500/10 group-hover:bg-red-500/20 transition-colors">
            <LogOut size={20} />
          </div>
          <span className="font-bold text-sm tracking-wide">Sign Out</span>
        </button>
        
        
      </div>
    </aside>
  );
}