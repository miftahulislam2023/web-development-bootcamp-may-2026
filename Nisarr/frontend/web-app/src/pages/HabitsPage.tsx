import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Flame, Check, Trash2, Target, TrendingUp, Zap,
    Lightbulb, Search, Brain, Sparkles, Edit2,
    ChevronLeft, ChevronRight, Calendar as CalendarIcon, ArrowUpDown, SlidersHorizontal, Filter, MoreHorizontal
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/seo/SEO";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useHabits, Habit, HABIT_CATEGORIES, HabitCategory } from "@/hooks/useHabits";
import { getHabitTips, getHabitCoaching } from "@/lib/groq";

import { useAI } from "@/contexts/AIContext";
import { cn } from "@/lib/utils";

// Native date formatting helper (replaces date-fns format)
const formatDate = (date: Date, style: "short" | "monthDay" | "monthYear" | "full" = "full") => {
    switch (style) {
        case "short": return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        case "monthDay": return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        case "monthYear": return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
        default: return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
};

// Streak flame with intensity
function StreakFlame({ streak, size = "md" }: { streak: number; size?: "sm" | "md" }) {
    const intensity = streak >= 30 ? "text-red-500" : streak >= 14 ? "text-orange-500" : streak >= 7 ? "text-amber-500" : streak > 0 ? "text-yellow-500" : "text-muted-foreground/30";
    const fillIntensity = streak >= 7 ? `fill-current ${intensity}` : "";
    const sizeClass = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
    return <Flame className={cn(sizeClass, "transition-all", intensity, fillIntensity)} />;
}

export default function HabitsPage() {
    const { habits, isLoading, addHabit, updateHabit, completeHabit, deleteHabit } = useHabits();
    const { setPageContext } = useAI();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
    const [newHabit, setNewHabit] = useState({ name: "", category: "general" as HabitCategory });
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState<string>("all");

    // View mode & sorting (mirroring Finance page pattern)
    type HabitViewMode = "daily" | "weekly" | "monthly" | "custom" | "all";
    const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly" | "custom" | "all">("weekly");
    const [sortBy, setSortBy] = useState<"default" | "streak" | "name" | "category">("default");
    const [weekStart, setWeekStart] = useState<"monday" | "sunday" | "saturday">("monday");

    const getLocalDateStr = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const [selectedDate, setSelectedDate] = useState(() => getLocalDateStr(new Date()));
    const [customStartDate, setCustomStartDate] = useState(() => getLocalDateStr(new Date()));
    const [customEndDate, setCustomEndDate] = useState(() => getLocalDateStr(new Date()));

    // AI state
    const [aiTips, setAiTips] = useState<string | null>(null);
    const [aiTipsFor, setAiTipsFor] = useState<string>("");
    const [loadingTips, setLoadingTips] = useState(false);
    const [coaching, setCoaching] = useState<string | null>(null);
    const [loadingCoaching, setLoadingCoaching] = useState(false);

    const isCompletedToday = (habit: Habit) => {
        if (!habit.last_completed_date) return false;
        const today = new Date().toISOString().split("T")[0];
        const lastCompleted = habit.last_completed_date.split("T")[0];
        return lastCompleted === today;
    };

    const isCompletedOnDate = (habit: Habit, date: Date) => {
        if (!habit.last_completed_date) return false;
        // Use T12:00:00 to avoid timezone shifts when parsing YYYY-MM-DD
        const lastCompleted = new Date(habit.last_completed_date.split("T")[0] + "T12:00:00");
        lastCompleted.setHours(0, 0, 0, 0);

        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);

        // Check date cannot be after last completed date
        if (checkDate.getTime() > lastCompleted.getTime()) return false;

        // Calculate difference in days
        const diffTime = lastCompleted.getTime() - checkDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        // If within streak range
        // e.g. streak 1, diff 0 => true. streak 2, diff 1 => true.
        return diffDays >= 0 && diffDays < habit.streak_count;
    };

    // Build date range based on view mode
    const getDateRange = () => {
        const selected = new Date(selectedDate + "T12:00:00");
        switch (viewMode) {
            case "daily":
                return { start: selectedDate, end: selectedDate };
            case "weekly": {
                const dow = selected.getDay();
                let offset = 0;
                if (weekStart === "monday") {
                    offset = dow === 0 ? -6 : 1 - dow;
                } else if (weekStart === "sunday") {
                    offset = -dow;
                } else {
                    // Saturday
                    offset = -((dow + 1) % 7);
                }
                const start = new Date(selected);
                start.setDate(selected.getDate() + offset);
                const end = new Date(start);
                end.setDate(start.getDate() + 6);
                return { start: getLocalDateStr(start), end: getLocalDateStr(end) };
            }
            case "monthly": {
                const ms = new Date(selected.getFullYear(), selected.getMonth(), 1);
                const me = new Date(selected.getFullYear(), selected.getMonth() + 1, 0);
                return { start: getLocalDateStr(ms), end: getLocalDateStr(me) };
            }
            case "custom":
                return { start: customStartDate, end: customEndDate };
            case "all":
                return { start: "1970-01-01", end: "2099-12-31" };
            default:
                return { start: selectedDate, end: selectedDate };
        }
    };

    const getDaysInRange = () => {
        const range = getDateRange();
        const days: Date[] = [];
        const start = new Date(range.start + "T12:00:00");
        const end = new Date(range.end + "T12:00:00");
        if (viewMode === "all") {
            // For "all", just show current week
            const today = new Date();
            const dow = today.getDay();
            let offset = 0;
            if (weekStart === "monday") {
                offset = dow === 0 ? -6 : 1 - dow;
            } else if (weekStart === "sunday") {
                offset = -dow;
            } else {
                // Saturday
                offset = -((dow + 1) % 7);
            }
            const startDay = new Date(today);
            startDay.setDate(today.getDate() + offset);
            for (let i = 0; i < 7; i++) {
                const d = new Date(startDay);
                d.setDate(startDay.getDate() + i);
                days.push(d);
            }
            return days;
        }
        const current = new Date(start);
        while (current <= end) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        return days;
    };
    const last7Days = getDaysInRange();

    const changeDate = (delta: number) => {
        const d = new Date(selectedDate + "T12:00:00");
        if (viewMode === "daily") d.setDate(d.getDate() + delta);
        else if (viewMode === "weekly") d.setDate(d.getDate() + delta * 7);
        else if (viewMode === "monthly") d.setMonth(d.getMonth() + delta);
        setSelectedDate(getLocalDateStr(d));
    };

    // Stats
    const totalCompleted = habits.filter(isCompletedToday).length;
    const completionRate = habits.length > 0 ? Math.round((totalCompleted / habits.length) * 100) : 0;
    const bestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak_count), 0) : 0;

    // Set AI Page Context
    useEffect(() => {
        setPageContext(`User is on Habits Page. 
        Active Habits: ${habits.length}, Done Today: ${totalCompleted}/${habits.length}.
        Best Streak: ${bestStreak} days. Completion Rate: ${completionRate}%.
        Habits: ${habits.map(h => `${h.habit_name} (${h.streak_count}d streak)`).join(", ") || "None yet"}.`);
    }, [habits, totalCompleted, bestStreak, completionRate, setPageContext]);

    // Filtering & Sorting
    const filteredHabits = useMemo(() => {
        let result = [...habits];
        if (activeCategory !== "all") result = result.filter(h => h.category === activeCategory);
        if (searchTerm) result = result.filter(h => h.habit_name.toLowerCase().includes(searchTerm.toLowerCase()));
        switch (sortBy) {
            case "streak":
                return result.sort((a, b) => b.streak_count - a.streak_count);
            case "name":
                return result.sort((a, b) => a.habit_name.localeCompare(b.habit_name));
            case "category":
                return result.sort((a, b) => a.category.localeCompare(b.category));
            default:
                return result.sort((a, b) => {
                    const aToday = isCompletedToday(a);
                    const bToday = isCompletedToday(b);
                    if (aToday !== bToday) return aToday ? 1 : -1;
                    return b.streak_count - a.streak_count;
                });
        }
    }, [habits, activeCategory, searchTerm, sortBy]);

    // Weekly heatmap: aggregate completion per day
    const weeklyHeatmap = useMemo(() => {
        return last7Days.map(date => {
            const completed = habits.filter(h => isCompletedOnDate(h, date)).length;
            const isToday = date.toDateString() === new Date().toDateString();
            return { date, completed, total: habits.length, isToday };
        });
    }, [habits, last7Days]);

    const handleAddHabit = async () => {
        if (!newHabit.name.trim()) return;
        await addHabit.mutateAsync({ name: newHabit.name, category: newHabit.category });
        setNewHabit({ name: "", category: "general" });
        setIsDialogOpen(false);
    };

    const handleEditHabit = async () => {
        if (!editingHabit) return;
        await updateHabit.mutateAsync({
            id: editingHabit.id,
            name: editingHabit.habit_name,
            category: editingHabit.category,
        });
        setEditingHabit(null);
    };

    const handleGetTips = async (habit: Habit) => {
        setLoadingTips(true);
        setAiTipsFor(habit.habit_name);
        try {
            const tips = await getHabitTips(habit.habit_name, habit.streak_count);
            setAiTips(tips);
        } catch {
            setAiTips("Failed to get tips. Please try again.");
        }
        setLoadingTips(false);
    };

    const handleGetCoaching = async () => {
        setLoadingCoaching(true);
        try {
            const habitData = habits.map(h => ({
                name: h.habit_name,
                streak: h.streak_count,
                completedToday: isCompletedToday(h),
            }));
            const result = await getHabitCoaching(habitData);
            setCoaching(result);
        } catch {
            setCoaching("Failed to get coaching. Please try again.");
        }
        setLoadingCoaching(false);
    };

    const handleToggleDate = (habit: Habit, date: Date) => {
        // Prevent toggling future dates
        if (date > new Date()) return;
        completeHabit.mutate({ habit, date: getLocalDateStr(date) });
    };

    const getCategoryEmoji = (cat: string) => HABIT_CATEGORIES.find(c => c.value === cat)?.emoji || "📌";

    return (
        <AppLayout>
            <SEO title="Habit Tracker" description="Build lasting habits with streak tracking, AI coaching, and visual progress." />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 sm:space-y-6">

                {/* ===== SINGLE-ROW CONTROLS ===== */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="hidden md:block">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                                <Flame className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold font-display tracking-tight">Habits</h1>
                        </div>
                        <p className="text-sm text-muted-foreground ml-14">Build lasting habits with streaks</p>
                    </div>

                    <div className="top-toolbar sm:w-auto flex items-center gap-2 flex-nowrap overflow-x-auto no-scrollbar rounded-2xl border border-violet-500 bg-background/40 backdrop-blur-xl p-1.5 shadow-sm">
                        {/* Filter Menu */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl border border-amber-400/50 bg-amber-400/10 text-amber-500 hover:bg-amber-400/20 hover:text-amber-600 hover:border-amber-400 transition-all shadow-sm shrink-0">
                                    <SlidersHorizontal className="w-4 h-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-4" align="start">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                                            <Filter className="w-3.5 h-3.5" />
                                            Category
                                        </h4>
                                        <Select value={activeCategory} onValueChange={setActiveCategory}>
                                            <SelectTrigger className="w-full h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                {HABIT_CATEGORIES.map(c => (
                                                    <SelectItem key={c.value} value={c.value}>{c.emoji} {c.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                                            <CalendarIcon className="w-3.5 h-3.5" />
                                            View Period
                                        </h4>
                                        <Select value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
                                            <SelectTrigger className="w-full h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="daily">Daily</SelectItem>
                                                <SelectItem value="weekly">Weekly</SelectItem>
                                                <SelectItem value="monthly">Monthly</SelectItem>
                                                <SelectItem value="custom">Custom</SelectItem>
                                                <SelectItem value="all">All Time</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {viewMode === "weekly" && (
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                                                <CalendarIcon className="w-3.5 h-3.5" />
                                                Start Week On
                                            </h4>
                                            <Select value={weekStart} onValueChange={(v) => setWeekStart(v as "monday" | "sunday" | "saturday")}>
                                                <SelectTrigger className="w-full h-8 text-xs" title="Start of Week">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="saturday">Sat</SelectItem>
                                                    <SelectItem value="sunday">Sun</SelectItem>
                                                    <SelectItem value="monday">Mon</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                                            <ArrowUpDown className="w-3.5 h-3.5" />
                                            Sort By
                                        </h4>
                                        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                                            <SelectTrigger className="w-full h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="default">Default</SelectItem>
                                                <SelectItem value="streak">🔥 Streak</SelectItem>
                                                <SelectItem value="name">🔤 Name</SelectItem>
                                                <SelectItem value="category">📂 Category</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Divider */}
                        <div className="h-4 w-px bg-border/40 mx-1" />

                        {/* Date Controls - Compact */}
                        <div className="flex items-center gap-1 bg-secondary/20 p-0.5 rounded-xl border border-indigo-500/30">
                            <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-background/80 hover:shadow-sm" onClick={() => changeDate(-1)}>
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </Button>

                            {/* Center Date Display */}
                            {viewMode === "daily" && (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="text-xs font-medium px-2 h-7 rounded-md hover:bg-background/50 transition-colors whitespace-nowrap">
                                            {formatDate(new Date(selectedDate + "T12:00:00"), "monthDay")}
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="center">
                                        <Calendar
                                            mode="single"
                                            selected={new Date(selectedDate + "T12:00:00")}
                                            onSelect={(date) => date && setSelectedDate(getLocalDateStr(date))}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            )}

                            {viewMode === "weekly" && (
                                <span className="text-xs font-medium px-2 h-7 flex items-center whitespace-nowrap">
                                    {(() => {
                                        const range = getDateRange();
                                        const start = new Date(range.start + "T12:00:00");
                                        const end = new Date(range.end + "T12:00:00");
                                        return `${formatDate(start, "short")} - ${formatDate(end, "short")}`;
                                    })()}
                                </span>
                            )}

                            {viewMode === "monthly" && (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="text-xs font-medium px-2 h-7 rounded-md hover:bg-background/50 transition-colors whitespace-nowrap">
                                            {formatDate(new Date(selectedDate + "T12:00:00"), "monthYear")}
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="center">
                                        <Calendar
                                            mode="single"
                                            selected={new Date(selectedDate + "T12:00:00")}
                                            onSelect={(date) => date && setSelectedDate(getLocalDateStr(date))}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            )}

                            {viewMode === "custom" && (
                                <div className="flex items-center gap-0.5">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button className="text-xs font-medium px-2 h-7 rounded-md bg-background/50 border border-border/50 hover:bg-background/80 transition-colors whitespace-nowrap flex items-center gap-1">
                                                <CalendarIcon className="w-3 h-3 opacity-70" />
                                                {formatDate(new Date(customStartDate + "T12:00:00"), "short")}
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="center">
                                            <Calendar
                                                mode="single"
                                                selected={new Date(customStartDate + "T12:00:00")}
                                                onSelect={(date) => date && setCustomStartDate(getLocalDateStr(date))}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <span className="text-[10px] text-muted-foreground">-</span>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button className="text-xs font-medium px-2 h-7 rounded-md bg-background/50 border border-border/50 hover:bg-background/80 transition-colors whitespace-nowrap flex items-center gap-1">
                                                <CalendarIcon className="w-3 h-3 opacity-70" />
                                                {formatDate(new Date(customEndDate + "T12:00:00"), "short")}
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="center">
                                            <Calendar
                                                mode="single"
                                                selected={new Date(customEndDate + "T12:00:00")}
                                                onSelect={(date) => date && setCustomEndDate(getLocalDateStr(date))}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            )}

                            {viewMode === "all" && (
                                <span className="text-xs font-medium px-2 h-7 flex items-center whitespace-nowrap">All Time</span>
                            )}

                            <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-background/80 hover:shadow-sm" onClick={() => changeDate(1)}>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Button>
                        </div>

                        <div className="flex-1" />




                        {/* Actions */}
                        <div className="flex items-center gap-1">
                            {/* Add Habit */}
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="hidden md:flex h-8 px-3 gap-1.5 shadow-md shadow-primary/20 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
                                        <Plus className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline font-medium">New</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="w-[95vw] max-w-md rounded-2xl sm:rounded-xl">
                                    <DialogHeader><DialogTitle>Create New Habit</DialogTitle></DialogHeader>
                                    <div className="space-y-4 pt-4">
                                        <Input
                                            placeholder="Habit name (e.g., Exercise, Read, Meditate)"
                                            value={newHabit.name}
                                            onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                                            onKeyDown={(e) => e.key === "Enter" && handleAddHabit()}
                                        />
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground mb-2 block">Category</label>
                                            <div className="flex flex-wrap gap-2">
                                                {HABIT_CATEGORIES.map(c => (
                                                    <button
                                                        key={c.value}
                                                        onClick={() => setNewHabit({ ...newHabit, category: c.value })}
                                                        className={cn(
                                                            "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                                                            newHabit.category === c.value
                                                                ? "bg-primary text-primary-foreground border-primary"
                                                                : "bg-secondary/50 border-border hover:border-primary/30"
                                                        )}
                                                    >
                                                        {c.emoji} {c.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <Button onClick={handleAddHabit} className="w-full" disabled={addHabit.isPending}>
                                            {addHabit.isPending ? "Creating..." : "Create Habit"}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>

                {/* Spacer for fixed toolbar on mobile */}
                <div className="h-8 md:hidden" aria-hidden="true" />

                {/* ===== STATS GRID ===== */}
                <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
                    {[
                        { icon: Zap, label: "Active", value: habits.length, color: "text-blue-400", bg: "from-blue-500/15 to-blue-500/5" },
                        { icon: Check, label: "Today", value: totalCompleted, color: "text-green-400", bg: "from-green-500/15 to-green-500/5" },
                        { icon: Flame, label: "Best", value: `${bestStreak}d`, color: "text-orange-400", bg: "from-orange-500/15 to-orange-500/5" },
                        { icon: TrendingUp, label: "Rate", value: `${completionRate}%`, color: "text-violet-400", bg: "from-violet-500/15 to-violet-500/5" },
                    ].map((stat) => (
                        <div key={stat.label} className={`glass-card p-2 sm:p-3 bg-gradient-to-br ${stat.bg} border border-white/5`}>
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className={`p-1.5 sm:p-2 rounded-lg bg-background/50 ${stat.color}`}>
                                    <stat.icon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm sm:text-lg font-bold">{stat.value}</p>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ===== WEEKLY HEATMAP ===== */}
                <div className="glass-card p-4 sm:p-5 overflow-hidden relative">
                    {/* Subtle background decoration */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-2xl pointer-events-none" />

                    <div className="flex items-center justify-between mb-4 sm:mb-5 relative z-10">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-emerald-400 to-cyan-400" />
                            <p className="text-sm sm:text-base font-semibold">
                                {viewMode === "daily" ? "Today" : viewMode === "weekly" ? "This Week" : viewMode === "monthly" ? "This Month" : viewMode === "custom" ? "Custom Range" : "All Time"}
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/50 border border-border/50">
                            <div className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                totalCompleted === habits.length && habits.length > 0 ? "bg-emerald-400" : "bg-amber-400"
                            )} />
                            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                                <span className="text-foreground font-semibold">{totalCompleted}</span>/{habits.length} today
                            </p>
                        </div>
                    </div>

                    <div className={cn(
                        "relative z-10",
                        viewMode === "daily" ? "flex justify-center" :
                            viewMode === "weekly" || viewMode === "all" ? "grid grid-cols-7 gap-2 sm:gap-3" :
                                "grid grid-cols-7 gap-1.5 sm:gap-2"
                    )}>
                        {weeklyHeatmap.map((day, i) => {
                            const pct = day.total > 0 ? (day.completed / day.total) * 100 : 0;
                            const isMonthly = viewMode === "monthly" || viewMode === "custom";
                            const radius = 20;
                            const circumference = 2 * Math.PI * radius;
                            const strokeDashoffset = circumference - (pct / 100) * circumference;
                            const dayLabel = day.date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2);
                            const isFuture = day.date > new Date() && !day.isToday;

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(i * (isMonthly ? 0.02 : 0.06), 0.6), duration: 0.3, ease: "easeOut" }}
                                    className="flex flex-col items-center gap-1 sm:gap-1.5"
                                >
                                    {/* Day label — show weekday name only for weekly/daily/all */}
                                    {!isMonthly && (
                                        <span className={cn(
                                            "text-[9px] sm:text-[11px] font-semibold uppercase tracking-wider",
                                            day.isToday ? "text-primary" : "text-muted-foreground/70"
                                        )}>
                                            {dayLabel}
                                        </span>
                                    )}

                                    {/* Circular progress ring */}
                                    <div className={cn(
                                        "relative flex items-center justify-center rounded-full transition-all duration-500",
                                        isMonthly ? "w-8 h-8 sm:w-10 sm:h-10" : "w-10 h-10 sm:w-14 sm:h-14",
                                        day.isToday && "ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
                                    )}>
                                        {/* SVG Ring */}
                                        <svg
                                            className="absolute inset-0 w-full h-full -rotate-90"
                                            viewBox="0 0 48 48"
                                        >
                                            {/* Background track */}
                                            <circle
                                                cx="24" cy="24" r={radius}
                                                fill="none"
                                                stroke="hsl(var(--border))"
                                                strokeWidth="3"
                                                opacity={isFuture ? 0.3 : 0.5}
                                            />
                                            {/* Progress arc */}
                                            {pct > 0 && (
                                                <motion.circle
                                                    cx="24" cy="24" r={radius}
                                                    fill="none"
                                                    stroke={pct >= 100 ? "url(#weekGradientFull)" : pct >= 50 ? "url(#weekGradientHalf)" : "url(#weekGradientLow)"}
                                                    strokeWidth="3.5"
                                                    strokeLinecap="round"
                                                    strokeDasharray={circumference}
                                                    initial={{ strokeDashoffset: circumference }}
                                                    animate={{ strokeDashoffset }}
                                                    transition={{ delay: 0.3 + i * 0.08, duration: 0.8, ease: "easeOut" }}
                                                />
                                            )}
                                            {/* Gradient definitions */}
                                            <defs>
                                                <linearGradient id="weekGradientFull" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#34d399" />
                                                    <stop offset="100%" stopColor="#22d3ee" />
                                                </linearGradient>
                                                <linearGradient id="weekGradientHalf" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#4ade80" />
                                                    <stop offset="100%" stopColor="#34d399" />
                                                </linearGradient>
                                                <linearGradient id="weekGradientLow" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#fbbf24" />
                                                    <stop offset="100%" stopColor="#f59e0b" />
                                                </linearGradient>
                                            </defs>
                                        </svg>

                                        <div className={cn(
                                            "relative z-10 flex flex-col items-center justify-center rounded-full transition-all duration-300",
                                            isMonthly ? "w-5.5 h-5.5 sm:w-7 sm:h-7" : "w-7 h-7 sm:w-10 sm:h-10",
                                            pct >= 100 ? "bg-emerald-500/15" :
                                                day.isToday ? "bg-primary/10" :
                                                    isFuture ? "bg-secondary/20" : "bg-secondary/30"
                                        )}>
                                            <span className={cn(
                                                isMonthly ? "text-[9px] sm:text-[11px]" : "text-[11px] sm:text-sm",
                                                "font-bold leading-none",
                                                pct >= 100 ? "text-emerald-400" :
                                                    pct > 0 ? "text-foreground" :
                                                        day.isToday ? "text-primary" :
                                                            isFuture ? "text-muted-foreground/40" : "text-muted-foreground/70"
                                            )}>
                                                {day.date.getDate()}
                                            </span>
                                        </div>

                                        {/* Completed checkmark overlay */}
                                        {pct >= 100 && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.6 + i * 0.08, type: "spring", stiffness: 300 }}
                                                className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/30"
                                            >
                                                <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white stroke-[3px]" />
                                            </motion.div>
                                        )}

                                        {/* Today indicator dot */}
                                        {day.isToday && pct < 100 && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary"
                                            />
                                        )}
                                    </div>

                                    {/* Completion fraction — hide in monthly to save space */}
                                    {!isMonthly && (
                                        <span className={cn(
                                            "text-[8px] sm:text-[10px] font-medium tabular-nums",
                                            pct >= 100 ? "text-emerald-400" :
                                                pct > 0 ? "text-muted-foreground" :
                                                    "text-muted-foreground/40"
                                        )}>
                                            {day.completed}/{day.total}
                                        </span>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Weekly summary bar */}
                    {habits.length > 0 && (
                        <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-border/50 relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] sm:text-xs text-muted-foreground">
                                    {viewMode === "daily" ? "Daily" : viewMode === "weekly" ? "Weekly" : viewMode === "monthly" ? "Monthly" : viewMode === "custom" ? "Range" : "Overall"} Progress
                                </span>
                                <span className="text-[10px] sm:text-xs font-semibold text-foreground">
                                    {Math.round(weeklyHeatmap.reduce((acc, d) => acc + (d.total > 0 ? d.completed / d.total : 0), 0) / weeklyHeatmap.filter(d => d.date <= new Date()).length * 100) || 0}%
                                </span>
                            </div>
                            <div className="relative h-1.5 sm:h-2 w-full rounded-full bg-secondary/50 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: `${Math.round(weeklyHeatmap.reduce((acc, d) => acc + (d.total > 0 ? d.completed / d.total : 0), 0) / weeklyHeatmap.filter(d => d.date <= new Date()).length * 100) || 0}%`
                                    }}
                                    transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                                    className="absolute inset-y-0 left-0 rounded-full"
                                    style={{
                                        background: "linear-gradient(90deg, #34d399, #22d3ee)"
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* ===== AI COACHING ===== */}
                <AnimatePresence>
                    {coaching && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            className="glass-card p-4 border border-violet-500/20 bg-gradient-to-r from-violet-500/5 to-transparent"
                        >
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-violet-500/10"><Brain className="w-5 h-5 text-violet-400" /></div>
                                <div className="flex-1">
                                    <h3 className="font-semibold mb-1 text-violet-300">AI Coach</h3>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{coaching}</p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setCoaching(null)} className="text-muted-foreground hover:text-foreground">×</Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ===== AI TIPS (per-habit) ===== */}
                <AnimatePresence>
                    {aiTips && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            className="glass-card p-4 border border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 to-transparent"
                        >
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-yellow-500/10"><Lightbulb className="w-5 h-5 text-yellow-400" /></div>
                                <div className="flex-1">
                                    <h3 className="font-semibold mb-1 text-yellow-300">Tips — {aiTipsFor}</h3>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{aiTips}</p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setAiTips(null)} className="text-muted-foreground hover:text-foreground">×</Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ===== HABIT LIST ===== */}
                <div className="space-y-2 sm:space-y-3">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-pulse flex flex-col items-center gap-3">
                                <Target className="w-10 h-10 opacity-50" />
                                <span className="text-muted-foreground">Loading habits...</span>
                            </div>
                        </div>
                    ) : filteredHabits.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                            <div className="flex flex-col items-center gap-4">
                                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                    <Target className="w-12 h-12 text-emerald-400 opacity-60" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">
                                        {searchTerm || activeCategory !== "all" ? "No habits match your filter" : "Start Building Habits"}
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        {searchTerm || activeCategory !== "all"
                                            ? "Try a different search or category"
                                            : "Create your first habit to begin your streak!"}
                                    </p>
                                </div>
                                {!searchTerm && activeCategory === "all" && (
                                    <Button onClick={() => setIsDialogOpen(true)} className="gap-2 mt-2">
                                        <Plus className="w-4 h-4" /> Create First Habit
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        filteredHabits.map((habit, index) => {
                            const completed = isCompletedToday(habit);
                            return (
                                <motion.div
                                    key={habit.id}
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.04 }}
                                    className={cn(
                                        "glass-card p-3 sm:p-4 transition-all group",
                                        completed ? "border-green-500/20 bg-gradient-to-r from-green-500/5 to-transparent" : "hover:border-primary/20"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Completion Button */}
                                        <button
                                            onClick={() => !completed && completeHabit.mutate({ habit })}
                                            disabled={completed}
                                            className={cn(
                                                "w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all shadow-sm shrink-0",
                                                completed
                                                    ? "bg-green-500 text-white shadow-green-500/30"
                                                    : "bg-secondary hover:bg-primary/10 hover:ring-2 hover:ring-primary/20 text-muted-foreground hover:text-primary"
                                            )}
                                        >
                                            <Check className={cn("w-5 h-5", completed ? "stroke-[3px]" : "")} />
                                        </button>

                                        {/* Habit Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h3 className={cn("font-semibold text-sm sm:text-base truncate", completed && "text-green-400")}>{habit.habit_name}</h3>
                                                <Badge variant="secondary" className="text-[9px] px-1.5 py-0 shrink-0">
                                                    {getCategoryEmoji(habit.category)} {habit.category}
                                                </Badge>
                                                {completed && (
                                                    <Badge variant="outline" className="text-[9px] px-1 py-0 border-green-500/30 text-green-400 shrink-0">
                                                        <Sparkles className="w-2.5 h-2.5 mr-0.5" />Done
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <StreakFlame streak={habit.streak_count} size="sm" />
                                                    <span className={cn(habit.streak_count > 0 && "text-orange-400 font-medium")}>
                                                        {habit.streak_count}d
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 7-day mini dots */}
                                        <div className="hidden sm:flex gap-1 items-center shrink-0">
                                            {last7Days.map((date, i) => {
                                                const isDone = isCompletedOnDate(habit, date);
                                                const isToday = date.toDateString() === new Date().toDateString();
                                                return (
                                                    <div
                                                        key={i}
                                                        onClick={() => handleToggleDate(habit, date)}
                                                        className={cn(
                                                            "w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-medium border transition-all cursor-pointer hover:scale-110 active:scale-95",
                                                            isDone ? "bg-green-500/80 border-green-500 text-white" :
                                                                isToday ? "border-primary/50 bg-primary/10 text-foreground" :
                                                                    "border-border bg-secondary/30 text-muted-foreground hover:bg-secondary hover:border-primary/30"
                                                        )}
                                                        title={date.toDateString()}
                                                    >
                                                        {date.getDate()}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-0.5 shrink-0">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleGetTips(habit)} disabled={loadingTips}>
                                                        <Lightbulb className="mr-2 h-4 w-4 text-yellow-500" /> AI Tips
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setEditingHabit({ ...habit })}>
                                                        <Edit2 className="mr-2 h-4 w-4" /> Edit Habit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteHabit.mutate(habit.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete Habit
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* ===== EDIT HABIT DIALOG ===== */}
                <Dialog open={!!editingHabit} onOpenChange={(open) => !open && setEditingHabit(null)}>
                    <DialogContent className="w-[95vw] max-w-md rounded-2xl sm:rounded-xl">
                        <DialogHeader><DialogTitle>Edit Habit</DialogTitle></DialogHeader>
                        {editingHabit && (
                            <div className="space-y-4 pt-4">
                                <Input
                                    placeholder="Habit name"
                                    value={editingHabit.habit_name}
                                    onChange={(e) => setEditingHabit({ ...editingHabit, habit_name: e.target.value })}
                                />
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Category</label>
                                    <div className="flex flex-wrap gap-2">
                                        {HABIT_CATEGORIES.map(c => (
                                            <button
                                                key={c.value}
                                                onClick={() => setEditingHabit({ ...editingHabit, category: c.value })}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                                                    editingHabit.category === c.value
                                                        ? "bg-primary text-primary-foreground border-primary"
                                                        : "bg-secondary/50 border-border hover:border-primary/30"
                                                )}
                                            >
                                                {c.emoji} {c.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <Button onClick={handleEditHabit} className="w-full" disabled={updateHabit.isPending}>
                                    {updateHabit.isPending ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Mobile Floating Action Button (FAB) - Bottom Left */}
                <div className="md:hidden fixed bottom-20 left-6 z-50">
                    <Button
                        size="icon"
                        className="h-14 w-14 rounded-full shadow-lg shadow-primary/30 bg-primary hover:bg-primary/90"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <Plus className="w-6 h-6 text-primary-foreground" />
                    </Button>
                </div>

            </motion.div>
        </AppLayout >
    );
}
