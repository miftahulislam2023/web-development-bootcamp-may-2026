import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Loader2, Sparkles, AlertCircle, Lightbulb, ChevronDown } from "lucide-react";
import { callGroqAPI } from "@/ai/core/groq-client";

// Props derived from the dashboard context needed for summary generation
interface AiSummaryCardProps {
  todayStr: string;
  todayDisplay: string;
  allTasks: any[];
  completedTasks: any[];
  pendingTasks: any[];
  highPriorityTasks: any[];
  allHabits: any[];
  habitsCompletedToday: number;
  balance: number;
  thisMonthTotal: number;
  budgetRemaining: number;
  totalSavings: number;
  expenseChartData: any[];
  studyProgress: number;
  subjectProgressList: any[];
  notes: any[];
}

export function AiSummaryCard({
  todayStr,
  todayDisplay,
  allTasks,
  completedTasks,
  pendingTasks,
  highPriorityTasks,
  allHabits,
  habitsCompletedToday,
  balance,
  thisMonthTotal,
  budgetRemaining,
  totalSavings,
  expenseChartData,
  studyProgress,
  subjectProgressList,
  notes
}: AiSummaryCardProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // AI State
  const [aiSummary, setAiSummary] = useState<{ summary: string; alerts: string[]; tips: string[] } | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  useEffect(() => {
    // Note: Migrating to standard CSS max-width approach where possible, 
    // but preserving exact state toggles for the expander mechanism to prevent UI breakage
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const cached = localStorage.getItem("lifeos-daily-summary");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.date === todayStr) setAiSummary(parsed.data);
      } catch { }
    }
  }, [todayStr]);

  const generateAISummary = async () => {
    setIsSummaryLoading(true);
    setSummaryError(null);
    try {
      const contextPrompt = `You are an intelligent daily briefing AI for a personal life management app called LifeSolver. Analyze ALL of the user's data below and generate a concise, actionable daily summary.

Today's Date: ${todayDisplay}
Time: ${new Date().toLocaleTimeString()}

=== TASKS (${allTasks.length} total, ${completedTasks.length} completed, ${pendingTasks.length} pending) ===
High Priority: ${highPriorityTasks.map(t => t.title).join(', ') || 'None'}
Pending Tasks: ${pendingTasks.slice(0, 8).map(t => `"${t.title}" [${t.priority}] due:${t.due_date || 'none'}`).join('; ') || 'None'}

=== HABITS (${allHabits.length} total, ${habitsCompletedToday}/${allHabits.length} done today) ===
${allHabits.map(h => `${h.habit_name}: streak=${h.streak_count}, done_today=${h.last_completed_date?.startsWith(todayStr) ? 'yes' : 'no'}`).join('\n') || 'No habits'}

=== FINANCE ===
Balance: ৳${balance}
This Month Spending: ৳${thisMonthTotal}
Budget Remaining: ৳${budgetRemaining}
Total Savings: ৳${totalSavings}
Top Expense Categories: ${expenseChartData.slice(0, 3).map(c => `${c.name}=৳${c.value}`).join(', ') || 'None'}

=== STUDY (${studyProgress}% overall) ===
${subjectProgressList.slice(0, 5).map(s => `${s.subject}: ${s.progress}%`).join(', ') || 'No study data'}

=== NOTES (${(notes || []).length} total) ===
${(notes || []).slice(0, 5).map(n => `"${n.title}"`).join(', ') || 'No notes'}

Respond in this EXACT JSON format:
{
  "summary": "A 2-3 sentence overview of the user's day so far and what they should focus on",
  "alerts": ["important warnings or overdue items - max 3 items"],
  "tips": ["actionable suggestions based on their data - max 3 items"]
}`;

      const response = await callGroqAPI([
        { role: "system", content: contextPrompt },
        { role: "user", content: "Generate my daily AI briefing summary." }
      ], { temperature: 0.5, maxTokens: 512 });

      const parsed = JSON.parse(response);
      const summaryData = {
        summary: parsed.summary || "No summary available.",
        alerts: parsed.alerts || [],
        tips: parsed.tips || [],
      };
      setAiSummary(summaryData);
      localStorage.setItem("lifeos-daily-summary", JSON.stringify({ date: todayStr, data: summaryData }));
    } catch (err) {
      console.error("AI Summary error:", err);
      setSummaryError("Failed to generate summary. Check your AI integration configuration.");
    } finally {
      setIsSummaryLoading(false);
    }
  };

  return (
    <div className="rounded-xl sm:rounded-2xl border-2 border-sky-200 dark:border-sky-500/20 bg-gradient-to-br from-sky-50/50 via-card/80 to-indigo-50/30 dark:from-sky-950/20 dark:via-card/80 dark:to-indigo-950/10 backdrop-blur-sm p-4 sm:p-5 relative overflow-hidden h-full">
      {/* Background accents */}
      <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[80px] opacity-20"
        style={{ background: "linear-gradient(135deg, #38bdf8, #6366f1)" }} />
      <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full blur-[60px] opacity-10"
        style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-500/10">
              <Brain className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Orbit AI Summary</h3>
              <p className="text-[10px] text-muted-foreground">Your intelligent daily briefing</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={generateAISummary}
              disabled={isSummaryLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 disabled:opacity-50
                bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSummaryLoading ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing...</>
              ) : (
                <><Sparkles className="w-3.5 h-3.5" /> {aiSummary ? "Refresh" : "Generate"}</>
              )}
            </button>
            {isMobile && (
              <button
                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-label="Toggle Summary"
              >
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
              </button>
            )}
           </div>
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
              <AnimatePresence mode="wait">
                {summaryError && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="p-3 rounded-xl bg-red-500/8 border border-red-500/15 text-red-400 text-sm"
                  >
                    {summaryError}
                  </motion.div>
                )}

                {aiSummary ? (
                  <motion.div key="summary" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <p className="text-sm text-foreground/80 leading-relaxed">{aiSummary.summary}</p>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {aiSummary.alerts.length > 0 && (
                        <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <AlertCircle className="w-3 h-3 text-amber-400" />
                            <span className="text-[11px] font-semibold text-amber-400">Attention</span>
                          </div>
                          <ul className="space-y-0.5">
                            {aiSummary.alerts.map((a, i) => (
                              <li key={i} className="text-[11px] text-muted-foreground flex gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />{a}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {aiSummary.tips.length > 0 && (
                        <div className="p-3 rounded-xl bg-sky-500/5 border border-sky-500/10">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Lightbulb className="w-3 h-3 text-sky-400" />
                            <span className="text-[11px] font-semibold text-sky-400">Suggestions</span>
                          </div>
                          <ul className="space-y-0.5">
                            {aiSummary.tips.map((t, i) => (
                              <li key={i} className="text-[11px] text-muted-foreground flex gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-sky-400 mt-1.5 shrink-0" />{t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : !isSummaryLoading && !summaryError && (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500/10 to-indigo-500/10 flex items-center justify-center mb-3">
                      <Sparkles className="w-6 h-6 text-sky-400/40" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">Click "Generate" for your AI-powered daily briefing</p>
                    <p className="text-[10px] text-muted-foreground/50 mt-1">Orbit analyzes tasks, habits, finances & study data</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
