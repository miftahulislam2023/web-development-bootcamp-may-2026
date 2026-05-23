import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import axios from "axios";
import FinancialSummary from "./FinancialSummary";
import InsightsActions from "./InsightsActions";
import RecentTransactions from "./RecentTransactions";

const DashboardHome = () => {
    const { user } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        totalIncome: 0, totalExpense: 0, balance: 0,
        transactionCount: 0, incomeCount: 0, expenseCount: 0
    });
    const [monthlyData, setMonthlyData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [insights, setInsights] = useState({
        topCategory: '', topCategoryAmount: 0,
        avgDailyExpense: 0, savingsMessage: ''
    });

    useEffect(() => {
        if (!user?.email) return;
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `https://cashnivo.vercel.app/transactions?email=${user.email}`,
                    { signal: controller.signal }
                );
                const data = Array.isArray(res.data) ? res.data : [];

                // Calculate stats
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

                // Monthly data (last 3 months)
                const monthArray = [];
                const now = new Date();
                
                // Create array of last 3 months
                for (let i = 2; i >= 0; i--) {
                    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    const monthStr = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                    monthArray.push({ month: monthStr, income: 0, expense: 0, monthNum: date.getMonth(), yearNum: date.getFullYear() });
                }

                // Add transaction data to months
                data.forEach(t => {
                    const tDate = new Date(t.date);
                    const tMonth = tDate.getMonth();
                    const tYear = tDate.getFullYear();
                    const amt = parseFloat(t.amount) || 0;
                    
                    monthArray.forEach(m => {
                        if (m.monthNum === tMonth && m.yearNum === tYear) {
                            if (t.type === 'income') m.income += amt;
                            else m.expense += amt;
                        }
                    });
                });
                
                setMonthlyData(monthArray);

                // Category breakdown
                const catMap = {};
                data.filter(t => t.type === 'expense').forEach(t => {
                    catMap[t.category] = (catMap[t.category] || 0) + (parseFloat(t.amount) || 0);
                });
                const catArray = Object.entries(catMap).map(([name, value]) => ({ name, value }))
                    .sort((a, b) => b.value - a.value);
                setCategoryData(catArray);

                // Insights
                const topCat = catArray[0];
                const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                const thisMonthExpense = data
                    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === now.getMonth())
                    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
                const avgDaily = thisMonthExpense / daysInMonth;
                const savingsRate = s.totalIncome > 0 ? Math.round((s.balance / s.totalIncome) * 100) : 0;

                setInsights({
                    topCategory: topCat?.name || 'N/A',
                    topCategoryAmount: topCat?.value || 0,
                    avgDailyExpense: avgDaily,
                    savingsMessage: savingsRate >= 20 ? '💪 Great savings rate!' : savingsRate >= 10 ? '👍 Good progress' : '📈 Keep improving'
                });
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
    const fmtDate = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Skeleton loader
    const SkeletonCard = () => (
        <div className="card bg-base-200 border border-base-content/10 p-4 sm:p-5 animate-pulse">
            <div className="h-10 bg-base-300 rounded-lg mb-3"></div>
            <div className="h-6 bg-base-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-base-300 rounded w-1/2"></div>
        </div>
    );

    if (loading) return (
        <div className="min-h-screen bg-base-100 px-3 py-6 sm:px-6 lg:px-10">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                <div className="h-10 bg-base-200 rounded w-1/3 animate-pulse"></div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4">
                    {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 card bg-base-200 border border-base-content/10 p-6 h-80 animate-pulse"></div>
                    <div className="card bg-base-200 border border-base-content/10 p-6 h-80 animate-pulse"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-base-100 px-3 py-6 sm:px-6 lg:px-10">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">

                {/* Header */}
                <div>
                    <p className="text-xs sm:text-sm uppercase tracking-[0.2em] font-extrabold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        Cashnivo
                    </p>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white">Dashboard</h1>
                    <p className="mt-1 text-sm text-base-content/60 dark:text-base-content/50">
                        Welcome back, <span className="font-semibold text-base-content dark:text-base-content/90">{user?.displayName || 'User'}</span>!
                    </p>
                </div>

                {error && <div className="alert alert-error text-sm"><span>{error}</span></div>}

                {/* Financial Summary Component */}
                <FinancialSummary stats={stats} monthlyData={monthlyData} categoryData={categoryData} fmt={fmt} />

                {/* Insights & Actions Component */}
                <InsightsActions insights={insights} fmt={fmt} />

                {/* Recent Transactions Component */}
                <RecentTransactions transactions={transactions} fmt={fmt} fmtCompact={fmtCompact} fmtDate={fmtDate} />

            </div>
        </div>
    );
};

export default DashboardHome;
