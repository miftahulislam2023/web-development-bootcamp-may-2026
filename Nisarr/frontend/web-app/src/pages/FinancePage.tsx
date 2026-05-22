import { useState, useMemo } from "react";
import { SEO } from "@/components/seo/SEO";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Wallet, TrendingUp, TrendingDown, Trash2, ChevronLeft, ChevronRight, Clock, X, Calendar as CalendarIcon, Pencil, PiggyBank, Target, Download, Star, ListFilter, PieChart as PieChartIcon, BarChart3 as BarChartIcon, History, CalendarX, Archive, Zap, MoreVertical, Settings2, Filter, CalendarDays, ArrowRightLeft, Check, SlidersHorizontal } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useFinance, FinanceEntry } from "@/hooks/useFinance";
import { useBudget, SavingsTransaction } from "@/hooks/useBudget";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CATEGORIES = ["Food", "Transport", "Entertainment", "Bills", "Shopping", "Freelance", "Salary", "Other"];
const COLORS = ["#EF4444", "#F87171", "#DC2626", "#FB7185", "#E11D48", "#F43F5E", "#BE123C", "#9F1239"];

export default function FinancePage() {
    const { entries, regularEntries, specialEntries, isLoading, addEntry, deleteEntry, updateEntry, totalSpecialIncome, totalSpecialExpenses, specialBalance } = useFinance();
    const { budgets, savingsGoals, budgetGoals, totalSavings, budgetRemaining, primaryBudget, getBudgetRemaining, addBudget, updateBudget, addToSavings, deleteBudget, savingsTransactions, deleteSavingsTransaction, updateSavingsTransaction, specialSavingsGoals, specialBudgetGoals, totalSpecialSavings } = useBudget();

    // Finance view mode: 'default' or 'special'
    const [financeViewMode, setFinanceViewMode] = useState<"default" | "special">("default");
    // In special view: whether to also count special entries in default budget
    const [countInDefault, setCountInDefault] = useState(false);

    // Derived goals based on view mode
    const currentBudgetGoals = financeViewMode === "default" ? budgetGoals : specialBudgetGoals;
    const currentSavingsGoals = financeViewMode === "default" ? savingsGoals : specialSavingsGoals;
    const allGoals = useMemo(() => [...(currentBudgetGoals || []), ...(currentSavingsGoals || [])], [currentBudgetGoals, currentSavingsGoals]);

    // Time-based goal categorization
    const getGoalTimeStatus = (item: any): "active" | "upcoming" | "archive" => {
        if (item.type !== "budget" || !item.start_date || !item.period) return "active";
        const now = new Date();
        const [year, month] = item.start_date.split('-').map(Number);
        let startDate: Date;
        let endDate: Date;
        switch (item.period) {
            case "weekly":
                startDate = new Date(year, month - 1, parseInt(item.start_date.split('-')[2] || '1'));
                endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 6);
                break;
            case "monthly":
                startDate = new Date(year, month - 1, 1);
                endDate = new Date(year, month, 0, 23, 59, 59);
                break;
            case "yearly":
                startDate = new Date(year, 0, 1);
                endDate = new Date(year, 11, 31, 23, 59, 59);
                break;
            default:
                return "active";
        }
        if (now < startDate) return "upcoming";
        if (now > endDate) return "archive";
        return "active";
    };

    const [goalsFilter, setGoalsFilter] = useState<"active" | "upcoming" | "archive">("active");
    const filteredGoals = useMemo(() => allGoals.filter(g => getGoalTimeStatus(g) === goalsFilter), [allGoals, goalsFilter]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isSavingsHistoryOpen, setIsSavingsHistoryOpen] = useState(false);
    const [historyType, setHistoryType] = useState<"all" | "income" | "expense">("all");
    const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);

    const [editingGoal, setEditingGoal] = useState<{ id: string; name: string; target_amount: string; type: "budget" | "savings" } | null>(null);
    const [newBudget, setNewBudget] = useState<{
        name: string;
        type: "budget" | "savings";
        target_amount: string;
        period: "monthly" | "weekly" | "yearly" | null;
        category: string;
        start_month: number;
        start_year: number;
    }>({
        name: "",
        type: "budget",
        target_amount: "",
        period: "monthly",
        category: "",
        start_month: new Date().getMonth() + 1,
        start_year: new Date().getFullYear(),
    });
    const [savingsAmount, setSavingsAmount] = useState<string>("");
    const [goalsSortBy, setGoalsSortBy] = useState<"date" | "amount">("date");

    // Helper to get local date string from Date object (MUST be defined before useState calls)
    const getLocalDateStr = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    // View mode: daily, weekly, monthly, yearly, custom, all
    type ViewMode = "daily" | "weekly" | "monthly" | "yearly" | "custom" | "all";
    const [viewMode, setViewMode] = useState<ViewMode>("daily");
    // Week start day preference (0=Sun, 1=Mon, 6=Sat)
    const [weekStartDay, setWeekStartDay] = useState(6);

    // Date states - use local date, not UTC
    const [selectedDate, setSelectedDate] = useState(() => getLocalDateStr(new Date()));
    const [customStartDate, setCustomStartDate] = useState(() => getLocalDateStr(new Date()));
    const [customEndDate, setCustomEndDate] = useState(() => getLocalDateStr(new Date()));

    // Edit state
    const [editingEntry, setEditingEntry] = useState<{
        id: string;
        type: "income" | "expense";
        amount: string;
        category: string;
        description: string;
        date: string;
    } | null>(null);
    const [editingSavingsTransaction, setEditingSavingsTransaction] = useState<SavingsTransaction | null>(null);

    const [newEntry, setNewEntry] = useState<{
        type: "income" | "expense";
        amount: string;
        category: string;
        description: string;
        date: string;
        source: string; // "budget" or savings ID
        is_special: boolean;
    }>(() => ({
        type: "expense",
        amount: "",
        category: "",
        description: "",
        date: getLocalDateStr(new Date()),
        source: "budget",
        is_special: false,
    }));

    // Note: getLocalDateStr is defined above useState calls

    // Calculate date range based on view mode
    const getDateRange = () => {
        const today = new Date();
        const selected = new Date(selectedDate + "T12:00:00");

        switch (viewMode) {
            case "daily":
                return { start: selectedDate, end: selectedDate };
            case "weekly": {
                const dayOfWeek = selected.getDay();
                // Start week based on weekStartDay preference
                const daysFromStart = (dayOfWeek - weekStartDay + 7) % 7;
                const weekStart = new Date(selected);
                weekStart.setDate(selected.getDate() - daysFromStart);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);
                return { start: getLocalDateStr(weekStart), end: getLocalDateStr(weekEnd) };
            }
            case "monthly": {
                const monthStart = new Date(selected.getFullYear(), selected.getMonth(), 1);
                const monthEnd = new Date(selected.getFullYear(), selected.getMonth() + 1, 0);
                return { start: getLocalDateStr(monthStart), end: getLocalDateStr(monthEnd) };
            }
            case "yearly": {
                const yearStart = new Date(selected.getFullYear(), 0, 1);
                const yearEnd = new Date(selected.getFullYear(), 11, 31);
                return { start: getLocalDateStr(yearStart), end: getLocalDateStr(yearEnd) };
            }
            case "custom":
                return { start: customStartDate, end: customEndDate };
            case "all":
                return { start: "1970-01-01", end: "2099-12-31" };
            default:
                return { start: selectedDate, end: selectedDate };
        }
    };

    // Filter entries by date range based on current view mode
    const filteredEntries = useMemo(() => {
        const range = getDateRange();
        // In default mode, show regular entries; in special mode, show special entries
        const entriesToFilter = financeViewMode === "default" ? regularEntries : specialEntries;
        return entriesToFilter.filter(e => {
            if (!e.date) return false;
            const entryDate = new Date(e.date);
            const localDateStr = getLocalDateStr(entryDate);
            return localDateStr >= range.start && localDateStr <= range.end;
        });
    }, [regularEntries, specialEntries, financeViewMode, selectedDate, viewMode, customStartDate, customEndDate]);

    // Calculate stats for filtered entries
    const expenses = filteredEntries.filter((e) => e.type === "expense");
    const incomes = filteredEntries.filter((e) => e.type === "income");
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = incomes.reduce((sum, e) => sum + e.amount, 0);
    // Balance = Income - Expenses (not subtracting savings, as savings are tracked separately)
    const balance = totalIncome - totalExpenses;

    const EXPENSE_CATEGORIES = ["Food", "Transport", "Rent", "Bills", "Shopping", "Entertainment", "Health", "Education", "Other"];
    const INCOME_CATEGORIES = ["Salary", "Freelance", "Business", "Gift", "Investment", "Other"];

    const [customCategory, setCustomCategory] = useState("");

    const expensesByCategory = expenses.reduce(
        (acc, e) => {
            acc[e.category] = (acc[e.category] || 0) + e.amount;
            return acc;
        },
        {} as Record<string, number>
    );

    const incomesByCategory = incomes.reduce(
        (acc, e) => {
            acc[e.category] = (acc[e.category] || 0) + e.amount;
            return acc;
        },
        {} as Record<string, number>
    );

    // Colors for income (green shades) and expenses (red shades)
    const INCOME_COLORS = ["#10B981", "#34D399", "#059669", "#6EE7B7", "#047857", "#A7F3D0"];
    const EXPENSE_COLORS = ["#EF4444", "#F87171", "#DC2626", "#FB7185", "#E11D48", "#F43F5E"];

    const chartData = [
        ...Object.entries(incomesByCategory).map(([name, value], i) => ({
            name: `${name} (Income)`,
            value,
            color: INCOME_COLORS[i % INCOME_COLORS.length],
        })),
        ...Object.entries(expensesByCategory).map(([name, value], i) => ({
            name: `${name} (Expense)`,
            value,
            color: EXPENSE_COLORS[i % EXPENSE_COLORS.length],
        })),
    ];

    const handleAddEntry = async () => {
        if (!newEntry.amount || !newEntry.category) return;

        // Add the finance entry - is_special based on current view mode
        await addEntry.mutateAsync({
            type: newEntry.type,
            amount: parseFloat(newEntry.amount),
            category: newEntry.category,
            description: newEntry.description,
            date: newEntry.date,
            is_special: financeViewMode === "special",
        });

        // If expense is from a savings goal, deduct from it
        if (newEntry.type === "expense" && newEntry.source && newEntry.source !== "budget") {
            const savings = savingsGoals?.find(s => s.id === newEntry.source);
            if (savings) {
                // Deduct by adding negative amount (or use a separate mutation if available)
                await addToSavings.mutateAsync({
                    id: newEntry.source,
                    amount: -parseFloat(newEntry.amount) // Negative to deduct
                });
            }
        }

        // If income is going to a savings goal, add to it
        if (newEntry.type === "income" && newEntry.source && newEntry.source !== "budget") {
            const savings = savingsGoals?.find(s => s.id === newEntry.source);
            if (savings) {
                await addToSavings.mutateAsync({
                    id: newEntry.source,
                    amount: parseFloat(newEntry.amount) // Positive to add
                });
            }
        }

        setNewEntry({
            type: "expense",
            amount: "",
            category: "",
            description: "",
            date: getLocalDateStr(new Date()),
            source: "budget",
            is_special: false,
        });
        setIsDialogOpen(false);
    };

    // PDF Export function
    const generatePDF = (title: string, data: FinanceEntry[] | SavingsTransaction[], type: "finance" | "savings") => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header
        doc.setFontSize(20);
        doc.setTextColor(79, 70, 229); // Primary color
        doc.text(title, pageWidth / 2, 20, { align: "center" });

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated: ${format(new Date(), "PPP p")}`, pageWidth / 2, 28, { align: "center" });

        if (type === "finance") {
            const financeData = data as FinanceEntry[];
            const tableData = financeData.map(entry => [
                format(new Date(entry.date), "MMM dd, yyyy"),
                entry.type.charAt(0).toUpperCase() + entry.type.slice(1),
                entry.category,
                entry.description || "-",
                `${entry.type === "income" ? "+" : "-"}৳${entry.amount.toLocaleString()}`,
                entry.is_special ? "Yes" : "No"
            ]);

            const totalIncome = financeData.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
            const totalExpense = financeData.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);

            autoTable(doc, {
                startY: 35,
                head: [["Date", "Type", "Category", "Description", "Amount", "Special"]],
                body: tableData,
                foot: [["", "", "", "Total Income:", `+৳${totalIncome.toLocaleString()}`, ""], ["", "", "", "Total Expense:", `-৳${totalExpense.toLocaleString()}`, ""], ["", "", "", "Balance:", `৳${(totalIncome - totalExpense).toLocaleString()}`, ""]],
                theme: "striped",
                headStyles: { fillColor: [79, 70, 229] },
                footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold" },
            });
        } else {
            const savingsData = data as SavingsTransaction[];
            const tableData = savingsData.map(tx => [
                format(new Date(tx.date), "MMM dd, yyyy"),
                tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
                tx.description || "-",
                `${tx.type === "deposit" ? "+" : "-"}৳${tx.amount.toLocaleString()}`
            ]);

            const totalDeposits = savingsData.filter(t => t.type === "deposit").reduce((s, t) => s + t.amount, 0);
            const totalWithdrawals = savingsData.filter(t => t.type === "withdraw").reduce((s, t) => s + t.amount, 0);

            autoTable(doc, {
                startY: 35,
                head: [["Date", "Type", "Description", "Amount"]],
                body: tableData,
                foot: [["", "", "Total Deposits:", `+৳${totalDeposits.toLocaleString()}`], ["", "", "Total Withdrawals:", `-৳${totalWithdrawals.toLocaleString()}`], ["", "", "Net:", `৳${(totalDeposits - totalWithdrawals).toLocaleString()}`]],
                theme: "striped",
                headStyles: { fillColor: [147, 51, 234] },
                footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold" },
            });
        }

        doc.save(`${title.toLowerCase().replace(/\s+/g, "_")}_${format(new Date(), "yyyy-MM-dd")}.pdf`);
    };

    // Calculate trend data for chart/grid (daily breakdown for weekly/monthly, grouped for yearly/all/custom)
    const trendData = useMemo(() => {
        const data: { day: string; income: number; expense: number }[] = [];

        if (viewMode === "daily") {
            // No trendData needed for daily view (uses pie chart)
            return data;
        }

        if (viewMode === "weekly" || viewMode === "monthly") {
            // Daily breakdown for weekly/monthly
            const range = getDateRange();
            const start = new Date(range.start + "T00:00:00");
            const end = new Date(range.end + "T23:59:59");

            const current = new Date(start);
            while (current <= end) {
                const dateStr = getLocalDateStr(current);
                const dayEntries = filteredEntries.filter(e => getLocalDateStr(new Date(e.date)) === dateStr);

                const dayIncome = dayEntries.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
                const dayExpense = dayEntries.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);

                const label = viewMode === "weekly"
                    ? format(current, "EEE")  // Sat, Sun, Mon...
                    : current.getDate().toString();  // 1, 2, 3...31

                data.push({ day: label, income: dayIncome, expense: dayExpense });
                current.setDate(current.getDate() + 1);
            }
        } else {
            // Group by month for yearly/all/custom (from actual entries, not date iteration)
            const monthlyData: { [key: string]: { income: number; expense: number } } = {};

            filteredEntries.forEach(entry => {
                const date = new Date(entry.date);
                const monthKey = format(date, "yyyy-MM");
                const monthLabel = format(date, "MMM yyyy");

                if (!monthlyData[monthKey]) {
                    monthlyData[monthKey] = { income: 0, expense: 0 };
                }

                if (entry.type === "income") {
                    monthlyData[monthKey].income += entry.amount;
                } else {
                    monthlyData[monthKey].expense += entry.amount;
                }
            });

            // Convert to array and sort by date
            Object.keys(monthlyData).sort().forEach(key => {
                const date = new Date(key + "-01");
                data.push({
                    day: format(date, "MMM yyyy"),
                    income: monthlyData[key].income,
                    expense: monthlyData[key].expense,
                });
            });
        }

        return data;
    }, [filteredEntries, viewMode, getDateRange, getLocalDateStr]);

    const changeDate = (days: number) => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + days);
        setSelectedDate(getLocalDateStr(d));
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr + "T00:00:00");
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today.getTime() + 86400000);
        const yesterday = new Date(today.getTime() - 86400000);

        const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());

        if (target.getTime() === today.getTime()) return "Today";
        if (target.getTime() === yesterday.getTime()) return "Yesterday";
        if (target.getTime() === tomorrow.getTime()) return "Tomorrow";
        return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    };

    const openHistory = (type: "all" | "income" | "expense") => {
        setHistoryType(type);
        setIsHistoryOpen(true);
    };

    // Get all entries for history view
    const historyEntries = useMemo(() => {
        let filtered = entries;
        if (historyType === "income") filtered = entries.filter(e => e.type === "income");
        if (historyType === "expense") filtered = entries.filter(e => e.type === "expense");
        return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [entries, historyType]);

    return (
        <AppLayout>
            <SEO title="Finance" description="Track your income, expenses, and budget." />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 sm:space-y-6"
            >
                {/* Mobile Floating Add Entry Button */}
                <div className="fixed bottom-20 right-4 z-50 md:hidden">
                    <Button
                        size="icon"
                        className="w-12 h-12 rounded-full shadow-lg shadow-primary/25 glow-primary bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <Plus className="w-6 h-6" />
                    </Button>
                </div>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="hidden md:block">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                                <Wallet className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold font-display tracking-tight">Finance</h1>
                        </div>
                        <p className="text-sm text-muted-foreground ml-14">Track your income and expenses</p>
                    </div>

                    {/* Compact Toolbar - Glassmorphic Design */}
                    <motion.div
                        className="top-toolbar sm:w-auto flex items-center gap-2 rounded-2xl border border-violet-500 bg-background/40 backdrop-blur-xl p-1.5 shadow-sm"
                        layout
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >

                        {/* Settings Menu */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl border border-amber-400/50 bg-amber-400/10 text-amber-500 hover:bg-amber-400/20 hover:text-amber-600 hover:border-amber-400 transition-all shadow-sm">
                                    <SlidersHorizontal className="w-4 h-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-4" align="start">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                                            <Filter className="w-3.5 h-3.5" />
                                            View Type
                                        </h4>
                                        <Select value={financeViewMode} onValueChange={(v) => setFinanceViewMode(v as typeof financeViewMode)}>
                                            <SelectTrigger className="w-full h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="default">Default</SelectItem>
                                                <SelectItem value="special">Special</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                                            <CalendarDays className="w-3.5 h-3.5" />
                                            Period
                                        </h4>
                                        <Select value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                                            <SelectTrigger className="w-full h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="daily">Daily</SelectItem>
                                                <SelectItem value="weekly">Weekly</SelectItem>
                                                <SelectItem value="monthly">Monthly</SelectItem>
                                                <SelectItem value="yearly">Yearly</SelectItem>
                                                <SelectItem value="custom">Custom Range</SelectItem>
                                                <SelectItem value="all">All Time</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {viewMode === "weekly" && (
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                                                <ArrowRightLeft className="w-3.5 h-3.5" />
                                                Start Week On
                                            </h4>
                                            <Select value={weekStartDay.toString()} onValueChange={(v) => setWeekStartDay(parseInt(v))}>
                                                <SelectTrigger className="w-full h-8 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="6">Saturday</SelectItem>
                                                    <SelectItem value="0">Sunday</SelectItem>
                                                    <SelectItem value="1">Monday</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Divider */}
                        <div className="h-4 w-px bg-border/40 mx-1" />

                        {/* Date Controls */}
                        {viewMode === "daily" && (
                            <>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => changeDate(-1)}>
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-7 px-3 text-xs sm:text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors border border-indigo-500/30">
                                                <CalendarIcon className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                                                {format(new Date(selectedDate + "T12:00:00"), "MMM d, yyyy")}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={new Date(selectedDate + "T12:00:00")}
                                                onSelect={(date) => date && setSelectedDate(getLocalDateStr(date))}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => changeDate(1)}>
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 px-2 text-[10px] font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground ml-1"
                                        onClick={() => setSelectedDate(getLocalDateStr(new Date()))}
                                    >
                                        Today
                                    </Button>
                                </div>
                            </>
                        )}
                        {viewMode === "weekly" && (
                            <>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => changeDate(-7)}>
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <div className="px-3 text-xs sm:text-sm font-medium whitespace-nowrap min-w-[8rem] text-center">
                                        {(() => {
                                            const range = getDateRange();
                                            const start = new Date(range.start + "T12:00:00");
                                            const end = new Date(range.end + "T12:00:00");
                                            return `${format(start, "MMM d")} - ${format(end, "MMM d")}`;
                                        })()}
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => changeDate(7)}>
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 px-2 text-[10px] font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground ml-1"
                                        onClick={() => setSelectedDate(getLocalDateStr(new Date()))}
                                    >
                                        This Week
                                    </Button>
                                </div>
                            </>
                        )}
                        {viewMode === "monthly" && (
                            <>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => {
                                        const d = new Date(selectedDate + "T12:00:00");
                                        d.setMonth(d.getMonth() - 1);
                                        setSelectedDate(getLocalDateStr(d));
                                    }}>
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-7 px-3 text-xs sm:text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
                                                <CalendarIcon className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                                                {format(new Date(selectedDate + "T12:00:00"), "MMM yyyy")}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={new Date(selectedDate + "T12:00:00")}
                                                onSelect={(date) => date && setSelectedDate(getLocalDateStr(date))}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => {
                                        const d = new Date(selectedDate + "T12:00:00");
                                        d.setMonth(d.getMonth() + 1);
                                        setSelectedDate(getLocalDateStr(d));
                                    }}>
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 px-2 text-[10px] font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground ml-1"
                                        onClick={() => setSelectedDate(getLocalDateStr(new Date()))}
                                    >
                                        This Month
                                    </Button>
                                </div>
                            </>
                        )}
                        {viewMode === "yearly" && (
                            <>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => {
                                        const d = new Date(selectedDate + "T12:00:00");
                                        d.setFullYear(d.getFullYear() - 1);
                                        setSelectedDate(getLocalDateStr(d));
                                    }}>
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <Select value={selectedDate.substring(0, 4)} onValueChange={(v) => setSelectedDate(v + "-01-01")}>
                                        <SelectTrigger className="h-7 w-[70px] border-none bg-transparent focus:ring-0 focus:ring-offset-0 px-2 text-xs sm:text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors shadow-none">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                                                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => {
                                        const d = new Date(selectedDate + "T12:00:00");
                                        d.setFullYear(d.getFullYear() + 1);
                                        setSelectedDate(getLocalDateStr(d));
                                    }}>
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 px-2 text-[10px] font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground ml-1"
                                        onClick={() => setSelectedDate(getLocalDateStr(new Date()))}
                                    >
                                        This Year
                                    </Button>
                                </div>
                            </>
                        )}
                        {viewMode === "custom" && (
                            <div className="flex items-center gap-1.5 whitespace-nowrap px-1">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-8 px-2 text-xs font-medium rounded-lg border-border/50 bg-background/50">
                                            {format(new Date(customStartDate), "MMM d")}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={new Date(customStartDate)}
                                            onSelect={(date) => date && setCustomStartDate(getLocalDateStr(date))}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <span className="text-xs text-muted-foreground">→</span>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-8 px-2 text-xs font-medium rounded-lg border-border/50 bg-background/50">
                                            {format(new Date(customEndDate), "MMM d")}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={new Date(customEndDate)}
                                            onSelect={(date) => date && setCustomEndDate(getLocalDateStr(date))}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        )}
                        {viewMode === "all" && (
                            <span className="text-xs font-medium text-muted-foreground px-3 py-1 bg-secondary/50 rounded-lg">
                                All Time
                            </span>
                        )}
                    </motion.div>



                    {/* Add Entry Button */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            {/* Desktop Button - hidden on mobile */}
                            <Button size="sm" className="hidden md:flex gap-1.5 h-8 shadow-lg shadow-primary/20">
                                <Plus className="w-3.5 h-3.5" />
                                <span>Entry</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Finance Entry</DialogTitle>
                                <DialogDescription>
                                    Create a new income or expense entry.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <Tabs value={newEntry.type} onValueChange={(v) => setNewEntry({ ...newEntry, type: v as "income" | "expense" })}>
                                    <TabsList className="w-full">
                                        <TabsTrigger
                                            value="expense"
                                            className="flex-1 data-[state=active]:bg-red-500 data-[state=active]:text-white transition-all"
                                        >
                                            Expense
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="income"
                                            className="flex-1 data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all"
                                        >
                                            Income
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>

                                {/* Date Picker for Entry */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start gap-2">
                                            <CalendarIcon className="w-4 h-4" />
                                            {format(new Date(newEntry.date + "T12:00:00"), "MMM d, yyyy")}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={new Date(newEntry.date + "T12:00:00")}
                                            onSelect={(date) => date && setNewEntry({ ...newEntry, date: getLocalDateStr(date) })}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>

                                <Input
                                    type="number"
                                    placeholder="Amount (৳)"
                                    value={newEntry.amount}
                                    onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                                />
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Category</p>
                                    <div className="flex gap-2">
                                        <Select
                                            value={(newEntry.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).includes(newEntry.category) ? newEntry.category : (newEntry.category ? "Other" : "")}
                                            onValueChange={(v) => {
                                                if (v === "Other") {
                                                    setNewEntry({ ...newEntry, category: "" });
                                                    setCustomCategory("");
                                                } else {
                                                    setNewEntry({ ...newEntry, category: v });
                                                    setCustomCategory("");
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(newEntry.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(c => (
                                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                                ))}
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {/* Show input if "Other" is selected (implied by category not being in list or being explicitly empty while "Other" logic is active, but simpler: if category is not in list) */}
                                    {(!(newEntry.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).includes(newEntry.category) && newEntry.category !== "") || (newEntry.category === "" && customCategory !== undefined) ? (
                                        <Input
                                            placeholder="Enter custom category"
                                            value={newEntry.category}
                                            onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                                            autoFocus
                                        />
                                    ) : null}
                                </div>
                                <Input
                                    placeholder="Description (optional)"
                                    value={newEntry.description}
                                    onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                                />

                                {/* Source selector for expenses - shows current mode's budgets and savings */}
                                {newEntry.type === "expense" && (
                                    ((financeViewMode === "default" ? (savingsGoals?.length > 0 || budgetGoals?.length > 0) : (specialSavingsGoals?.length > 0 || specialBudgetGoals?.length > 0)))
                                ) && (
                                        <Select
                                            value={newEntry.source}
                                            onValueChange={(v) => setNewEntry({ ...newEntry, source: v })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Deduct from..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="budget">
                                                    {financeViewMode === "special" ? "⭐ No specific goal" : "No specific goal"}
                                                </SelectItem>
                                                {(financeViewMode === "default" ? budgetGoals : specialBudgetGoals)?.map(b => (
                                                    <SelectItem key={b.id} value={b.id}>
                                                        📊 {b.name} (৳{getBudgetRemaining(b as any).toLocaleString()} left)
                                                    </SelectItem>
                                                ))}
                                                {(financeViewMode === "default" ? savingsGoals : specialSavingsGoals)?.map(s => (
                                                    <SelectItem key={s.id} value={s.id}>
                                                        💰 {s.name} (৳{s.current_amount.toLocaleString()})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}

                                {/* Savings/Budget destination for income - shows current mode's goals */}
                                {newEntry.type === "income" && (
                                    ((financeViewMode === "default" ? (savingsGoals?.length > 0 || budgetGoals?.length > 0) : (specialSavingsGoals?.length > 0 || specialBudgetGoals?.length > 0)))
                                ) && (
                                        <Select
                                            value={newEntry.source}
                                            onValueChange={(v) => setNewEntry({ ...newEntry, source: v })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Add to goal..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="budget">Don't add to any goal</SelectItem>
                                                {(financeViewMode === "default" ? savingsGoals : specialSavingsGoals)?.map(s => (
                                                    <SelectItem key={s.id} value={s.id}>
                                                        💰 Add to {s.name} (৳{s.current_amount.toLocaleString()})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}

                                {/* View Mode Indicator */}
                                <div className={`flex items-center justify-between p-3 rounded-lg ${financeViewMode === "special"
                                    ? "bg-yellow-500/20 border border-yellow-500/30"
                                    : "bg-primary/10 border border-primary/20"
                                    }`}>
                                    <div className="flex items-center gap-2">
                                        {financeViewMode === "special" ? (
                                            <Star className="w-4 h-4 text-yellow-500" />
                                        ) : (
                                            <Wallet className="w-4 h-4 text-primary" />
                                        )}
                                        <div>
                                            <p className="text-sm font-medium">
                                                Adding to {financeViewMode === "special" ? "Special" : "Default"} Finance
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {financeViewMode === "special"
                                                    ? "This will be tracked separately from regular finances"
                                                    : "Regular day-to-day transaction"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Button onClick={handleAddEntry} className="w-full" disabled={addEntry.isPending}>
                                    {addEntry.isPending ? "Adding..." : `Add ${newEntry.type}`}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Spacer for fixed toolbar on mobile - adjusted to avoid overspacing */}
                <div className="h-2 md:hidden" aria-hidden="true" />

                {/* Stats Cards - Now Clickable */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 md:mt-0">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative overflow-hidden rounded-2xl p-3 sm:p-5 cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-500/20 via-green-400/10 to-emerald-500/5 border border-green-200/50 dark:border-green-500/20 group"
                        onClick={() => openHistory("income")}
                    >
                        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-green-500/20 blur-2xl transition-opacity opacity-0 group-hover:opacity-100" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                <div className="p-1.5 sm:p-2 rounded-lg bg-green-500/20 text-green-600 dark:text-green-400">
                                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <span className="text-muted-foreground text-xs sm:text-sm font-medium">Income</span>
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400 tracking-tight">৳{totalIncome.toLocaleString()}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 hidden xs:block">Click to view details</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="relative overflow-hidden rounded-2xl p-3 sm:p-5 cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-red-500/20 via-red-400/10 to-pink-500/5 border border-red-200/50 dark:border-red-500/20 group"
                        onClick={() => openHistory("expense")}
                    >
                        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-red-500/20 blur-2xl transition-opacity opacity-0 group-hover:opacity-100" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                <div className="p-1.5 sm:p-2 rounded-lg bg-red-500/20 text-red-600 dark:text-red-400">
                                    <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <span className="text-muted-foreground text-xs sm:text-sm font-medium">Expenses</span>
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400 tracking-tight">৳{totalExpenses.toLocaleString()}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 hidden xs:block">Click to view details</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative overflow-hidden rounded-2xl p-3 sm:p-5 cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-500/20 via-blue-400/10 to-indigo-500/5 border border-blue-200/50 dark:border-blue-500/20 group col-span-2 sm:col-span-1"
                        onClick={() => openHistory("all")}
                    >
                        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-blue-500/20 blur-2xl transition-opacity opacity-0 group-hover:opacity-100" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400">
                                    <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <span className="text-muted-foreground text-xs sm:text-sm font-medium">Balance</span>
                            </div>
                            <p className={`text-xl sm:text-2xl font-bold tracking-tight ${balance >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-500"}`}>
                                ৳{balance.toLocaleString()}
                            </p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 hidden xs:block">Click to view all</p>
                        </div>
                    </motion.div>
                </div>


                {/* Budget & Savings Section */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                    {/* Budget Remaining Card */}
                    {/* Budget Remaining Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative overflow-hidden rounded-2xl p-3 sm:p-5 bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-orange-500/5 border border-amber-200/50 dark:border-amber-500/20 group"
                    >
                        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-amber-500/20 blur-2xl transition-opacity opacity-0 group-hover:opacity-100" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                <div className="p-1.5 sm:p-2 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
                                    <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <span className="text-muted-foreground text-xs sm:text-sm font-medium">Monthly Budget</span>
                            </div>
                            <p className={`text-xl sm:text-2xl font-bold tracking-tight ${budgetRemaining >= 0 ? "text-amber-600 dark:text-amber-400" : "text-red-500"}`}>
                                ৳{budgetRemaining.toLocaleString()}
                            </p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 truncate">
                                {primaryBudget ? `${new Date().toLocaleString('default', { month: 'long' })}` : "No budget"}
                            </p>
                        </div>
                    </motion.div>

                    {/* Total Savings Card */}
                    {/* Total Savings Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="relative overflow-hidden rounded-2xl p-3 sm:p-5 cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-500/20 via-purple-400/10 to-violet-500/5 border border-purple-200/50 dark:border-purple-500/20 group"
                        onClick={() => setIsSavingsHistoryOpen(true)}
                    >
                        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-purple-500/20 blur-2xl transition-opacity opacity-0 group-hover:opacity-100" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-400">
                                    <PiggyBank className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <span className="text-muted-foreground text-xs sm:text-sm font-medium">Savings</span>
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400 tracking-tight">৳{totalSavings.toLocaleString()}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 hidden xs:block">View history</p>
                        </div>
                    </motion.div>

                    {/* Add Budget/Savings Button */}
                    {/* Goals Section - Now Vibrant & Consolidated */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="relative overflow-hidden rounded-2xl p-3 sm:p-5 col-span-2 bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-violet-500/5 border border-indigo-500/20 shadow-sm"
                    >
                        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-indigo-500/20 blur-3xl" />

                        <div className="relative z-10">
                            {/* Header */}
                            <div className="flex items-center justify-between gap-2 mb-4">
                                <h4 className="font-semibold text-lg text-indigo-950 dark:text-indigo-100 tracking-tight flex items-center gap-2">
                                    Goals
                                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                                        {filteredGoals.length} {goalsFilter === "active" ? "Active" : goalsFilter === "upcoming" ? "Upcoming" : "Archived"}
                                    </span>
                                </h4>
                                <div className="flex items-center gap-1.5">
                                    <p className="text-xs text-indigo-600/70 dark:text-indigo-300/70 font-medium whitespace-nowrap">
                                        {budgetGoals.length} budget, {savingsGoals.length} savings
                                    </p>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-indigo-900/50 hover:text-indigo-600 dark:text-indigo-300/50 dark:hover:text-indigo-300">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-48 p-1.5" align="end">
                                            <div className="space-y-1">
                                                {/* Filter */}
                                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 pt-1">Filter</p>
                                                {(["active", "upcoming", "archive"] as const).map((f) => (
                                                    <Button
                                                        key={f}
                                                        variant={goalsFilter === f ? "secondary" : "ghost"}
                                                        size="sm"
                                                        className="w-full justify-start gap-2 text-xs h-8"
                                                        onClick={() => setGoalsFilter(f)}
                                                    >
                                                        {f === "active" ? <Zap className="w-3.5 h-3.5" /> : f === "upcoming" ? <Clock className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                                                        {f === "active" ? "Active" : f === "upcoming" ? "Upcoming" : "Archive"}
                                                    </Button>
                                                ))}

                                                <div className="border-t border-border my-1" />

                                                {/* Sort */}
                                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 pt-0.5">Sort by</p>
                                                {(["date", "amount"] as const).map((s) => (
                                                    <Button
                                                        key={s}
                                                        variant={goalsSortBy === s ? "secondary" : "ghost"}
                                                        size="sm"
                                                        className="w-full justify-start gap-2 text-xs h-8"
                                                        onClick={() => setGoalsSortBy(s)}
                                                    >
                                                        <ListFilter className="w-3.5 h-3.5" />
                                                        {s === "date" ? "Date" : "Amount"}
                                                    </Button>
                                                ))}

                                                <div className="border-t border-border my-1" />

                                                {/* Add Goal */}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-full justify-start gap-2 text-xs h-8 text-indigo-600 dark:text-indigo-400"
                                                    onClick={() => setIsBudgetDialogOpen(true)}
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                    Add Goal
                                                </Button>

                                                {/* Export */}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-full justify-start gap-2 text-xs h-8"
                                                    onClick={() => generatePDF(
                                                        `Finance_${financeViewMode}_${viewMode}`,
                                                        filteredEntries,
                                                        "finance"
                                                    )}
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                    Export PDF
                                                </Button>

                                                {/* History */}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-full justify-start gap-2 text-xs h-8"
                                                    onClick={() => openHistory("all")}
                                                >
                                                    <History className="w-3.5 h-3.5" />
                                                    View All History
                                                </Button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            {/* Add Goal Dialog */}
                            <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Create Budget or Savings Goal</DialogTitle>
                                        <DialogDescription>
                                            Set a spending budget or savings target.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 pt-4">
                                        <Tabs value={newBudget.type} onValueChange={(v) => setNewBudget({ ...newBudget, type: v as "budget" | "savings" })}>
                                            <TabsList className="w-full">
                                                <TabsTrigger
                                                    value="budget"
                                                    className="flex-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all"
                                                >
                                                    Budget
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="savings"
                                                    className="flex-1 data-[state=active]:bg-purple-500 data-[state=active]:text-white transition-all"
                                                >
                                                    Savings
                                                </TabsTrigger>
                                            </TabsList>
                                        </Tabs>

                                        <Input
                                            placeholder={newBudget.type === "budget" ? "Budget Name (e.g. Monthly Budget)" : "Savings Goal Name (e.g. Emergency Fund)"}
                                            value={newBudget.name}
                                            onChange={(e) => setNewBudget({ ...newBudget, name: e.target.value })}
                                        />

                                        <Input
                                            type="number"
                                            placeholder="Target Amount (৳)"
                                            value={newBudget.target_amount}
                                            onChange={(e) => setNewBudget({ ...newBudget, target_amount: e.target.value })}
                                        />

                                        {newBudget.type === "budget" && (
                                            <>
                                                <Select
                                                    value={newBudget.period || "monthly"}
                                                    onValueChange={(v) => setNewBudget({ ...newBudget, period: v as "monthly" | "weekly" | "yearly" })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Period" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="weekly">Weekly</SelectItem>
                                                        <SelectItem value="monthly">Monthly</SelectItem>
                                                        <SelectItem value="yearly">Yearly</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                {/* Period-based Date Selector */}
                                                <div className="flex gap-2">
                                                    {newBudget.period === "weekly" && (
                                                        <Input
                                                            type="date"
                                                            value={`${newBudget.start_year}-${String(newBudget.start_month).padStart(2, '0')}-01`}
                                                            onChange={(e) => {
                                                                const d = new Date(e.target.value);
                                                                setNewBudget({
                                                                    ...newBudget,
                                                                    start_month: d.getMonth() + 1,
                                                                    start_year: d.getFullYear()
                                                                });
                                                            }}
                                                            className="flex-1"
                                                        />
                                                    )}
                                                    {newBudget.period === "monthly" && (
                                                        <>
                                                            <Select
                                                                value={String(newBudget.start_month)}
                                                                onValueChange={(v) => setNewBudget({ ...newBudget, start_month: parseInt(v) })}
                                                            >
                                                                <SelectTrigger className="flex-1">
                                                                    <SelectValue placeholder="Month" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, i) => (
                                                                        <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <Select
                                                                value={String(newBudget.start_year)}
                                                                onValueChange={(v) => setNewBudget({ ...newBudget, start_year: parseInt(v) })}
                                                            >
                                                                <SelectTrigger className="w-24">
                                                                    <SelectValue placeholder="Year" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {[2025, 2026, 2027, 2028, 2029, 2030].map(y => (
                                                                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </>
                                                    )}
                                                    {newBudget.period === "yearly" && (
                                                        <Select
                                                            value={String(newBudget.start_year)}
                                                            onValueChange={(v) => setNewBudget({ ...newBudget, start_year: parseInt(v) })}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Year" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {[2025, 2026, 2027, 2028, 2029, 2030].map(y => (
                                                                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                </div>

                                                <Input
                                                    placeholder="Category (optional, leave blank for all expenses)"
                                                    value={newBudget.category}
                                                    onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                                                />
                                            </>
                                        )}

                                        <Button
                                            className="w-full"
                                            onClick={async () => {
                                                if (!newBudget.name || !newBudget.target_amount) return;
                                                // Build start_date from month/year for monthly/yearly budgets
                                                const startDate = newBudget.type === "budget"
                                                    ? `${newBudget.start_year}-${String(newBudget.start_month).padStart(2, '0')}-01`
                                                    : null;
                                                await addBudget.mutateAsync({
                                                    name: newBudget.name,
                                                    type: newBudget.type,
                                                    target_amount: parseFloat(newBudget.target_amount),
                                                    period: newBudget.type === "budget" ? newBudget.period : null,
                                                    category: newBudget.category || null,
                                                    start_date: startDate,
                                                });
                                                setNewBudget({
                                                    name: "",
                                                    type: "budget",
                                                    target_amount: "",
                                                    period: "monthly",
                                                    category: "",
                                                    start_month: new Date().getMonth() + 1,
                                                    start_year: new Date().getFullYear(),
                                                });
                                                setIsBudgetDialogOpen(false);
                                            }}
                                            disabled={addBudget.isPending}
                                        >
                                            {addBudget.isPending ? "Creating..." : `Create ${newBudget.type}`}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>


                            {/* Goals List - Rendered within Card */}
                            <div className={`grid gap-2 overflow-y-auto custom-scrollbar pr-1 mt-2.5 ${filteredGoals.length > 0 ? "max-h-[120px]" : "h-auto"}`}>
                                {filteredGoals.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-4 text-center bg-indigo-500/5 rounded-lg border border-dashed border-indigo-500/20">
                                        <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-1.5">
                                            {goalsFilter === "upcoming" ? <Clock className="w-3.5 h-3.5 text-indigo-500" /> : goalsFilter === "archive" ? <Archive className="w-3.5 h-3.5 text-indigo-500" /> : <Target className="w-3.5 h-3.5 text-indigo-500" />}
                                        </div>
                                        <p className="text-xs font-medium text-indigo-900 dark:text-indigo-200">
                                            {goalsFilter === "active" ? "No active goals" : goalsFilter === "upcoming" ? "No upcoming goals" : "No archived goals"}
                                        </p>
                                    </div>
                                ) : (
                                    filteredGoals
                                        .sort((a, b) => {
                                            if (goalsSortBy === "amount") {
                                                return b.target_amount - a.target_amount;
                                            }
                                            return b.id.localeCompare(a.id);
                                        })
                                        .map((item) => {
                                            const isBudget = item.type === "budget";
                                            const spent = isBudget ? (item.target_amount - getBudgetRemaining(item as any)) : (item.current_amount || 0);
                                            const percentage = Math.min(100, Math.max(0, (spent / item.target_amount) * 100));

                                            // Dynamic color
                                            let progressColorClass = "bg-indigo-500";
                                            if (isBudget) {
                                                if (percentage > 90) progressColorClass = "bg-red-500";
                                                else if (percentage > 75) progressColorClass = "bg-amber-500";
                                                else progressColorClass = "bg-blue-500";
                                            } else {
                                                if (percentage >= 100) progressColorClass = "bg-green-500";
                                                else progressColorClass = "bg-purple-500";
                                            }

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="group relative flex items-center gap-3 p-2 rounded-lg bg-white/40 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-black/30 border border-white/10 transition-all duration-300"
                                                >
                                                    <div className={`p-1.5 rounded-md flex-shrink-0 ${isBudget ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'}`}>
                                                        {isBudget ? <Wallet className="w-3.5 h-3.5" /> : <PiggyBank className="w-3.5 h-3.5" />}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <div className="flex items-center gap-1.5">
                                                                <h5 className="font-semibold text-xs text-indigo-950 dark:text-indigo-100 truncate">{item.name}</h5>
                                                                {item.is_special && <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />}
                                                            </div>
                                                            <div className="text-[10px] font-medium text-indigo-900/60 dark:text-indigo-200/60 whitespace-nowrap">
                                                                ৳{spent.toLocaleString()} / ৳{item.target_amount.toLocaleString()}
                                                            </div>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-indigo-950/5 dark:bg-white/5 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${percentage}%` }}
                                                                transition={{ duration: 1, ease: "easeOut" }}
                                                                className={`h-full rounded-full ${progressColorClass}`}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Compact Actions */}
                                                    {/* Compact Actions Menu */}
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-indigo-900/40 hover:text-indigo-600">
                                                                <MoreVertical className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-2 bg-white/90 backdrop-blur-xl border-indigo-100 dark:border-indigo-900/50" align="end">
                                                            <div className="flex flex-col gap-2">
                                                                <div className="flex items-center gap-1">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-7 w-7 text-indigo-900/60 hover:text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                                                                        onClick={() => setEditingGoal({ id: item.id, name: item.name, target_amount: String(item.target_amount), type: item.type })}
                                                                        title="Edit Goal"
                                                                    >
                                                                        <Pencil className="w-3.5 h-3.5" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-7 w-7 text-indigo-900/60 hover:text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
                                                                        onClick={() => updateBudget.mutate({ id: item.id, is_special: !item.is_special })}
                                                                        title={item.is_special ? "Unmark Special" : "Mark as Special"}
                                                                    >
                                                                        <Star className={`w-3.5 h-3.5 ${item.is_special ? "fill-yellow-500 text-yellow-500" : ""}`} />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-7 w-7 text-indigo-900/60 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20"
                                                                        onClick={() => deleteBudget.mutate(item.id)}
                                                                        title="Delete Goal"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </Button>
                                                                </div>

                                                                {/* Add Funds for Savings */}
                                                                {!isBudget && (
                                                                    <div className="flex gap-1 pt-1 border-t border-indigo-100 dark:border-indigo-800/50">
                                                                        <Input
                                                                            type="number"
                                                                            placeholder="+"
                                                                            value={savingsAmount}
                                                                            onChange={(e) => setSavingsAmount(e.target.value)}
                                                                            className="h-7 w-20 text-xs bg-transparent border-indigo-200 px-1"
                                                                        />
                                                                        <Button
                                                                            size="sm"
                                                                            className="h-7 px-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                                                                            onClick={() => {
                                                                                if (savingsAmount) {
                                                                                    addToSavings.mutate({ id: item.id, amount: parseFloat(savingsAmount) });
                                                                                    setSavingsAmount("");
                                                                                }
                                                                            }}
                                                                        >
                                                                            Add
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            );
                                        })
                                )}</div>
                        </div>

                        {/* Edit Goal Dialog */}
                        <Dialog open={!!editingGoal} onOpenChange={(open) => !open && setEditingGoal(null)}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit {editingGoal?.type === "budget" ? "Budget" : "Savings Goal"}</DialogTitle>
                                    <DialogDescription>Update goal name or target amount.</DialogDescription>
                                </DialogHeader>
                                {editingGoal && (
                                    <div className="space-y-4 pt-2">
                                        <Input
                                            placeholder="Goal name"
                                            value={editingGoal.name}
                                            onChange={(e) => setEditingGoal({ ...editingGoal, name: e.target.value })}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Target Amount (৳)"
                                            value={editingGoal.target_amount}
                                            onChange={(e) => setEditingGoal({ ...editingGoal, target_amount: e.target.value })}
                                        />
                                        <Button
                                            className="w-full"
                                            onClick={async () => {
                                                if (!editingGoal.name || !editingGoal.target_amount) return;
                                                await updateBudget.mutateAsync({
                                                    id: editingGoal.id,
                                                    name: editingGoal.name,
                                                    target_amount: parseFloat(editingGoal.target_amount),
                                                });
                                                setEditingGoal(null);
                                            }}
                                            disabled={updateBudget.isPending}
                                        >
                                            {updateBudget.isPending ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    </motion.div>
                </div>


                {/* Chart & List */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Chart - Pie for daily, Bar for others */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative overflow-hidden rounded-2xl p-6 bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg"
                    >
                        {/* Background gradients */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />

                        <h3 className="font-semibold mb-6 text-lg tracking-tight text-indigo-950 dark:text-white flex items-center gap-2">
                            {viewMode === "daily" ? <PieChartIcon className="w-5 h-5 text-cyan-600" /> : <BarChartIcon className="w-5 h-5 text-blue-600" />}
                            {viewMode === "daily" ? "Transactions by Category" : "Income vs Expenses"}
                        </h3>
                        {
                            viewMode === "daily" ? (
                                // Pie Chart for daily view
                                chartData.length > 0 ? (
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={chartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    dataKey="value"
                                                    label={({ name, value }) => `${name}: ৳${value}`}
                                                >
                                                    {chartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value) => `৳${value}`}
                                                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid #8b5cf6", borderRadius: "0.75rem", fontSize: "12px", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="h-64 flex flex-col items-center justify-center text-center">
                                        <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-3">
                                            <PieChartIcon className="w-8 h-8 text-indigo-400/60" />
                                        </div>
                                        <p className="text-sm font-medium text-muted-foreground">No data for {formatDate(selectedDate)}</p>
                                        <p className="text-xs text-muted-foreground/60 mt-1">Add a transaction to see visual breakdown</p>
                                    </div>
                                )
                            ) : (viewMode === "weekly" || viewMode === "monthly") ? (
                                // Line Chart for weekly/monthly views - showing daily trends
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart
                                            data={trendData}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.2} />
                                            <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#9CA3AF" tickFormatter={(v) => `৳${v}`} fontSize={12} tickLine={false} axisLine={false} />
                                            <Tooltip
                                                formatter={(value) => `৳${Number(value).toLocaleString()}`}
                                                contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid #8b5cf6", borderRadius: "0.75rem", fontSize: "12px", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
                                            />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="income"
                                                name="Income"
                                                stroke="#10B981"
                                                strokeWidth={3}
                                                dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                                                activeDot={{ r: 6 }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="expense"
                                                name="Expense"
                                                stroke="#EF4444"
                                                strokeWidth={3}
                                                dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
                                                activeDot={{ r: 6 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                // Grid table for yearly/custom/all views
                                <div className="h-64 overflow-y-auto custom-scrollbar">
                                    <table className="w-full text-sm">
                                        <thead className="sticky top-0 bg-white/50 dark:bg-black/50 backdrop-blur-md z-10">
                                            <tr className="border-b border-indigo-100 dark:border-indigo-900/50">
                                                <th className="text-left py-3 px-3 font-semibold text-indigo-900 dark:text-indigo-200">Period</th>
                                                <th className="text-right py-3 px-3 font-semibold text-green-500">Income</th>
                                                <th className="text-right py-3 px-3 font-semibold text-red-500">Expense</th>
                                                <th className="text-right py-3 px-3 font-semibold text-indigo-900 dark:text-indigo-200">Balance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {trendData.map((row, i) => (
                                                <tr key={i} className="border-b border-indigo-50 dark:border-indigo-900/20 hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                                                    <td className="py-2.5 px-3 font-medium text-indigo-950 dark:text-indigo-100">{row.day}</td>
                                                    <td className="text-right py-2.5 px-3 text-green-500">৳{row.income.toLocaleString()}</td>
                                                    <td className="text-right py-2.5 px-3 text-red-500">৳{row.expense.toLocaleString()}</td>
                                                    <td className={`text-right py-2.5 px-3 font-medium ${row.income - row.expense >= 0 ? "text-green-500" : "text-red-500"}`}>
                                                        {row.income - row.expense >= 0 ? "+" : ""}৳{(row.income - row.expense).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                            {trendData.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="text-center py-12 text-muted-foreground">No data for this period</td>
                                                </tr>
                                            )}
                                        </tbody>
                                        <tfoot className="sticky bottom-0 bg-indigo-50/80 dark:bg-indigo-900/40 backdrop-blur-md font-semibold text-sm">
                                            <tr>
                                                <td className="py-3 px-3">Total</td>
                                                <td className="text-right py-3 px-3 text-green-600 dark:text-green-400">৳{totalIncome.toLocaleString()}</td>
                                                <td className="text-right py-3 px-3 text-red-600 dark:text-red-400">৳{totalExpenses.toLocaleString()}</td>
                                                <td className={`text-right py-3 px-3 ${balance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                                                    {balance >= 0 ? "+" : ""}৳{balance.toLocaleString()}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )
                        }
                    </motion.div>

                    {/* Recent Transactions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative overflow-hidden rounded-2xl p-6 bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg"
                    >
                        {/* Background gradients */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10" />

                        <h3 className="font-semibold mb-6 text-lg tracking-tight text-indigo-950 dark:text-white flex items-center gap-2">
                            <History className="w-5 h-5 text-indigo-600" />
                            {viewMode === "daily"
                                ? `Transactions for ${formatDate(selectedDate)}`
                                : viewMode === "all"
                                    ? "All Transactions"
                                    : `Transactions (${filteredEntries.length})`
                            }
                        </h3>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                            {isLoading ? (
                                <p className="text-muted-foreground text-center py-8">Loading...</p>
                            ) : filteredEntries.length === 0 ? (
                                <div className="h-60 flex flex-col items-center justify-center text-center">
                                    <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-3">
                                        <CalendarX className="w-8 h-8 text-indigo-400/60" />
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground">No transactions found</p>
                                    <p className="text-xs text-muted-foreground/60 mt-1">Transactions for this period will appear here</p>
                                </div>
                            ) : (
                                filteredEntries.map((entry) => (
                                    <div key={entry.id} className="group flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 shadow-sm">
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <div className={`p-2 rounded-full flex-shrink-0 ${entry.type === "income" ? "bg-green-500/10" : "bg-red-500/10"}`}>
                                                {entry.type === "income" ? (
                                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <TrendingDown className="w-4 h-4 text-red-500" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold text-indigo-950 dark:text-indigo-100 truncate">{entry.category}</p>
                                                {entry.description && (
                                                    <p className="text-xs text-indigo-900/60 dark:text-indigo-300/60 truncate">{entry.description}</p>
                                                )}
                                                {!entry.description && (
                                                    <p className="text-xs text-indigo-900/40 dark:text-indigo-300/40 italic">No description</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className={`text-sm font-bold ${entry.type === "income" ? "text-green-500" : "text-red-500"}`}>
                                                {entry.type === "income" ? "+" : "-"}৳{entry.amount.toLocaleString()}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-900/40 hover:text-red-500 hover:bg-red-500/10"
                                                onClick={() => deleteEntry.mutate(entry.id)}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            </motion.div >
            {/* History Modal - Mobile Responsive */}
            <AnimatePresence>
                {
                    isHistoryOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
                            onClick={() => setIsHistoryOpen(false)}
                        >
                            <motion.div
                                initial={{ y: "100%", opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: "100%", opacity: 0 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="bg-background rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-2xl max-h-[85vh] sm:max-h-[80vh] overflow-hidden sm:m-4"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Handle bar for mobile */}
                                <div className="sm:hidden flex justify-center pt-2">
                                    <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
                                </div>
                                <div className="p-4 border-b flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-primary" />
                                        <h2 className="text-xl font-bold">
                                            {historyType === "all" ? "All Transactions" : historyType === "income" ? "Income History" : "Expense History"}
                                        </h2>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => generatePDF(
                                                historyType === "all" ? "All Transactions" : historyType === "income" ? "Income History" : "Expense History",
                                                historyEntries,
                                                "finance"
                                            )}
                                            className="gap-2"
                                        >
                                            <Download className="w-4 h-4" />
                                            <span className="hidden sm:inline">PDF</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => setIsHistoryOpen(false)}>
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-4 overflow-y-scroll max-h-[60vh] space-y-2">
                                    {historyEntries.length === 0 ? (
                                        <p className="text-center text-muted-foreground py-8">No transactions found</p>
                                    ) : (
                                        historyEntries.map((entry, index) => (
                                            <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs text-muted-foreground font-mono w-5">{index + 1}.</span>
                                                    <div className={`p-2 rounded-full ${entry.type === "income" ? "bg-green-500/20" : "bg-red-500/20"}`}>
                                                        {entry.type === "income" ? (
                                                            <TrendingUp className="w-4 h-4 text-green-400" />
                                                        ) : (
                                                            <TrendingDown className="w-4 h-4 text-red-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{entry.category}</p>
                                                        {entry.description && (
                                                            <p className="text-sm text-muted-foreground">{entry.description}</p>
                                                        )}
                                                        <p className="text-xs text-muted-foreground">
                                                            {(() => {
                                                                const d = new Date(entry.date);
                                                                return d.toLocaleDateString(undefined, {
                                                                    weekday: "short",
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    year: "numeric"
                                                                });
                                                            })()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-lg font-bold ${entry.type === "income" ? "text-green-400" : "text-red-400"}`}>
                                                        {entry.type === "income" ? "+" : "-"}৳{entry.amount.toLocaleString()}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => setEditingEntry({
                                                            id: entry.id,
                                                            type: entry.type,
                                                            amount: entry.amount.toString(),
                                                            category: entry.category,
                                                            description: entry.description || "",
                                                            date: getLocalDateStr(new Date(entry.date)),
                                                        })}
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-400 hover:text-red-500"
                                                        onClick={() => deleteEntry.mutate(entry.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )
                }
            </AnimatePresence >

            {/* Edit Entry Dialog */}
            <Dialog open={!!editingEntry} onOpenChange={(open) => !open && setEditingEntry(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Entry</DialogTitle>
                        <DialogDescription>
                            Update this {editingEntry?.type} entry.
                        </DialogDescription>
                    </DialogHeader>
                    {editingEntry && (
                        <div className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Amount</label>
                                    <Input
                                        type="number"
                                        value={editingEntry.amount}
                                        onChange={(e) => setEditingEntry({ ...editingEntry, amount: e.target.value })}
                                        placeholder="Enter amount"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Category</label>
                                    <Select
                                        value={(editingEntry.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).includes(editingEntry.category) ? editingEntry.category : (editingEntry.category ? "Other" : "")}
                                        onValueChange={(v) => {
                                            if (v === "Other") {
                                                setEditingEntry({ ...editingEntry, category: "" });
                                            } else {
                                                setEditingEntry({ ...editingEntry, category: v });
                                            }
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(editingEntry.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map((cat) => (
                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                            ))}
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {(!(editingEntry.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).includes(editingEntry.category) && editingEntry.category !== "") || (editingEntry.category === "") ? (
                                        <Input
                                            value={editingEntry.category}
                                            onChange={(e) => setEditingEntry({ ...editingEntry, category: e.target.value })}
                                            placeholder="Enter custom category"
                                            className="mt-2"
                                        />
                                    ) : null}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Input
                                    value={editingEntry.description}
                                    onChange={(e) => setEditingEntry({ ...editingEntry, description: e.target.value })}
                                    placeholder="Optional description"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start gap-2">
                                            <CalendarIcon className="w-4 h-4" />
                                            {format(new Date(editingEntry.date + "T12:00:00"), "MMM d, yyyy")}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={new Date(editingEntry.date + "T12:00:00")}
                                            onSelect={(date) => date && setEditingEntry({ ...editingEntry, date: getLocalDateStr(date) })}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="outline" onClick={() => setEditingEntry(null)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => {
                                        updateEntry.mutate({
                                            id: editingEntry.id,
                                            amount: Number(editingEntry.amount),
                                            category: editingEntry.category,
                                            description: editingEntry.description,
                                            date: editingEntry.date,
                                        });
                                        setEditingEntry(null);
                                    }}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog >

            {/* Savings History Modal - Mobile Responsive */}
            <AnimatePresence>
                {
                    isSavingsHistoryOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
                            onClick={() => setIsSavingsHistoryOpen(false)}
                        >
                            <motion.div
                                initial={{ y: "100%", opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: "100%", opacity: 0 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="bg-background rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-lg max-h-[85vh] sm:max-h-[80vh] overflow-hidden sm:m-4"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Handle bar for mobile */}
                                <div className="sm:hidden flex justify-center pt-2">
                                    <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
                                </div>
                                <div className="p-4 border-b flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <PiggyBank className="w-5 h-5 text-purple-400" />
                                        <div>
                                            <h2 className="text-lg font-bold">Savings History</h2>
                                            <p className="text-xs text-muted-foreground">
                                                Total: ৳{totalSavings.toLocaleString()} across {savingsGoals.length} goal(s)
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => generatePDF("Savings History", savingsTransactions, "savings")}
                                            className="gap-2"
                                        >
                                            <Download className="w-4 h-4" />
                                            <span className="hidden sm:inline">PDF</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => setIsSavingsHistoryOpen(false)}>
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-4 overflow-y-auto max-h-[calc(85vh-80px)] sm:max-h-[calc(80vh-80px)] space-y-2">
                                    {savingsTransactions.length === 0 ? (
                                        <p className="text-center text-muted-foreground py-8">
                                            No savings transactions yet.
                                        </p>
                                    ) : (
                                        savingsTransactions.map(tx => {
                                            const savings = savingsGoals.find(s => s.id === tx.savings_id);
                                            return (
                                                <div key={tx.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${tx.type === "deposit" ? "bg-green-500/20" : "bg-red-500/20"}`}>
                                                            {tx.type === "deposit" ? (
                                                                <TrendingUp className="w-4 h-4 text-green-400" />
                                                            ) : (
                                                                <TrendingDown className="w-4 h-4 text-red-400" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm">{savings?.name || "Savings"}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {format(new Date(tx.date + "T12:00:00"), "EEE, MMM d, yyyy")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className={`font-semibold mr-2 ${tx.type === "deposit" ? "text-green-400" : "text-red-400"}`}>
                                                            {tx.type === "deposit" ? "+" : "-"}৳{tx.amount.toLocaleString()}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 hover:bg-secondary"
                                                            onClick={() => setEditingSavingsTransaction(tx)}
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-500/10"
                                                            onClick={() => deleteSavingsTransaction.mutate({
                                                                id: tx.id,
                                                                savingsId: tx.savings_id,
                                                                amount: tx.amount,
                                                                type: tx.type
                                                            })}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )
                }
            </AnimatePresence >

            {/* Edit Savings Transaction Dialog */}
            <Dialog open={!!editingSavingsTransaction} onOpenChange={(open) => !open && setEditingSavingsTransaction(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Transaction</DialogTitle>
                        <DialogDescription>
                            Update this savings transaction.
                        </DialogDescription>
                    </DialogHeader>
                    {editingSavingsTransaction && (
                        <div className="space-y-4 pt-4">
                            <Tabs
                                value={editingSavingsTransaction.type}
                                onValueChange={(v) => setEditingSavingsTransaction({ ...editingSavingsTransaction, type: v as "deposit" | "withdraw" })}
                            >
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="deposit" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">Deposit</TabsTrigger>
                                    <TabsTrigger value="withdraw" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">Withdraw</TabsTrigger>
                                </TabsList>
                            </Tabs>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Amount</label>
                                <Input
                                    type="number"
                                    value={editingSavingsTransaction.amount}
                                    onChange={(e) => setEditingSavingsTransaction({ ...editingSavingsTransaction, amount: parseFloat(e.target.value) || 0 })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start gap-2">
                                            <CalendarIcon className="w-4 h-4" />
                                            {format(new Date(editingSavingsTransaction.date + "T12:00:00"), "MMM d, yyyy")}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={new Date(editingSavingsTransaction.date + "T12:00:00")}
                                            onSelect={(date) => date && setEditingSavingsTransaction({ ...editingSavingsTransaction, date: getLocalDateStr(date) })}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Input
                                    value={editingSavingsTransaction.description || ""}
                                    onChange={(e) => setEditingSavingsTransaction({ ...editingSavingsTransaction, description: e.target.value })}
                                    placeholder="Optional description"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="ghost" onClick={() => setEditingSavingsTransaction(null)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => {
                                        // We need the original transaction to calculate differences
                                        // But we are editing the state in place.
                                        // Wait, if I edit state in place, I lose the original values needed for `updateSavingsTransaction`.
                                        // I should have kept `editingSavingsTransaction` as the *new* state and find the *original* from the list?
                                        // Or store `originalTransaction` separately?
                                        // Actually `savingsTransactions` query data has the original.
                                        const original = savingsTransactions.find(t => t.id === editingSavingsTransaction.id);
                                        if (original) {
                                            updateSavingsTransaction.mutate({
                                                id: editingSavingsTransaction.id,
                                                savingsId: editingSavingsTransaction.savings_id,
                                                oldAmount: original.amount,
                                                oldType: original.type,
                                                newAmount: editingSavingsTransaction.amount,
                                                newType: editingSavingsTransaction.type,
                                                newDate: editingSavingsTransaction.date,
                                                newDescription: editingSavingsTransaction.description || undefined
                                            });
                                            setEditingSavingsTransaction(null);
                                        }
                                    }}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog >
        </AppLayout >
    );
}
