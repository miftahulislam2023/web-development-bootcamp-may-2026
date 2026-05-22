import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ListTodo, CheckCircle2, Flame, ChevronDown } from "lucide-react";
import { RadialProgress } from "@/components/ui/radial-progress";

interface TasksAndHabitsCardProps {
  completedTasks: any[];
  pendingTasks: any[];
  taskCompletionRate: number;
  formatTaskDate: (dateStr?: string) => string;
  habitsCompletedToday: number;
  allHabits: any[];
  bestStreak: number;
  habitCompletionRate: number;
  todayStr: string;
}

export function TasksAndHabitsCard({
  completedTasks,
  pendingTasks,
  taskCompletionRate,
  formatTaskDate,
  habitsCompletedToday,
  allHabits,
  bestStreak,
  habitCompletionRate,
  todayStr
}: TasksAndHabitsCardProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    tasks: true,
    habits: true
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
    <>
      {/* ── Recent Tasks ── */}
      <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}>
        <div className="rounded-xl sm:rounded-2xl border-2 border-blue-200 dark:border-blue-500/20 bg-gradient-to-br from-blue-50/40 via-card/80 to-sky-50/20 dark:from-blue-950/15 dark:via-card/80 dark:to-sky-950/10 backdrop-blur-sm p-4 sm:p-5 h-full relative overflow-hidden">
          {/* Glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-blue-500 opacity-[0.06] blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/15 shadow-sm shadow-blue-500/10">
                  <ListTodo className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Recent Tasks</h3>
                  <p className="text-[10px] text-muted-foreground">{completedTasks.length} done · {pendingTasks.length} pending</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <RadialProgress progress={taskCompletionRate} color="#3b82f6" size={36} strokeWidth={3.5}>
                  <span className="text-[8px] font-bold text-blue-500">{taskCompletionRate}%</span>
                </RadialProgress>
                {isMobile && (
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleSection("tasks"); }}
                    className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ml-1"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedSections["tasks"] ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>
            </div>

            <AnimatePresence>
              {(!isMobile || expandedSections["tasks"]) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {/* Progress bar */}
                  <div className="h-1 rounded-full bg-blue-100 dark:bg-blue-900/30 overflow-hidden mb-4 mt-3">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${taskCompletionRate}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-400" />
                  </div>

                  <div className="space-y-1">
                    {pendingTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                        <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center mb-2">
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        </div>
                        <p className="text-sm font-medium">All clear! 🎉</p>
                      </div>
                    ) : (
                      pendingTasks.slice(0, 5).map((task, i) => (
                        <motion.div key={task.id}
                          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i }}
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-blue-500/5 dark:hover:bg-blue-500/10 transition-all group cursor-default"
                        >
                          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ring-2 ${task.priority === "urgent" ? "bg-red-500 ring-red-500/30" :
                            task.priority === "high" ? "bg-red-400 ring-red-400/20" :
                              task.priority === "medium" ? "bg-amber-400 ring-amber-400/20" :
                                "bg-blue-300 ring-blue-300/20"
                            }`} />
                          <span className="text-sm truncate flex-1 font-medium">{task.title}</span>
                          {task.due_date && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-blue-500/8 text-blue-500 dark:text-blue-400 font-medium shrink-0">
                              {formatTaskDate(task.due_date)}
                            </span>
                          )}
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* ── Habits ── */}
      <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}>
        <div className="rounded-xl sm:rounded-2xl border-2 border-orange-200 dark:border-orange-500/20 bg-gradient-to-br from-orange-50/40 via-card/80 to-amber-50/20 dark:from-orange-950/15 dark:via-card/80 dark:to-amber-950/10 backdrop-blur-sm p-4 sm:p-5 h-full relative overflow-hidden">
          {/* Glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-orange-500 opacity-[0.06] blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-500/15 shadow-sm shadow-orange-500/10">
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Habits</h3>
                  <p className="text-[10px] text-muted-foreground">{habitsCompletedToday}/{allHabits.length} completed · 🔥 Best: {bestStreak}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <RadialProgress progress={habitCompletionRate} color="#f97316" size={36} strokeWidth={3.5}>
                  <span className="text-[8px] font-bold text-orange-500">{habitCompletionRate}%</span>
                </RadialProgress>
                {isMobile && (
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleSection("habits"); }}
                    className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ml-1"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedSections["habits"] ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>
            </div>

            <AnimatePresence>
              {(!isMobile || expandedSections["habits"]) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {/* Progress bar */}
                  <div className="h-1 rounded-full bg-orange-100 dark:bg-orange-900/30 overflow-hidden mb-4 mt-3">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${habitCompletionRate}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400" />
                  </div>

                  <div className="space-y-1">
                    {allHabits.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-2">
                          <Flame className="w-6 h-6 text-orange-400" />
                        </div>
                        <p className="text-sm font-medium">No habits yet</p>
                      </div>
                    ) : (
                      allHabits.slice(0, 5).map((habit, i) => {
                        const done = habit.last_completed_date?.split("T")[0] === todayStr;
                        return (
                          <motion.div key={habit.id}
                            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-orange-500/5 dark:hover:bg-orange-500/10 transition-all cursor-default"
                          >
                            <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 transition-all ${done
                              ? "bg-gradient-to-br from-green-400 to-emerald-500 shadow-md shadow-green-500/25"
                              : "bg-muted/30 border-2 border-muted-foreground/15"
                              }`}>
                              {done && <CheckCircle2 className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`text-sm truncate flex-1 font-medium ${done ? "text-muted-foreground line-through" : ""}`}>
                              {habit.habit_name}
                            </span>
                            {habit.streak_count > 0 && (
                              <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500/15 to-amber-500/10 border border-orange-300/30 dark:border-orange-500/20">
                                <Flame className="w-3 h-3 text-orange-500 fill-current" />
                                <span className="text-[10px] font-bold text-orange-500">{habit.streak_count}</span>
                              </div>
                            )}
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
}
