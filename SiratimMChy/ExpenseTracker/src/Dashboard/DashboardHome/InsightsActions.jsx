import { Link } from "react-router";
import { TrendingUp, TrendingDown, Zap, Target } from "lucide-react";

const InsightsActions = ({ insights, fmt }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Insights */}
            <div className="card bg-base-200 dark:bg-base-200/50 border border-base-content/10 dark:border-base-content/20 shadow-sm p-4 sm:p-6">
                <h3 className="font-bold text-base-content dark:text-base-content/90 mb-4 text-base sm:text-lg">Insights</h3>
                <div className="space-y-3">
                    <div className="bg-base-100 dark:bg-base-100/50 rounded-xl p-3 border border-base-content/5 dark:border-base-content/10">
                        <p className="text-xs text-base-content/60 dark:text-base-content/50 uppercase tracking-wide mb-1">Top Spending</p>
                        <p className="text-sm font-bold text-base-content dark:text-base-content/90">{insights.topCategory}</p>
                        <p className="text-xs text-base-content/40 dark:text-base-content/50 mt-1">{fmt(insights.topCategoryAmount)}</p>
                    </div>
                    <div className="bg-base-100 dark:bg-base-100/50 rounded-xl p-3 border border-base-content/5 dark:border-base-content/10">
                        <p className="text-xs text-base-content/60 dark:text-base-content/50 uppercase tracking-wide mb-1">Avg Daily Expense</p>
                        <p className="text-sm font-bold text-base-content dark:text-base-content/90">{fmt(insights.avgDailyExpense)}</p>
                    </div>
                    <div className="bg-linear-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 rounded-xl p-3 border border-blue-200/30 dark:border-blue-500/30">
                        <p className="text-sm font-semibold text-base-content dark:text-base-content/90">{insights.savingsMessage}</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-2 card bg-base-200 dark:bg-base-200/50 border border-base-content/10 dark:border-base-content/20 shadow-sm p-4 sm:p-6">
                <h3 className="font-bold text-base-content dark:text-base-content/90 mb-4 text-base sm:text-lg">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <Link
                        to="/dashboard/add-transaction"
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-linear-to-r from-blue-600 to-cyan-600 text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                        <TrendingUp size={16} />
                        <span>Add Income</span>
                    </Link>
                    <Link
                        to="/dashboard/add-transaction"
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-base-100 dark:bg-base-100/50 border border-base-content/10 dark:border-base-content/20 text-base-content dark:text-base-content/90 text-xs sm:text-sm font-semibold hover:border-blue-400 dark:hover:border-blue-400 transition-colors"
                    >
                        <TrendingDown size={16} />
                        <span>Add Expense</span>
                    </Link>
                    <Link
                        to="/dashboard/transactions"
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-base-100 dark:bg-base-100/50 border border-base-content/10 dark:border-base-content/20 text-base-content dark:text-base-content/90 text-xs sm:text-sm font-semibold hover:border-blue-400 dark:hover:border-blue-400 transition-colors"
                    >
                        <Zap size={16} />
                        <span>All Transactions</span>
                    </Link>
                    <Link
                        to="/dashboard/categories"
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-base-100 dark:bg-base-100/50 border border-base-content/10 dark:border-base-content/20 text-base-content dark:text-base-content/90 text-xs sm:text-sm font-semibold hover:border-blue-400 dark:hover:border-blue-400 transition-colors"
                    >
                        <Target size={16} />
                        <span>Categories</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default InsightsActions;
