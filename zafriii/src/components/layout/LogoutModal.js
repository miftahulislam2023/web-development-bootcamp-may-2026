"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X, AlertTriangle } from "lucide-react";

export default function LogoutModal({ isOpen, onClose, onConfirm, isDarkMode }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`relative w-full max-w-sm overflow-hidden rounded-[24px] shadow-2xl border ${isDarkMode ? "bg-[#1a202c] border-gray-700" : "bg-white border-blue-50"
            }`}
        >
          {/* Header/Banner */}
          <div className={`h-24 flex items-center justify-center ${isDarkMode ? "bg-red-500/10" : "bg-red-50"}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDarkMode ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-500"}`}>
              <LogOut size={32} />
            </div>
          </div>

          <div className="p-6 text-center">
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Confirm Logout
            </h3>
            <p className={`text-sm mb-6 px-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Are you sure you want to sign out? You'll need to login again to access your chats.
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={onConfirm}
                className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all transform active:scale-95 shadow-lg shadow-red-500/20 text-sm"
              >
                Log Out
              </button>
              <button
                onClick={onClose}
                className={`w-full py-3 rounded-xl transition-all transform active:scale-95 text-sm ${isDarkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Close Icon */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-1 rounded-full transition-colors ${isDarkMode ? "text-gray-500 hover:bg-gray-800" : "text-gray-400 hover:bg-gray-100"
              }`}
          >
            <X size={18} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
