import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, CheckCircle2, Flame, GraduationCap, BookOpen, ChevronDown } from "lucide-react";
import { RadialProgress } from "@/components/ui/radial-progress";

interface ActivityOverviewCardProps {
  completedTasks: any[];
  allTasks: any[];
  habitsCompletedToday: number;
  allHabits: any[];
  studyProgress: number;
  notes: any[];
}

export function ActivityOverviewCard({
  completedTasks,
  allTasks,
  habitsCompletedToday,
  allHabits,
  studyProgress,
  notes
}: ActivityOverviewCardProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="rounded-xl sm:rounded-2xl border-2 border-primary/10 bg-gradient-to-br from-primary/5 via-card/80 to-transparent backdrop-blur-sm p-4 sm:p-5 relative overflow-hidden">
      {/* Glow orb */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 shadow-sm shadow-primary/5">
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Activity Overview</h3>
              <p className="text-[10px] text-muted-foreground">Your daily progress</p>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
              className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>

        <AnimatePresence>
          {(!isMobile || isExpanded) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                {[
                  {
                    label: "Tasks Done", value: completedTasks.length, total: allTasks.length,
                    color: "#3b82f6", icon: CheckCircle2,
                    gradient: "from-blue-500/15 via-blue-400/5 to-transparent",
                    border: "border-blue-200 dark:border-blue-500/20",
                    bg: "bg-blue-500/10",
                  },
                  {
                    label: "Habits Today", value: habitsCompletedToday, total: allHabits.length,
                    color: "#10b981", icon: Flame,
                    gradient: "from-emerald-500/15 via-emerald-400/5 to-transparent",
                    border: "border-emerald-200 dark:border-emerald-500/20",
                    bg: "bg-emerald-500/10",
                  },
                  {
                    label: "Study Progress", value: studyProgress, total: 100,
                    color: "#8b5cf6", icon: GraduationCap, suffix: "%",
                    gradient: "from-violet-500/15 via-violet-400/5 to-transparent",
                    border: "border-violet-200 dark:border-violet-500/20",
                    bg: "bg-violet-500/10",
                  },
                  {
                    label: "Notes Written", value: (notes || []).length, total: null,
                    color: "#f59e0b", icon: BookOpen,
                    gradient: "from-amber-500/15 via-amber-400/5 to-transparent",
                    border: "border-amber-200 dark:border-amber-500/20",
                    bg: "bg-amber-500/10",
                  },
                ].map((item, i) => {
                  const pct = item.total ? Math.round((item.value / item.total) * 100) : 100;
                  return (
                    <motion.div key={item.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                      className={`group relative overflow-hidden rounded-xl p-3 bg-gradient-to-br ${item.gradient} border ${item.border} backdrop-blur-sm transition-all duration-300 hover:shadow-md cursor-default flex items-center justify-between`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className={`p-1 rounded-md ${item.bg}`}>
                            <item.icon className="w-3 h-3" style={{ color: item.color }} />
                          </div>
                          <span className="text-[10px] font-medium text-muted-foreground/80">{item.label}</span>
                        </div>

                        <h4 className="text-xl font-bold tracking-tight leading-none" style={{ color: item.color }}>
                          {item.value}{item.suffix || ""}
                        </h4>

                        {item.total !== null && (
                          <p className="text-[9px] text-muted-foreground/60 font-medium mt-1">
                            {item.value} / {item.total}
                          </p>
                        )}
                      </div>

                      <RadialProgress progress={pct} color={item.color} size={42} strokeWidth={4}>
                        <span className="text-[9px] font-bold" style={{ color: item.color }}>{pct}%</span>
                      </RadialProgress>

                      {/* Glow orb */}
                      <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500"
                        style={{ backgroundColor: item.color }} />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
