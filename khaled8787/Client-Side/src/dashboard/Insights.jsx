import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  BadgeDollarSign,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck
} from "lucide-react";
import api from "../services/api";

export default function Insights() {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/transactions/all");
      setTransactions(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((acc, item) => acc + item.amount, 0);

  const expense = transactions
    .filter((item) => item.type === "expense")
    .reduce((acc, item) => acc + item.amount, 0);

  const savings = income - expense;

  const categoryTotals = {};
  transactions.forEach((item) => {
    if (item.type === "expense") {
      categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
    }
  });

  const highestCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  const insights = [];

  if (highestCategory) {
    insights.push({
      icon: AlertTriangle,
      title: "Highest Spending Category",
      message: `You spent the most on "${highestCategory[0]}" this month. Consider reviewing this area.`,
      variant: "warning",
      gradient: "from-amber-500/20 to-transparent",
      textColor: "text-amber-400",
      borderColor: "border-amber-500/20"
    });
  }

  if (savings > income * 0.3) {
    insights.push({
      icon: TrendingUp,
      title: "Great Savings Rate",
      message: "Excellent! Your savings rate is above 30%. You're building a strong safety net.",
      variant: "success",
      gradient: "from-emerald-500/20 to-transparent",
      textColor: "text-emerald-400",
      borderColor: "border-emerald-500/20"
    });
  }

  if (expense > income) {
    insights.push({
      icon: TrendingDown,
      title: "Overspending Alert",
      message: "Critical: Your expenses have exceeded your net income. We recommend pausing non-essential costs.",
      variant: "critical",
      gradient: "from-rose-500/20 to-transparent",
      textColor: "text-rose-400",
      borderColor: "border-rose-500/20"
    });
  }

  if (expense < income * 0.5 && income > 0) {
    insights.push({
      icon: BadgeDollarSign,
      title: "Healthy Financial Status",
      message: "Fantastic! You are keeping your burn rate below 50% of your total revenue stream.",
      variant: "info",
      gradient: "from-cyan-500/20 to-transparent",
      textColor: "text-cyan-400",
      borderColor: "border-cyan-500/20"
    });
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/30 rounded-[2rem] blur-xl animate-pulse"></div>
            <div className="relative bg-gradient-to-tr from-cyan-600 to-blue-500 p-5 rounded-[2rem] shadow-2xl border border-white/10">
              <Brain size={38} className="text-white animate-bounce [animation-duration:4s]" />
            </div>
          </div>
          <div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
              Financial <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Insights</span>
            </h1>
          </div>
        </div>

        <p className="text-gray-500 font-medium max-w-xs md:text-right">
          Autonomous predictive algorithms scanning your monthly financial blueprints.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        
        <div className="group relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 rounded-[2.5rem] p-8 transition-all duration-300">
          <div className="flex items-center justify-between text-gray-500 mb-4">
            <span className="text-xs font-black uppercase tracking-widest">Inflow Assets</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <ArrowUpRight size={18} />
            </div>
          </div>
          <h2 className="text-4xl font-black text-white group-hover:text-emerald-400 transition-colors">
            ৳ {income.toLocaleString()}
          </h2>
          <div className="w-full h-1 bg-white/5 rounded-full mt-6 overflow-hidden">
            <div className="h-full w-full bg-emerald-500 origin-left scale-x-[0.85] transition-transform" />
          </div>
        </div>

        <div className="group relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 rounded-[2.5rem] p-8 transition-all duration-300">
          <div className="flex items-center justify-between text-gray-500 mb-4">
            <span className="text-xs font-black uppercase tracking-widest">Outflow Expenses</span>
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl">
              <ArrowDownRight size={18} />
            </div>
          </div>
          <h2 className="text-4xl font-black text-white group-hover:text-rose-400 transition-colors">
            ৳ {expense.toLocaleString()}
          </h2>
          <div className="w-full h-1 bg-white/5 rounded-full mt-6 overflow-hidden">
            <div className="h-full w-full bg-rose-500 origin-left scale-x-[0.6] transition-transform" />
          </div>
        </div>

        <div className="group relative bg-gradient-to-b from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-[2.5rem] p-8 transition-all duration-300">
          <div className="flex items-center justify-between text-gray-400 mb-4">
            <span className="text-xs font-black uppercase tracking-widest text-cyan-400">Net Reserve Liquidity</span>
            <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-xl">
              <ShieldCheck size={18} />
            </div>
          </div>
          <h2 className="text-4xl font-black text-white">
            ৳ {savings.toLocaleString()}
          </h2>
          <p className="text-[10px] font-black uppercase tracking-wider text-cyan-500/60 mt-6">
            {savings >= 0 ? "Surplus Cap Capital Available" : "Deficit Warning: Action Required"}
          </p>
        </div>

      </div>

      <div className="border-b border-white/5 pb-4 mb-8 flex items-center justify-between">
        <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest">Diagnostic Intel Streams</h3>
        <span className="text-xs text-cyan-500/70 font-bold">{insights.length} Stream Triggers Found</span>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {insights.map((insight, index) => (
          <motion.div
            variants={itemVariants}
            key={index}
            className={`bg-gradient-to-r ${insight.gradient} border ${insight.borderColor} backdrop-blur-md rounded-[2.5rem] p-8 flex flex-col md:flex-row items-start md:items-center gap-6 group hover:bg-white/[0.02] transition-colors`}
          >
            <div className={`p-4 bg-white/5 border border-white/10 rounded-2xl ${insight.textColor} shadow-inner group-hover:scale-105 transition-transform`}>
              <insight.icon size={26} />
            </div>

            <div className="flex-1 space-y-1">
              <h2 className="text-xl font-black text-white tracking-tight">
                {insight.title}
              </h2>
              <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-3xl">
                {insight.message}
              </p>
            </div>

            <div className="text-xs font-black uppercase tracking-widest text-gray-600 border border-white/5 px-4 py-2 rounded-xl hidden lg:block bg-white/[0.01]">
              System Core Notification
            </div>
          </motion.div>
        ))}

        {insights.length === 0 && (
          <div className="py-24 text-center bg-white/[0.01] border border-dashed border-white/10 rounded-[3rem]">
            <Sparkles size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-500 font-bold">Awaiting data feeds. Add more transactions to synthesize insights.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}