"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Settings, HelpCircle, LogOut, User } from "lucide-react";

export default function SettingsDropdown({ isOpen, onClose, isDarkMode, onToggleDarkMode }) {
  const userDP = "https://api.dicebear.com/7.x/avataaars/svg?seed=YoungCoder";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={onClose} />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className={`absolute top-16 left-4 w-80 z-50 rounded-2xl shadow-2xl p-2 border transition-colors duration-300 ${
              isDarkMode ? "bg-[#2d3748] border-gray-700 text-white" : "bg-white border-gray-100 text-gray-900"
            }`}
          >
            {/* User Profile Info */}
            <div className={`flex items-center gap-4 p-4 rounded-xl mb-2 transition-colors ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#36649f]">
                <img src={userDP} alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Young Coder</span>
                <span className="text-xs text-gray-400">See your profile</span>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={onToggleDarkMode}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? "bg-indigo-900 text-indigo-400" : "bg-gray-200 text-gray-600"}`}>
                  {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                </div>
                <span className="font-medium text-sm">Dark Mode</span>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-colors ${isDarkMode ? "bg-[#36649f]" : "bg-gray-300"}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isDarkMode ? "right-1" : "left-1"}`} />
              </div>
            </button>

            {/* Other Options */}
            <div className="my-2 px-4"><div className={`h-[1px] w-full ${isDarkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`} /></div>

            {[
              { icon: <Settings size={18} />, label: "Account Settings" },
              { icon: <HelpCircle size={18} />, label: "Help & Support" },
              { icon: <LogOut size={18} />, label: "Log Out", color: "text-red-500" },
            ].map((option, idx) => (
              <button 
                key={idx}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} ${option.color || ""}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  {option.icon}
                </div>
                <span className="font-medium text-sm">{option.label}</span>
              </button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
