import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Moon,
  Sun,
  MoreHorizontal,
  X,
  Search,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { useNavPreferences } from "@/hooks/useNavPreferences";
import { useAI } from "@/contexts/AIContext";

export function BottomNav() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [showMore, setShowMore] = useState(false);
  const { mainNavItems, moreNavItems } = useNavPreferences();
  const { isChatOpen, setChatOpen } = useAI();

  // Check if any "more" item is active
  const isMoreActive = moreNavItems.some(item => location.pathname === item.path);

  return (
    <>
      {/* More Menu Overlay */}
      <AnimatePresence>
        {showMore && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setShowMore(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed bottom-24 left-4 right-4 glass-card rounded-2xl p-4 z-50 md:hidden shadow-2xl shadow-black/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">More Options</h3>
                <button onClick={() => setShowMore(false)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {moreNavItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setShowMore(false)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${isActive
                        ? "bg-primary/15 text-primary shadow-sm"
                        : "hover:bg-secondary text-muted-foreground"
                        }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-[10px] font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
              <div className="h-[1px] bg-border/20 w-full mb-4" />
              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("openGlobalSearch"));
                    setShowMore(false);
                  }}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all hover:bg-secondary text-muted-foreground"
                >
                  <Search className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Search</span>
                </button>
                <button
                  onClick={() => {
                    toggleTheme();
                    setShowMore(false);
                  }}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all hover:bg-secondary text-muted-foreground"
                >
                  {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  <span className="text-[10px] font-medium">Theme</span>
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Bottom Navigation - hidden when AI chat is open */}
      <nav className="bottom-nav" style={isChatOpen ? { display: 'none' } : undefined}>
        <div className="floating-nav-container">
          {/* Primary Nav Items Container */}
          <div className="flex items-center gap-1 bg-secondary/80 dark:bg-secondary/50 rounded-full px-2 py-1 border border-border/50 dark:border-white/5 backdrop-blur-sm shadow-sm">
            {mainNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} className="relative">
                  <motion.div
                    className={`floating-nav-item ${isActive ? "active" : ""}`}
                    whileTap={{ scale: 0.92 }}
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-item-bg"
                        className="absolute inset-0 bg-primary/10 rounded-full -z-10 border border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.2)] dark:border-yellow-400/50 dark:shadow-[0_0_10px_rgba(250,204,21,0.2)]"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <item.icon className="w-4 h-4" />
                    <AnimatePresence mode="wait">
                      {isActive && (
                        <motion.span
                          key={item.label}
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: "auto", opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="text-[10px] font-semibold overflow-hidden whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              );
            })}
            {/* More Button */}
            <button onClick={() => setShowMore(!showMore)} className="relative">
              <motion.div
                className={`floating-nav-item ${showMore || isMoreActive ? "active" : ""}`}
                whileTap={{ scale: 0.92 }}
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {(showMore || isMoreActive) && (
                  <motion.div
                    layoutId="nav-item-bg"
                    className="absolute inset-0 bg-primary/10 rounded-full -z-10 border border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.2)] dark:border-yellow-400/50 dark:shadow-[0_0_10px_rgba(250,204,21,0.2)]"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <MoreHorizontal className="w-4 h-4" />
              </motion.div>
            </button>
          </div>

          {/* Separator */}
          <div className="w-[1px] h-8 bg-border/20 mx-1" />

          {/* Utility Buttons Logic */}
          <div className="flex items-center gap-1 bg-secondary/80 dark:bg-secondary/50 rounded-full px-2 py-1 border border-border/50 dark:border-white/5 backdrop-blur-sm shadow-sm">
            {/* AI Button */}
            <button onClick={() => setChatOpen(!isChatOpen)} className="relative">
              <motion.div
                className={`floating-nav-item ${isChatOpen ? "active" : ""}`}
                whileTap={{ scale: 0.92 }}
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {isChatOpen && (
                  <motion.div
                    layoutId="nav-item-bg"
                    className="absolute inset-0 bg-primary/10 rounded-full -z-10 border border-violet-500/50 shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <Sparkles className="w-4 h-4" />
              </motion.div>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
