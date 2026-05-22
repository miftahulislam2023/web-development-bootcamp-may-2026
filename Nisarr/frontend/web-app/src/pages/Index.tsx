import { useEffect, useMemo, useState } from "react";
import { SEO } from "@/components/seo/SEO";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet, ListTodo, Target, TrendingUp, CalendarDays, PiggyBank,
  BookOpen, Flame, BarChart3, Activity, ArrowUpRight, ArrowDownRight,
  GraduationCap, ChevronDown
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useTheme } from "@/hooks/useTheme";
import { useFinance } from "@/hooks/useFinance";
import { useBudget } from "@/hooks/useBudget";
import { useTasks } from "@/hooks/useTasks";
import { useHabits } from "@/hooks/useHabits";
import { useStudy } from "@/hooks/useStudy";
import { useNotes } from "@/hooks/useNotes";
import { useAuth } from "@/contexts/AuthContext";
import { Helmet } from "react-helmet-async";

import { AiSummaryCard } from "@/components/dashboard/AiSummaryCard";
import { MonthlySpendingCard } from "@/components/dashboard/MonthlySpendingCard";
import { ActivityOverviewCard } from "@/components/dashboard/ActivityOverviewCard";
import { TasksAndHabitsCard } from "@/components/dashboard/TasksAndHabitsCard";
import { StudyAndTransactionsCard } from "@/components/dashboard/StudyAndTransactionsCard";

// Color palette
const CATEGORY_COLORS: Record<string, string> = {
  "Food": "#06d6a0", "Transport": "#118ab2", "Entertainment": "#ffd166",
  "Bills": "#8338ec", "Shopping": "#ef476f", "Health": "#26de81",
  "Education": "#4ecdc4", "Other": "#95a5a6",
};

// Animated radial ring
function RadialProgress({ progress, size = 52, strokeWidth = 5, color = "#00D4AA", children }: {
  progress: number; size?: number; strokeWidth?: number; color?: string; children?: React.ReactNode;
}) {
  const r = (size - strokeWidth) / 2;
  const c = r * 2 * Math.PI;
  const o = c - (Math.min(100, Math.max(0, progress)) / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor"
          strokeWidth={strokeWidth} className="text-muted-foreground/10" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
          strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={o}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">{children}</div>
      )}
    </div>
  );
}

