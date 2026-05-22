import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Clock, ArrowUpRight, ArrowDownRight, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StudyAndTransactionsCardProps {
  studyProgress: number;
  completedChapters: number;
  allChapters: any[];
  subjectProgressList: any[];
  recentTransactions: any[];
}

export function StudyAndTransactionsCard({
  studyProgress,
  completedChapters,
  allChapters,
  subjectProgressList,
  recentTransactions
}: StudyAndTransactionsCardProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    study: true,
    transactions: true
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="space-y-4">
      {/* Study Progress */}
      <div className="rounded-xl sm:rounded-2xl border-2 border-violet-200 dark:border-violet-500/20 bg-gradient-to-br from-violet-50/30 via-card/80 to-purple-50/20 dark:from-violet-950/15 dark:via-card/80 dark:to-purple-950/10 backdrop-blur-sm p-4 sm:p-5 relative overflow-hidden">
        <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-violet-500 opacity-[0.05] blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-violet-500/15 shadow-sm shadow-violet-500/10">
                <GraduationCap className="w-4 h-4 text-violet-500" />
              </div>
              <h3 className="font-semibold text-sm">Study</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-violet-500">{studyProgress}%</span>
              <Badge className="text-[9px] rounded-full bg-violet-500/10 text-violet-500 border-violet-300/30 dark:border-violet-500/20 hover:bg-violet-500/15">
                {completedChapters}/{allChapters.length}
              </Badge>
              {isMobile && (
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSection("study"); }}
                  className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ml-1"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedSections["study"] ? "rotate-180" : ""}`} />
                </button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {(!isMobile || expandedSections["study"]) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {subjectProgressList.length > 0 ? (
                  <div className="space-y-3">
                    {subjectProgressList.slice(0, 3).map((sp, i) => (
                      <div key={sp.subject}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-semibold">{sp.subject}</span>
                          <span className="font-bold text-violet-500">{sp.progress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-violet-100/50 dark:bg-violet-900/20 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${sp.progress}%` }}
                            transition={{ duration: 1, delay: 0.3 + i * 0.15 }}
                            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 shadow-sm shadow-violet-500/20"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">No study data</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-xl sm:rounded-2xl border-2 border-cyan-200 dark:border-cyan-500/20 bg-gradient-to-br from-cyan-50/30 via-card/80 to-teal-50/20 dark:from-cyan-950/15 dark:via-card/80 dark:to-teal-950/10 backdrop-blur-sm p-4 sm:p-5 relative overflow-hidden">
        <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-cyan-500 opacity-[0.05] blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/15 shadow-sm shadow-cyan-500/10">
                <Clock className="w-4 h-4 text-cyan-500" />
              </div>
              <h3 className="font-semibold text-sm">Transactions</h3>
            </div>
            {isMobile && (
              <button
                onClick={(e) => { e.stopPropagation(); toggleSection("transactions"); }}
                className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedSections["transactions"] ? "rotate-180" : ""}`} />
              </button>
            )}
          </div>

          <AnimatePresence>
            {(!isMobile || expandedSections["transactions"]) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-1.5">
                  {recentTransactions.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">No transactions</p>
                  ) : (
                    recentTransactions.slice(0, 4).map((tx, i) => (
                      <motion.div key={tx.id}
                        initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 * i }}
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-cyan-500/5 dark:hover:bg-cyan-500/8 transition-all"
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${tx.type === "income"
                          ? "bg-gradient-to-br from-green-400/20 to-emerald-500/10 shadow-green-500/10"
                          : "bg-gradient-to-br from-red-400/20 to-rose-500/10 shadow-red-500/10"
                          }`}>
                          {tx.type === "income" ? (
                            <ArrowUpRight className="w-4 h-4 text-green-500" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs truncate font-semibold">{tx.description || tx.category}</p>
                          {tx.category && tx.description && (
                            <p className="text-[9px] text-muted-foreground/60">{tx.category}</p>
                          )}
                        </div>
                        <span className={`text-xs font-bold shrink-0 ${tx.type === "income" ? "text-green-500" : "text-red-500"
                          }`}>
                          {tx.type === "income" ? "+" : "-"}৳{tx.amount.toLocaleString()}
                        </span>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
