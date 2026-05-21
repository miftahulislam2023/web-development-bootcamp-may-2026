"use client";

import { MessageSquare, User, LogOut } from "lucide-react";
import { BiSolidMessageRoundedDetail } from "react-icons/bi";
import { motion } from "framer-motion";

export default function Navbar({ activeTab, onTabChange, isDarkMode, onLogoutClick }) {
  const tabs = [
    { id: "chats", icon: BiSolidMessageRoundedDetail, label: "Chats" },
    { id: "profile", icon: User, label: "Profile" },
    { id: "logout", icon: LogOut, label: "Logout" },
  ];

  const navBgColor = isDarkMode ? "#0f172a" : "#dae6f4";
  const navBgClass = isDarkMode ? "bg-[#0f172a]" : "bg-[#dae6f4]";
  const chatListBg = isDarkMode ? "bg-[#1a202c]" : "bg-slate-50";

  const handleTabClick = (tabId) => {
    if (tabId === "logout") {
      onLogoutClick();
      return;
    }
    onTabChange(tabId);
  };

  // Find active tab index for mobile SVG notch positioning
  const activeIndex = tabs.findIndex(t => t.id === activeTab);

  return (
    <>
      {/* ========== DESKTOP NAVBAR (left side vertical) ========== */}
      <nav className={`
        hidden md:flex flex-col flex-shrink-0 w-16 h-full z-30 transition-all duration-300
        ${navBgClass}
      `}>
        <div className="flex-1 flex flex-col items-center pt-6 gap-3">
          {tabs.filter(t => t.id !== "logout").map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className="relative group outline-none flex items-center justify-end pr-2 w-full h-16"
              >
                {/* Desktop: "Inverted C" Notch on the RIGHT */}
                {isActive && (
                  <motion.div
                    layoutId="nav-notch-right"
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  >
                    <div className={`absolute top-[-20px] right-0 w-5 h-5 ${chatListBg}`}>
                      <div className={`w-full h-full rounded-br-[20px] ${navBgClass}`} />
                    </div>
                    <div className={`w-full h-full rounded-l-full ${chatListBg} flex items-center justify-center`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-[#2a3854]' : 'bg-[#dbeafe]'}`} />
                    </div>
                    <div className={`absolute bottom-[-20px] right-0 w-5 h-5 ${chatListBg}`}>
                      <div className={`w-full h-full rounded-tr-[20px] ${navBgClass}`} />
                    </div>
                  </motion.div>
                )}

                <div className={`
                  relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                  ${isActive
                    ? (isDarkMode ? "text-blue-400" : "text-blue-600")
                    : "text-blue-400/60 group-hover:text-blue-600 group-hover:bg-blue-500/10"}
                `}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Desktop logout button at bottom */}
        <div className="flex flex-col items-center pb-8 gap-6">
          <button
            onClick={() => handleTabClick("logout")}
            className="text-blue-400/60 hover:text-red-500 transition-colors p-2"
          >
            <LogOut size={22} />
          </button>
        </div>
      </nav>

      {/* ========== MOBILE NAVBAR (bottom fixed) ========== */}
      <div className={`md:hidden fixed bottom-0 left-0 w-full z-50 h-16 border-t transition-all duration-300 ${isDarkMode ? "bg-slate-900 border-white/10" : "bg-white border-blue-100"
        }`}>
        <div className="flex items-center justify-around h-full px-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const isLogout = tab.id === "logout";
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className="relative flex items-center justify-center w-full h-full"
              >
                {isActive && !isLogout && (
                  <motion.div
                    layoutId="mobile-active-circle"
                    className={`absolute w-12 h-12 rounded-full ${isDarkMode ? "bg-blue-500/20" : "bg-blue-50"}`}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                <div className={`
                  relative z-10 transition-all duration-300
                  ${isActive && !isLogout
                    ? (isDarkMode ? "text-blue-400" : "text-blue-600")
                    : (isLogout ? "text-red-400/70" : (isDarkMode ? "text-slate-500" : "text-slate-400"))
                  }
                `}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

/**
 * Generates an SVG path for the navbar background with a smooth circular notch.
 * The notch is a semicircular cutout at the top of the bar, centered on the active tab.
 */
function generateNotchPath(width, height, activeIndex, totalTabs) {
  const tabWidth = width / totalTabs;
  const centerX = tabWidth * activeIndex + tabWidth / 2;
  const notchRadius = 32;
  const notchDepth = 22;
  const curveWidth = 18; // smooth transition width

  const leftStart = centerX - notchRadius - curveWidth;
  const rightEnd = centerX + notchRadius + curveWidth;

  return `
    M 0 0
    L ${leftStart} 0
    C ${leftStart + curveWidth * 0.6} 0, ${centerX - notchRadius - curveWidth * 0.3} ${-notchDepth}, ${centerX - notchRadius * 0.5} ${-notchDepth}
    C ${centerX - notchRadius * 0.15} ${-notchDepth}, ${centerX + notchRadius * 0.15} ${-notchDepth}, ${centerX + notchRadius * 0.5} ${-notchDepth}
    C ${centerX + notchRadius + curveWidth * 0.3} ${-notchDepth}, ${rightEnd - curveWidth * 0.6} 0, ${rightEnd} 0
    L ${width} 0
    L ${width} ${height}
    L 0 ${height}
    Z
  `;
}
