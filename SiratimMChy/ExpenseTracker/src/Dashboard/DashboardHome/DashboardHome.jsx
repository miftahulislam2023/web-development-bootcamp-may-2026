import { useContext, useEffect } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import { useState } from "react";
import axios from "axios";
import { ArrowDownRight, ArrowUpRight, PieChart, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Link } from "react-router";

const DashboardHome = () => {
    const { user } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        totalIncome: 0, totalExpense: 0, balance: 0,
        transactionCount: 0, incomeCount: 0, expenseCount: 0
    });

    useEffect(() => {
        if (!user?.email) return;
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/transactions?email=${encodeURIComponent(user.email)}`,
                    { signal: controller.signal }
                );
                const data = Array.isArray(res.data) ? res.data : [];

                const s = data.reduce((acc, t) => {
                    const amt = parseFloat(t.amount) || 0;
                    if (t.type === 'income') { acc.totalIncome += amt; acc.incomeCount++; }
                    else if (t.type === 'expense') { acc.totalExpense += amt; acc.expenseCount++; }
                    acc.transactionCount++;
                    return acc;
                }, { totalIncome: 0, totalExpense: 0, balance: 0, transactionCount: 0, incomeCount: 0, expenseCount: 0 });

                s.balance = s.totalIncome - s.totalExpense;
                setStats(s);
                setTransactions(data);
            } catch (err) {
                if (!axios.isCancel(err)) setError('Failed to load data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        return () => controller.abort();
    }, [user?.email]);

    const fmt = amt => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt);
    const fmtCompact = amt => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(amt);
    const fmtDate = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const savingsRate = stats.totalIncome > 0 ? Math.round((stats.balance / stats.totalIncome) * 100) : 0;
    const incomeWidth = stats.totalIncome + stats.totalExpense > 0
        ? Math.min((stats.totalIncome / (stats.totalIncome + stats.totalExpense)) * 100, 100) : 0;

    const statCards = [
        {
            label: 'Current Balance', value: fmt(stats.balance),
            sub: `${stats.transactionCount} total transactions`,
            icon: <Wallet size={20} className="text-white" />,
            iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
            valueClass: stats.balance >= 0 ? 'text-green-600' : 'text-red-500'
        },
        {
            label: 'Total Income', value: fmt(stats.totalIncome),
            sub: `${stats.incomeCount} income entries`,
            icon: <TrendingUp size={20} className="text-white" />,
            iconBg: 'bg-green-500', valueClass: 'text-base-content'
        },
        {
            label: 'Total Expense', value: fmt(stats.totalExpense),
            sub: `${stats.expenseCount} expense entries`,
            icon: <TrendingDown size={20} className="text-white" />,
            iconBg: 'bg-red-500', valueClass: 'text-base-content'
        },
        {
            label: 'Savings Rate', value: `${savingsRate}%`,
            sub: 'Of total income saved',
            icon: <PieChart size={20} className="text-white" />,
            iconBg: 'bg-purple-500', valueClass: 'text-base-content'
        },
    ];

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    );

    return (
        <div className="min-h-screen bg-base-100 px-3 py-6 sm:px-6 lg:px-10">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">

                {/* Header */}
                <div>
                    <p className="text-xs sm:text-sm uppercase tracking-[0.2em] font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        Cashnivo
                    </p>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">Dashboard</h1>
                    <p className="mt-1 text-sm text-base-content/60">
                        Welcome back, <span className="font-semibold text-base-content">{user?.displayName || 'User'}</span>!
                    </p>
                </div>

                {error && <div className="alert alert-error text-sm"><span>{error}</span></div>}

                {/* Stat Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4">
                    {statCards.map((card, i) => (
                        <div key={i} className="card bg-base-200 border border-base-content/10 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow duration-200">
                            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-3 sm:mb-4 ${card.iconBg}`}>
                                {card.icon}
                            </div>
                            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-base-content/50 font-semibold mb-1 leading-tight">
                                {card.label}
                            </p>
                            <p className={`text-lg sm:text-2xl font-bold ${card.valueClass}`}>{card.value}</p>
                            <p className="text-[10px] sm:text-xs text-base-content/40 mt-1 leading-tight">{card.sub}</p>
                        </div>
                    ))}
                </div>

                {/* Income vs Expense + Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* Income vs Expense */}
                    <div className="lg:col-span-2 card bg-base-200 border border-base-content/10 shadow-sm p-4 sm:p-6">
                        <h3 className="font-bold text-base-content mb-4 sm:mb-5">Income vs Expense</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Income', value: stats.totalIncome, color: 'bg-green-500', width: incomeWidth },
                                { label: 'Expense', value: stats.totalExpense, color: 'bg-red-500', width: 100 - incomeWidth },
                            ].map((item) => (
                                <div key={item.label}>
                                    <div className="flex justify-between text-sm font-medium mb-2">
                                        <span className="text-base-content/70">{item.label}</span>
                                        <span className="text-base-content font-bold">{fmt(item.value)}</span>
                                    </div>
                                    <div className="w-full bg-base-300 rounded-full h-2">
                                        <div
                                            className={`${item.color} h-2 rounded-full transition-all duration-500`}
                                            style={{ width: `${item.width}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-3 sm:pt-4 border-t border-base-content/10 flex items-center justify-between gap-2">
                                <div>
                                    <p className="text-xs text-base-content/40 uppercase tracking-wide">Net Balance</p>
                                    <p className={`text-lg sm:text-xl font-bold ${stats.balance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {fmt(stats.balance)}
                                    </p>
                                </div>
                                <div className={`flex items-center gap-1 text-xs sm:text-sm font-semibold px-2.5 sm:px-3 py-1.5 rounded-full shrink-0 ${stats.balance >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                    {stats.balance >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {savingsRate}% saved
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card bg-base-200 border border-base-content/10 shadow-sm p-4 sm:p-6">
                        <h3 className="font-bold text-base-content mb-4 sm:mb-5">Quick Actions</h3>
                        <div className="space-y-2 sm:space-y-3">
                            <Link
                                to="/dashboard/add-transaction"
                                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                            >
                                <TrendingUp size={17} />
                                Add Income
                            </Link>
                            <Link
                                to="/dashboard/add-transaction"
                                className="flex items-center gap-3 p-3 rounded-xl bg-base-100 border border-base-content/10 text-base-content text-sm font-semibold hover:border-blue-400 transition-colors"
                            >
                                <TrendingDown size={17} />
                                Add Expense
                            </Link>
                            <Link
                                to="/dashboard/categories"
                                className="flex items-center gap-3 p-3 rounded-xl bg-base-100 border border-base-content/10 text-base-content text-sm font-semibold hover:border-blue-400 transition-colors"
                            >
                                <PieChart size={17} />
                                Manage Categories
                            </Link>

                            <div className="pt-3 border-t border-base-content/10 space-y-2">
                                <div className="flex justify-between text-xs sm:text-sm">
                                    <span className="text-base-content/60">Avg. Income</span>
                                    <span className="font-semibold">{stats.incomeCount > 0 ? fmt(stats.totalIncome / stats.incomeCount) : fmt(0)}</span>
                                </div>
                                <div className="flex justify-between text-xs sm:text-sm">
                                    <span className="text-base-content/60">Avg. Expense</span>
                                    <span className="font-semibold">{stats.expenseCount > 0 ? fmt(stats.totalExpense / stats.expenseCount) : fmt(0)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="card bg-base-200 border border-base-content/10 shadow-sm p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-2 mb-4 sm:mb-6">
                        <div>
                            <h3 className="font-bold text-base-content text-base sm:text-lg leading-tight">Recent Transactions</h3>
                            <p className="text-[10px] sm:text-xs text-base-content/40 mt-0.5">{transactions.length} total records</p>
                        </div>
                        <Link
                            to="/dashboard/transactions"
                            className="text-[11px] sm:text-xs font-semibold text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-400 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all whitespace-nowrap shrink-0 mt-0.5"
                        >
                            View all →
                        </Link>
                    </div>

                    {transactions.length === 0 ? (
                        <div className="text-center py-10 sm:py-14">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-base-300 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Wallet size={24} className="text-base-content/30" />
                            </div>
                            <p className="text-base-content/50 font-semibold text-sm sm:text-base">No transactions yet</p>
                            <p className="text-base-content/30 text-xs sm:text-sm mt-1">Add your first one to get started</p>
                            <Link
                                to="/dashboard/add-transaction"
                                className="inline-block mt-4 text-sm font-semibold text-blue-600 hover:underline"
                            >
                                + Add Transaction
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Desktop — md and above */}
                            <div className="hidden md:block">
                                <div className="grid grid-cols-[1.5rem_1fr_1fr_2fr_5rem_7rem] gap-x-3 lg:gap-x-4 px-4 pb-2 text-[10px] uppercase tracking-widest text-base-content/30 font-bold">
                                    <span>#</span>
                                    <span>Date</span>
                                    <span>Category</span>
                                    <span>Description</span>
                                    <span>Type</span>
                                    <span className="text-right">Amount</span>
                                </div>
                                <div className="space-y-1.5">
                                    {transactions.slice(0,3).map((t, i) => (
                                        <div
                                            key={t._id || i}
                                            className="grid grid-cols-[1.5rem_1fr_1fr_2fr_5rem_7rem] gap-x-3 lg:gap-x-4 items-center bg-base-100 hover:bg-base-300/40 border border-base-content/5 hover:border-base-content/10 rounded-xl px-4 py-3 transition-all duration-150"
                                        >
                                            <span className="text-xs text-base-content/30 font-semibold">{i + 1}</span>
                                            <span className="text-xs lg:text-sm text-base-content/60 truncate">{fmtDate(t.date)}</span>
                                            <span className="text-xs lg:text-sm font-semibold text-base-content truncate">{t.category}</span>
                                            <span className="text-xs lg:text-sm text-base-content/50 truncate">{t.description || '—'}</span>
                                            <span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                                    {t.type}
                                                </span>
                                            </span>
                                            <span className={`text-right text-xs lg:text-sm font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                                                {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile — below md */}
                            <div className="md:hidden space-y-2">
                                {transactions.slice(0, 3).map((t, i) => (
                                    <div
                                        key={t._id || i}
                                        className="flex items-center gap-2.5 bg-base-100 border border-base-content/5 rounded-xl px-3 py-3"
                                    >
                                        {/* Icon — hidden on very small, shown from xs */}
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${t.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                                            {t.type === 'income'
                                                ? <TrendingUp size={14} className="text-green-600" />
                                                : <TrendingDown size={14} className="text-red-500" />
                                            }
                                        </div>

                                        {/* Text — middle */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-semibold text-base-content truncate leading-tight">
                                                {t.category}
                                            </p>
                                            <p className="text-[11px] text-base-content/40 mt-0.5 truncate">
                                                {fmtDate(t.date)}
                                            </p>
                                        </div>

                                        {/* Amount + badge — right side */}
                                        <div className="text-right shrink-0 max-w-[90px]">
                                            <p className={`text-[13px] font-bold tabular-nums leading-tight ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                                                {t.type === 'income' ? '+' : '-'}{fmtCompact(t.amount)}
                                            </p>
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 inline-block ${t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                                {t.type}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default DashboardHome;