// Stagger children animation wrapper
const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const CollapsibleContent = ({ isExpanded, isMobile, children }: { isExpanded: boolean, isMobile: boolean, children: React.ReactNode }) => (
  <AnimatePresence>
    {(!isMobile || isExpanded) && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

const ExpandButton = ({ isExpanded, onClick, isMobile }: { isExpanded: boolean, onClick: () => void, isMobile: boolean }) => isMobile ? (
  <button
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ml-2"
  >
    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
  </button>
) : null;


const Index = () => {
  const { theme } = useTheme();
  const { user, isLoading: isUserLoading } = useAuth();

  // Mobile check and expand state
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "activity": true,
    "spending": true,
    "tasks": true,
    "habits": true,
    "study": true,
    "transactions": true,
    "ai_summary": true
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Life Hub AI Dashboard",
    "description": "Comprehensive personal dashboard for tracking tasks, habits, finances, and study progress with AI-driven insights.",
    "applicationCategory": "Productivity",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const { balance, totalIncome, totalExpenses, expensesByCategory, expenses, regularEntries, isLoading: isFinancesLoading } = useFinance();
  const { totalSavings, budgetRemaining, primaryBudget, savingsGoals } = useBudget();
  const { tasks, isLoading: isTasksLoading } = useTasks();
  const { habits, isLoading: isHabitsLoading } = useHabits();
  const { chapters, subjects, subjectProgress, chapterProgress, isLoading: isStudyLoading } = useStudy();
  const { notes, isLoading: isNotesLoading } = useNotes();

  useEffect(() => { document.documentElement.classList.add(theme); }, []);

  // Time-aware greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : hour < 21 ? "Good evening" : "Good night";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  // ===== TASK ANALYTICS =====
  const allTasks = tasks || [];
  const todayStr = new Date().toISOString().split("T")[0];
  const todaysTasks = allTasks.filter(t => t.due_date?.split("T")[0] === todayStr);
  const pendingTasks = allTasks.filter(t => t.status !== "done");
  const completedTasks = allTasks.filter(t => t.status === "done");
  const highPriorityTasks = pendingTasks.filter(t => t.priority === "high" || t.priority === "urgent");
  const taskCompletionRate = allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0;

  // ===== HABIT ANALYTICS =====
  const allHabits = habits || [];
  const habitsCompletedToday = allHabits.filter(h => {
    if (!h.last_completed_date) return false;
    return h.last_completed_date.split("T")[0] === todayStr;
  }).length;
  const habitCompletionRate = allHabits.length > 0 ? Math.round((habitsCompletedToday / allHabits.length) * 100) : 0;
  const bestStreak = allHabits.length > 0 ? Math.max(...allHabits.map(h => h.streak_count), 0) : 0;

  // ===== STUDY ANALYTICS =====
  const allChapters = chapters || [];
  const completedChapters = allChapters.filter(c => (chapterProgress[c.id] || 0) === 100).length;
  const studyProgress = allChapters.length > 0 ? Math.round(allChapters.reduce((s, c) => s + (chapterProgress[c.id] || 0), 0) / allChapters.length) : 0;
  const subjectProgressList = (subjects || []).map(s => ({ subject: s.name, progress: subjectProgress[s.id] || 0 })).sort((a, b) => b.progress - a.progress);

  // ===== FINANCE ANALYTICS =====
  const thisMonthExpenses = (regularEntries || []).filter(e => {
    const d = new Date(e.date);
    const now = new Date();
    return e.type === "expense" && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonthExpenses.reduce((s, e) => s + e.amount, 0);
  const lastMonthExpenses = (regularEntries || []).filter(e => {
    const d = new Date(e.date);
    const now = new Date();
    const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const lastYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    return e.type === "expense" && d.getMonth() === lastMonth && d.getFullYear() === lastYear;
  });
  const lastMonthTotal = lastMonthExpenses.reduce((s, e) => s + e.amount, 0);
  const expenseTrend = lastMonthTotal > 0 ? Math.round(((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100) : 0;

  // Expense chart data
  const expenseChartData = Object.entries(expensesByCategory || {}).map(([name, value]) => ({
    name, value, color: CATEGORY_COLORS[name] || CATEGORY_COLORS["Other"],
  }));

  const formatCurrency = (amount: number) => `৳${Math.abs(amount).toLocaleString()}`;
  const recentTransactions = (regularEntries || []).slice(0, 5);

  // Format date safely
  const formatTaskDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr + "T00:00:00");
      if (isNaN(d.getTime())) return "";
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch { return ""; }
  };

  // ===== AI SUMMARY =====
  const [aiSummary, setAiSummary] = useState<{ summary: string; alerts: string[]; tips: string[] } | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem("lifeos-daily-summary");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.date === todayStr) setAiSummary(parsed.data);
      } catch { }
    }
  }, []);

  // The generateAISummary function and callGroqAPI are removed as per instructions,
  // implying this logic has been moved or is no longer needed here.
  /*
  const generateAISummary = async () => {
    setIsSummaryLoading(true);
    setSummaryError(null);
    try {
      const contextPrompt = `You are an intelligent daily briefing AI for a personal life management app called LifeSolver. Analyze ALL of the user's data below and generate a concise, actionable daily summary.

Today's Date: ${today}
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
      setSummaryError("Failed to generate summary. Check your API key.");
    } finally {
      setIsSummaryLoading(false);
    }
  };
  */

  // Stat card data
  const statCards = [
    {
      icon: Target, label: "Budget Left", value: `৳${budgetRemaining.toLocaleString()}`,
      sub: primaryBudget?.name || "No budget",
      accent: "#f59e0b", gradient: "from-amber-500/20 via-amber-400/10 to-yellow-500/5",
      borderColor: "border-amber-200 dark:border-amber-500/25",
      trend: budgetRemaining >= 0 ? { value: Math.round((budgetRemaining / (primaryBudget?.target_amount || 1)) * 100), up: true } : null,
    },
    {
      icon: PiggyBank, label: "Total Savings", value: `৳${totalSavings.toLocaleString()}`,
      sub: `${savingsGoals.length} goal(s)`,
      accent: "#10b981", gradient: "from-emerald-500/20 via-emerald-400/10 to-green-500/5",
      borderColor: "border-emerald-200 dark:border-emerald-500/25",
      trend: null,
      className: "hidden sm:block",
    },
    {
      icon: Wallet, label: "Balance", value: `${balance >= 0 ? "" : "-"}${formatCurrency(balance)}`,
      sub: `Income: ৳${totalIncome.toLocaleString()}`,
      accent: "#3b82f6", gradient: "from-blue-500/20 via-blue-400/10 to-sky-500/5",
      borderColor: "border-blue-200 dark:border-blue-500/25",
      trend: balance >= 0 ? { value: Math.round((balance / (totalIncome || 1)) * 100), up: true } : null,
      className: "hidden sm:block",
    },
    {
      icon: ListTodo, label: "Pending Tasks", value: String(pendingTasks.length),
      sub: `${highPriorityTasks.length} high priority`,
      accent: "#ef4444", gradient: "from-rose-500/20 via-rose-400/10 to-pink-500/5",
      borderColor: "border-rose-200 dark:border-rose-500/25",
      trend: null,
    },
  ];

  if (isTasksLoading || isHabitsLoading || isFinancesLoading || isStudyLoading || isNotesLoading || isUserLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full min-h-[50vh]">
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout className="!pt-6 sm:!pt-8 md:pt-6">
      <SEO title="Dashboard" description="Overview of your tasks, finance, habits, and study progress." />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
        {/* ===== HEADER ===== */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
          {/* Mobile Header Card */}
          <div className="block md:hidden">
            <div className="rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 p-6 text-white shadow-lg shadow-indigo-500/25 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -ml-12 -mb-12"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 text-white/80 text-xs font-medium mb-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>{today}</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight mb-1">
                  {greeting}, <span className="text-white">{user?.name?.split(" ")[0] || "User"}</span>
                </h1>
                <p className="text-white/70 text-xs">Here's your daily snapshot</p>
              </div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:block">
            <div className="rounded-2xl border-2 border-primary/10 bg-gradient-to-br from-primary/5 via-card/80 to-transparent backdrop-blur-sm p-6 sm:p-8 relative overflow-hidden shadow-sm">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2 font-medium">
                  <CalendarDays className="w-4 h-4 text-primary/70" />
                  <span>{today}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                  {greeting}, <span className="text-gradient">{user?.name?.split(" ")[0] || "User"}</span>
                </h1>
                <p className="text-muted-foreground text-sm">{aiSummary?.summary ? aiSummary.summary : "Here's your daily snapshot"}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ===== STAT CARDS ===== */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-3 mb-3 sm:mb-6">
        {statCards.map((stat) => (
          <motion.div key={stat.label} variants={fadeUp}
            className={`group relative overflow-hidden rounded-lg sm:rounded-2xl p-2 sm:p-4 bg-gradient-to-br ${stat.gradient} border-2 ${stat.borderColor} hover:shadow-xl transition-all duration-300 cursor-default ${stat.className || ""}`}
          >
            {/* Glow orb */}
            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-25 blur-2xl transition-opacity duration-500 group-hover:opacity-50"
              style={{ backgroundColor: stat.accent }} />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-1.5 sm:mb-3">
                <div className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl shadow-sm" style={{ backgroundColor: `${stat.accent}25`, boxShadow: `0 2px 8px ${stat.accent}15` }}>
                  <stat.icon className="w-3.5 h-3.5 sm:w-5 sm:h-5" style={{ color: stat.accent }} />
                </div>
                {stat.trend && (
                  <Badge variant="outline" className="text-[8px] sm:text-[10px] h-4 sm:h-5 font-semibold" style={{ borderColor: `${stat.accent}40`, color: stat.accent }}>
                    {stat.trend.up ? <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5" /> : <ArrowDownRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5" />}
                    {stat.trend.value}%
                  </Badge>
                )}
              </div>
              <h3 className="text-base sm:text-xl md:text-2xl font-bold tracking-tight">{stat.value}</h3>
              <p className="text-[9px] sm:text-xs mt-0.5 font-semibold" style={{ color: stat.accent }}>{stat.label}</p>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground/60 mt-0.5 hidden sm:block">{stat.sub}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ===== BENTO GRID ===== */}
      <motion.div variants={stagger} initial="hidden" animate="show"
        className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 mb-4 sm:mb-6"
      >

        {/* ── AI Summary (span 8) ── */}
        <motion.div variants={fadeUp} className="lg:col-span-8 order-1">
          <AiSummaryCard 
            todayStr={todayStr}
            todayDisplay={today}
            allTasks={allTasks}
            completedTasks={completedTasks}
            pendingTasks={pendingTasks}
            highPriorityTasks={highPriorityTasks}
            allHabits={allHabits}
            habitsCompletedToday={habitsCompletedToday}
            balance={balance}
            thisMonthTotal={thisMonthTotal}
            budgetRemaining={budgetRemaining}
            totalSavings={totalSavings}
            expenseChartData={expenseChartData}
            studyProgress={studyProgress}
            subjectProgressList={subjectProgressList}
            notes={notes || []}
          />
        </motion.div>

        {/* ── Monthly Spending (span 4) ── */}
        <motion.div variants={fadeUp} className="lg:col-span-4 order-3 lg:order-2">
          <MonthlySpendingCard 
            thisMonthTotal={thisMonthTotal}
            lastMonthTotal={lastMonthTotal}
            expenseTrend={expenseTrend}
            expenseChartData={expenseChartData}
          />
        </motion.div>

        {/* ===== ACTIVITY OVERVIEW (Moved inside grid for mobile ordering) ===== */}
        <motion.div variants={fadeUp} className="lg:col-span-12 order-2 lg:order-3">
          <ActivityOverviewCard 
            completedTasks={completedTasks}
            allTasks={allTasks}
            habitsCompletedToday={habitsCompletedToday}
            allHabits={allHabits}
            studyProgress={studyProgress}
            notes={notes || []}
          />
        </motion.div>
      </motion.div>

      {/* ===== BOTTOM 3-COL GRID ===== */}
      <motion.div variants={stagger} initial="hidden" animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6"
      >
        {/* ── Recent Tasks and Habits ── */}
        <TasksAndHabitsCard 
          completedTasks={completedTasks}
          pendingTasks={pendingTasks}
          taskCompletionRate={taskCompletionRate}
          formatTaskDate={formatTaskDate}
          habitsCompletedToday={habitsCompletedToday}
          allHabits={allHabits}
          bestStreak={bestStreak}
          habitCompletionRate={habitCompletionRate}
          todayStr={todayStr}
        />

        {/* ── Study + Transactions ── */}
        <motion.div variants={fadeUp} className="space-y-4">
          <StudyAndTransactionsCard 
            studyProgress={studyProgress}
            completedChapters={completedChapters}
            allChapters={allChapters}
            subjectProgressList={subjectProgressList}
            recentTransactions={recentTransactions}
          />
        </motion.div>
      </motion.div>
    </AppLayout>
  );
};

export default Index;
