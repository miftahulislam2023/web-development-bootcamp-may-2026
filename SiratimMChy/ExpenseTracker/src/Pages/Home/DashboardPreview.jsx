import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../Provider/AuthProvider';
import axios from 'axios';
import { TrendingUp, TrendingDown, Wallet, Target, ArrowUpRight, Zap } from 'lucide-react';
import { Link } from 'react-router';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, BarChart, Bar } from 'recharts';

const DashboardPreview = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [currentMonthStats, setCurrentMonthStats] = useState(null);
    const [monthlyData, setMonthlyData] = useState([]);
    const [categoryExpenseData, setCategoryExpenseData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) {
            return;
        }

        const fetchStats = async () => {
            try {
                const res = await axios.get(
                    `https://cashnivo.vercel.app/transactions?email=${encodeURIComponent(user.email)}`
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

                // Calculate current month stats
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();
                
                const currentMonthData = data.filter(t => {
                    const tDate = new Date(t.date);
                    return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
                });

                const cms = currentMonthData.reduce((acc, t) => {
                    const amt = parseFloat(t.amount) || 0;
                    if (t.type === 'income') { acc.totalIncome += amt; acc.incomeCount++; }
                    else if (t.type === 'expense') { acc.totalExpense += amt; acc.expenseCount++; }
                    acc.transactionCount++;
                    return acc;
                }, { totalIncome: 0, totalExpense: 0, balance: 0, transactionCount: 0, incomeCount: 0, expenseCount: 0 });

                cms.balance = cms.totalIncome - cms.totalExpense;
                setCurrentMonthStats(cms);

                // Monthly data (last 2 months)
                const monthArray = [];
                
                for (let i = 1; i >= 0; i--) {
                    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    const monthStr = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                    monthArray.push({ month: monthStr, income: 0, expense: 0, monthNum: date.getMonth(), yearNum: date.getFullYear() });
                }

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

                // Category expense breakdown (last 3 months)
                const categoryMap = {};
                data.filter(t => t.type === 'expense').forEach(t => {
                    const tDate = new Date(t.date);
                    const tMonth = tDate.getMonth();
                    const tYear = tDate.getFullYear();
                    const amt = parseFloat(t.amount) || 0;
                    
                    monthArray.forEach(m => {
                        if (m.monthNum === tMonth && m.yearNum === tYear) {
                            const key = t.category || 'Other';
                            if (!categoryMap[key]) categoryMap[key] = {};
                            categoryMap[key][m.month] = (categoryMap[key][m.month] || 0) + amt;
                        }
                    });
                });

                // Transform category data for line chart
                const categoryChartData = monthArray.map(m => ({ month: m.month }));
                Object.entries(categoryMap).forEach(([category, monthData]) => {
                    monthArray.forEach(m => {
                        categoryChartData.find(c => c.month === m.month)[category] = monthData[m.month] || 0;
                    });
                });
                setCategoryExpenseData(categoryChartData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user?.email]);

    const fmt = amt => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt);

    if (!user) {
        return null;
    }

    if (loading) {
        return (
            <section className="relative bg-base-100 px-4 py-24 lg:px-10 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-600/5 blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-cyan-600/5 blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-200 border border-base-content/10 mb-4">
                            <Zap size={16} className="text-blue-600" />
                            <span className="text-xs font-semibold text-base-content/60">Your Dashboard</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-base-content mt-4">Financial Snapshot</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="card bg-base-200 p-6 h-40 rounded-2xl"></div>
                        ))}
                    </div>
                    <div className="card bg-base-200 p-6 h-96 animate-pulse rounded-2xl"></div>
                </div>
            </section>
        );
    }

    if (!stats) {
        return null;
    }

    return (
        <section className="relative bg-base-100 px-4 py-24 lg:px-10 overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-600/5 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-cyan-600/5 blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-200 border border-base-content/10 mb-4">
                        <Zap size={16} className="text-blue-600" />
                        <span className="text-xs font-semibold text-base-content/60">Your Dashboard</span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-base-content mt-4">Financial Snapshot</h2>
                    <p className="mt-4 text-base-content/60 max-w-2xl mx-auto">
                        Real-time overview of your finances
                    </p>
                </div>

                {/* Stats Pie Chart Card */}
                <div className="card bg-base-200 dark:bg-base-200/50 border border-base-content/10 dark:border-base-content/20 shadow-sm p-8 mb-8 rounded-2xl">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-base-content dark:text-base-content/90">Financial Overview</h3>
                        <p className="text-sm text-base-content/60 dark:text-base-content/50 mt-2">Current Month - Income, Expense & Savings Rate</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Pie Chart */}
                        <div className="flex items-center justify-center">
                            {currentMonthStats && (currentMonthStats.totalIncome > 0 || currentMonthStats.totalExpense > 0) ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Income', value: currentMonthStats.totalIncome || 0, fill: '#10b981' },
                                                { name: 'Expense', value: currentMonthStats.totalExpense || 0, fill: '#ef4444' }
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={100}
                                            dataKey="value"
                                        />
                                        <Tooltip formatter={(value) => fmt(value)} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-80 text-base-content/50">
                                    <p>No data available for current month</p>
                                </div>
                            )}
                        </div>

                        {/* Stats Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                {
                                    label: 'Current Balance',
                                    value: fmt(currentMonthStats?.balance || 0),
                                    icon: <Wallet size={24} className="text-white" />,
                                    iconBg: 'bg-linear-to-br from-blue-600 to-cyan-600',
                                    valueClass: (currentMonthStats?.balance || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
                                },
                                {
                                    label: 'Month Income',
                                    value: fmt(currentMonthStats?.totalIncome || 0),
                                    icon: <TrendingUp size={24} className="text-white" />,
                                    iconBg: 'bg-linear-to-br from-green-600 to-teal-600',
                                    valueClass: 'text-green-600 dark:text-green-400'
                                },
                                {
                                    label: 'Month Expense',
                                    value: fmt(currentMonthStats?.totalExpense || 0),
                                    icon: <TrendingDown size={24} className="text-white" />,
                                    iconBg: 'bg-linear-to-br from-red-600 to-orange-600',
                                    valueClass: 'text-red-500 dark:text-red-400'
                                },
                                {
                                    label: 'Savings Rate',
                                    value: `${(currentMonthStats?.totalIncome || 0) > 0 ? Math.round(((currentMonthStats?.balance || 0) / (currentMonthStats?.totalIncome || 1)) * 100) : 0}%`,
                                    icon: <Target size={24} className="text-white" />,
                                    iconBg: 'bg-linear-to-br from-purple-600 to-pink-600',
                                    valueClass: 'text-purple-600 dark:text-purple-400'
                                },
                            ].map((card, i) => (
                                <div key={i} className="group relative bg-base-100 dark:bg-base-100/50 border border-base-content/10 dark:border-base-content/20 shadow-sm hover:shadow-lg transition-all duration-300 p-4 rounded-xl overflow-hidden">
                                    <div className="absolute inset-0 bg-linear-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="relative">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.iconBg} shadow-lg`}>
                                                {card.icon}
                                            </div>
                                        </div>
                                        <p className="text-xs uppercase tracking-widest text-base-content/50 dark:text-base-content/50 font-bold mb-1">
                                            {card.label}
                                        </p>
                                        <p className={`text-xl font-bold ${card.valueClass}`}>{card.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Chart and Transaction Summary Side by Side */}
                {monthlyData.length > 0 && categoryExpenseData.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* Expense Breakdown Chart - Left Side (2 columns) */}
                        <div className="lg:col-span-2 card bg-base-200 dark:bg-base-200/50 border border-base-content/10 dark:border-base-content/20 shadow-sm p-8 rounded-2xl">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-base-content dark:text-base-content/90">Expense Breakdown by Category</h3>
                                <p className="text-sm text-base-content/60 dark:text-base-content/50 mt-2">Last 2 months category trends</p>
                            </div>
                            {Object.keys(categoryExpenseData[0] || {}).filter(key => key !== 'month').length > 0 ? (
                                <>
                                    {/* Desktop - Horizontal Bar Chart */}
                                    <div className="hidden lg:block">
                                        <ResponsiveContainer width="100%" height={450}>
                                            <BarChart 
                                                data={categoryExpenseData} 
                                                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
                                                <XAxis dataKey="month" stroke="rgba(0,0,0,0.5)" style={{ fontSize: '13px', fontWeight: '500' }} />
                                                <YAxis stroke="rgba(0,0,0,0.5)" style={{ fontSize: '13px' }} />
                                                <Tooltip 
                                                    contentStyle={{ 
                                                        backgroundColor: 'rgba(0,0,0,0.9)', 
                                                        border: 'none', 
                                                        borderRadius: '12px', 
                                                        color: '#fff',
                                                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                                                        padding: '12px 16px'
                                                    }} 
                                                    formatter={(value) => fmt(value)}
                                                    labelStyle={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}
                                                />
                                                <Legend wrapperStyle={{ paddingTop: '24px' }} />
                                                {Object.keys(categoryExpenseData[0] || {}).filter(key => key !== 'month').map((category, idx) => {
                                                    const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#06b6d4', '#0ea5e9', '#3b82f6', '#8b5cf6', '#ec4899'];
                                                    return (
                                                        <Bar 
                                                            key={category}
                                                            dataKey={category} 
                                                            fill={colors[idx % colors.length]}
                                                            radius={[8, 8, 0, 0]}
                                                            isAnimationActive={true}
                                                        />
                                                    );
                                                })}
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Mobile - Horizontal Bar Chart */}
                                    <div className="lg:hidden">
                                        <ResponsiveContainer width="100%" height={450}>
                                            <BarChart 
                                                data={categoryExpenseData} 
                                                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                                                layout="vertical"
                                            >
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
                                                <XAxis type="number" stroke="rgba(0,0,0,0.5)" style={{ fontSize: '12px' }} />
                                                <YAxis dataKey="month" type="category" stroke="rgba(0,0,0,0.5)" style={{ fontSize: '12px' }} width={50} />
                                                <Tooltip 
                                                    contentStyle={{ 
                                                        backgroundColor: 'rgba(0,0,0,0.9)', 
                                                        border: 'none', 
                                                        borderRadius: '12px', 
                                                        color: '#fff',
                                                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                                                        padding: '12px 16px'
                                                    }} 
                                                    formatter={(value) => fmt(value)}
                                                    labelStyle={{ color: '#fff', fontSize: '12px', fontWeight: '600' }}
                                                />
                                                <Legend 
                                                    layout="horizontal"
                                                    wrapperStyle={{ paddingTop: '24px', fontSize: '12px', width: '100%', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }} 
                                                />
                                                {Object.keys(categoryExpenseData[0] || {}).filter(key => key !== 'month').map((category, idx) => {
                                                    const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#06b6d4', '#0ea5e9', '#3b82f6', '#8b5cf6', '#ec4899'];
                                                    return (
                                                        <Bar 
                                                            key={category}
                                                            dataKey={category} 
                                                            fill={colors[idx % colors.length]}
                                                            radius={[0, 8, 8, 0]}
                                                            isAnimationActive={true}
                                                        />
                                                    );
                                                })}
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-80 text-base-content/50 dark:text-base-content/40">
                                    <p>No expense data available for the last 2 months</p>
                                </div>
                            )}
                        </div>

                        {/* Transaction Summary Card - Right Side (1 column) */}
                        <div className="card bg-base-200 dark:bg-base-200/50 border border-base-content/10 dark:border-base-content/20 shadow-sm p-8 rounded-2xl">
                            <h3 className="text-2xl font-bold text-base-content dark:text-base-content/90 mb-6">Transaction Summary</h3>
                            <div className="flex flex-col gap-6">
                                {[
                                    {
                                        icon: <Wallet size={20} className="text-white" />,
                                        bg: 'bg-linear-to-br from-blue-600 to-cyan-600',
                                        label: 'Total Transactions',
                                        value: stats.transactionCount,
                                        subtext: 'All recorded transactions'
                                    },
                                    {
                                        icon: <TrendingUp size={20} className="text-white" />,
                                        bg: 'bg-linear-to-br from-green-600 to-teal-600',
                                        label: 'Income Entries',
                                        value: stats.incomeCount,
                                        subtext: `Avg: ${fmt(stats.totalIncome / (stats.incomeCount || 1))}`
                                    },
                                    {
                                        icon: <TrendingDown size={20} className="text-white" />,
                                        bg: 'bg-linear-to-br from-red-600 to-orange-600',
                                        label: 'Expense Entries',
                                        value: stats.expenseCount,
                                        subtext: `Avg: ${fmt(stats.totalExpense / (stats.expenseCount || 1))}`
                                    },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex flex-col items-start pb-4 border-b border-base-content/10 last:border-b-0 last:pb-0">
                                        <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-3 shadow-lg`}>
                                            {item.icon}
                                        </div>
                                        <p className="text-xs uppercase tracking-widest text-base-content/60 dark:text-base-content/50 font-bold mb-1">
                                            {item.label}
                                        </p>
                                        <p className="text-2xl font-bold text-base-content dark:text-base-content/90 mb-1">{item.value}</p>
                                        <p className="text-xs text-base-content/50 dark:text-base-content/50">{item.subtext}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* CTA Section */}
                <div className="text-center">
                    <Link
                        to="/dashboard/dashboardhome"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <span>View Full Dashboard</span>
                        <ArrowUpRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default DashboardPreview;
