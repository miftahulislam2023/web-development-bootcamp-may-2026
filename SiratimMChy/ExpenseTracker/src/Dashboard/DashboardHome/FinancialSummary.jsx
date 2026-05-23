import { ArrowDownRight, ArrowUpRight, TrendingDown, TrendingUp, Wallet, Target } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

const FinancialSummary = ({ stats, monthlyData, categoryData, fmt }) => {
    const savingsRate = stats.totalIncome > 0 ? Math.round((stats.balance / stats.totalIncome) * 100) : 0;
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check initial theme
        const checkTheme = () => {
            const theme = document.documentElement.getAttribute('data-theme');
            setIsDark(theme === 'dark');
        };
        
        checkTheme();
        
        // Listen for theme changes
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        
        return () => observer.disconnect();
    }, []);

    // Theme-aware colors - lighter for dark mode, vibrant for light mode
    const COLORS = isDark 
        ? ['#60a5fa', '#22d3ee', '#4ade80', '#fbbf24', '#f87171', '#a78bfa', '#f472b6', '#2dd4bf']
        : ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

    return (
        <>
            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                    {
                        label: 'Total Balance', value: fmt(stats.balance),
                        icon: <Wallet size={20} className="text-white" />,
                        iconBg: 'bg-linear-to-br from-blue-600 to-cyan-600',
                        trend: stats.balance >= 0 ? 'up' : 'down',
                        valueClass: stats.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
                    },
                    {
                        label: 'Total Income', value: fmt(stats.totalIncome),
                        icon: <TrendingUp size={20} className="text-white" />,
                        iconBg: 'bg-linear-to-br from-green-600 to-teal-600',
                        trend: 'up',
                        valueClass: 'text-green-600 dark:text-green-400'
                    },
                    {
                        label: 'Total Expense', value: fmt(stats.totalExpense),
                        icon: <TrendingDown size={20} className="text-white" />,
                        iconBg: 'bg-linear-to-br from-red-600 to-orange-600',
                        trend: 'down',
                        valueClass: 'text-red-500 dark:text-red-400'
                    },
                    {
                        label: 'Savings Rate', value: `${savingsRate}%`,
                        icon: <Target size={20} className="text-white" />,
                        iconBg: 'bg-linear-to-br from-purple-600 to-pink-600',
                        trend: savingsRate >= 20 ? 'up' : 'down',
                        valueClass: 'text-purple-600 dark:text-purple-400'
                    },
                ].map((card, i) => (
                    <div key={i} className="card bg-base-200 dark:bg-base-200/50 border border-base-content/10 dark:border-base-content/20 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                                {card.icon}
                            </div>
                            <div className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${card.trend === 'up' ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'}`}>
                                {card.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            </div>
                        </div>
                        <p className="text-[10px] sm:text-xs uppercase tracking-widest text-base-content/50 dark:text-base-content/50 font-semibold mb-1">
                            {card.label}
                        </p>
                        <p className={`text-lg sm:text-2xl font-bold ${card.valueClass}`}>{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Monthly Chart */}
                <div className="lg:col-span-2 card bg-base-200 dark:bg-base-200/50 border border-base-content/10 dark:border-base-content/20 shadow-sm p-4 sm:p-6">
                    <h3 className="font-bold text-base-content dark:text-base-content/90 mb-4 text-base sm:text-lg">Income vs Expense (3 Months)</h3>
                    {monthlyData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                                <XAxis dataKey="month" stroke="rgba(0,0,0,0.6)" style={{ fontSize: '12px' }} />
                                <YAxis stroke="rgba(0,0,0,0.6)" style={{ fontSize: '12px' }} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'rgba(0,0,0,0.8)', 
                                        border: 'none', 
                                        borderRadius: '8px', 
                                        color: '#fff',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                    }} 
                                    formatter={(value) => fmt(value)}
                                />
                                <Legend wrapperStyle={{ paddingTop: '16px' }} />
                                <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-80 flex items-center justify-center text-base-content/40 dark:text-base-content/50">No data available</div>
                    )}
                </div>

                {/* Expense Breakdown */}
                <div className="card bg-base-200 dark:bg-base-200/50 border border-base-content/10 dark:border-base-content/20 shadow-sm p-4 sm:p-6">
                    <h3 className="font-bold text-base-content dark:text-base-content/90 mb-4 text-base sm:text-lg">Expense Breakdown</h3>
                    {categoryData.length > 0 ? (
                        <div className="space-y-4">
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2} dataKey="value" label={false}>
                                        {categoryData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => fmt(value)} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                {categoryData.map((cat, idx) => (
                                    <div key={cat.name} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-base-content dark:text-base-content/90 truncate">{cat.name}</p>
                                            <p className="text-base-content/60 dark:text-base-content/50">{fmt(cat.value)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-80 flex items-center justify-center text-base-content/40">No expenses yet</div>
                    )}
                </div>
            </div>
        </>
    );
};

export default FinancialSummary;
