import { Link } from "react-router";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

const RecentTransactions = ({ transactions, fmt, fmtCompact, fmtDate }) => {
    return (
        <div className="card bg-base-200 dark:bg-base-200/50 border border-base-content/10 dark:border-base-content/20 shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between gap-2 mb-6">
                <div>
                    <h3 className="font-bold text-base-content dark:text-base-content/90 text-base sm:text-lg">Recent Transactions</h3>
                    <p className="text-[10px] sm:text-xs text-base-content/50 dark:text-base-content/50 mt-1">{transactions.length} total records</p>
                </div>
                <Link
                    to="/dashboard/transactions"
                    className="text-[11px] sm:text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-500/30 hover:border-blue-400 dark:hover:border-blue-400 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all whitespace-nowrap bg-blue-50 dark:bg-blue-500/10"
                >
                    View all →
                </Link>
            </div>

            {transactions.length === 0 ? (
                <div className="text-center py-12 sm:py-16">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-base-300 dark:bg-base-300/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Wallet size={28} className="text-base-content/30 dark:text-base-content/40" />
                    </div>
                    <p className="text-base-content/70 dark:text-base-content/60 font-semibold text-sm sm:text-base">No transactions yet</p>
                    <p className="text-base-content/50 dark:text-base-content/50 text-xs sm:text-sm mt-2">Add your first one to get started</p>
                    <Link
                        to="/dashboard/add-transaction"
                        className="inline-block mt-5 px-4 py-2 text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-cyan-600 hover:opacity-90 rounded-lg transition-opacity"
                    >
                        + Add Transaction
                    </Link>
                </div>
            ) : (
                <>
                    {/* Desktop */}
                    <div className="hidden md:block space-y-2">
                        {transactions.slice(0, 3).map((t, i) => (
                            <div
                                key={t._id || i}
                                className="flex items-center gap-3 sm:gap-4 bg-base-100 dark:bg-base-100/50 hover:bg-base-300/30 dark:hover:bg-base-300/20 border border-base-content/5 dark:border-base-content/10 hover:border-base-content/10 dark:hover:border-base-content/20 rounded-xl px-4 py-3 transition-all duration-200 group"
                            >
                                {/* Icon */}
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${t.type === 'income' 
                                    ? 'bg-green-100 dark:bg-green-500/20' 
                                    : 'bg-red-100 dark:bg-red-500/20'}`}>
                                    {t.type === 'income'
                                        ? <TrendingUp size={18} className="text-green-600 dark:text-green-400" />
                                        : <TrendingDown size={18} className="text-red-500 dark:text-red-400" />
                                    }
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-base-content dark:text-base-content/90 truncate">{t.description || t.category}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-base-content/60 dark:text-base-content/50">{t.category}</span>
                                        <span className="text-xs text-base-content/40 dark:text-base-content/40">•</span>
                                        <span className="text-xs text-base-content/60 dark:text-base-content/50">{fmtDate(t.date)}</span>
                                    </div>
                                </div>

                                {/* Type Badge */}
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${t.type === 'income' 
                                    ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' 
                                    : 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'}`}>
                                    {t.type}
                                </span>

                                {/* Amount */}
                                <span className={`text-right text-sm font-bold tabular-nums shrink-0 ${t.type === 'income' 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : 'text-red-500 dark:text-red-400'}`}>
                                    {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden space-y-2.5">
                        {transactions.slice(0, 4).map((t, i) => (
                            <div
                                key={t._id || i}
                                className="flex items-center gap-3 bg-base-100 dark:bg-base-100/50 hover:bg-base-300/30 dark:hover:bg-base-300/20 border border-base-content/5 dark:border-base-content/10 hover:border-base-content/10 dark:hover:border-base-content/20 rounded-xl px-3 py-3 transition-all duration-200"
                            >
                                {/* Icon */}
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${t.type === 'income' 
                                    ? 'bg-green-100 dark:bg-green-500/20' 
                                    : 'bg-red-100 dark:bg-red-500/20'}`}>
                                    {t.type === 'income'
                                        ? <TrendingUp size={16} className="text-green-600 dark:text-green-400" />
                                        : <TrendingDown size={16} className="text-red-500 dark:text-red-400" />
                                    }
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-semibold text-base-content dark:text-base-content/90 truncate">{t.description || t.category}</p>
                                    <p className="text-[11px] text-base-content/50 dark:text-base-content/50 mt-0.5 truncate">{t.category} • {fmtDate(t.date)}</p>
                                </div>

                                {/* Amount + Badge */}
                                <div className="text-right shrink-0">
                                    <p className={`text-[13px] font-bold tabular-nums ${t.type === 'income' 
                                        ? 'text-green-600 dark:text-green-400' 
                                        : 'text-red-500 dark:text-red-400'}`}>
                                        {t.type === 'income' ? '+' : '-'}{fmtCompact(t.amount)}
                                    </p>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1 inline-block ${t.type === 'income' 
                                        ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' 
                                        : 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'}`}>
                                        {t.type}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default RecentTransactions;
