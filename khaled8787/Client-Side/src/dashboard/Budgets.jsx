import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wallet, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Target, 
  BadgeDollarSign, 
  TrendingUp 
} from "lucide-react";
import api from "../services/api";

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    limit: "",
  });

  const fetchBudgets = async () => {
    try {
      const res = await api.get("/budgets/all");
      setBudgets(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/budgets/add", formData);
      setFormData({ category: "", limit: "" });
      fetchBudgets();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Budget <span className="text-cyan-400">Limits</span>
          </h1>
          <p className="text-gray-400 mt-2 font-medium">Control your expenses before they control you.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 shadow-2xl">
          <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg">
            <Target size={20} />
          </div>
          <span className="text-white font-bold">{budgets.length} Active Budgets</span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-[2.5rem] p-8 mb-16 relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-end gap-6">
          <div className="flex-1 space-y-2 w-full">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Spending Category</label>
            <div className="relative">
              <BadgeDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="category"
                placeholder="e.g. Shopping, Groceries"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-[#0B1736] border border-white/10 p-4 pl-12 rounded-2xl outline-none text-white focus:border-cyan-500/50 transition-all"
                required
              />
            </div>
          </div>

          <div className="flex-1 space-y-2 w-full">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Monthly Limit (৳)</label>
            <div className="relative">
              <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="number"
                name="limit"
                placeholder="5000"
                value={formData.limit}
                onChange={handleChange}
                className="w-full bg-[#0B1736] border border-white/10 p-4 pl-12 rounded-2xl outline-none text-white focus:border-cyan-500/50 transition-all"
                required
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full md:w-auto px-10 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Add
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence>
          {budgets.map((item) => {
            const percentage = ((item.spent / item.limit) * 100).toFixed(0);
            const isExceeded = item.spent > item.limit;
            const isWarning = percentage >= 80 && !isExceeded;

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={item._id}
                className="group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-[3rem] p-8 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors capitalize">
                      {item.category}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      {isExceeded ? (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-rose-500">
                          <AlertTriangle size={12} /> Limit Exceeded
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-emerald-500">
                          <CheckCircle2 size={12} /> Safe Spending
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Limit</p>
                    <p className="text-xl font-black text-white">৳ {item.limit.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <p className="text-gray-400 text-sm font-medium">
                      Current: <span className={`font-bold ${isExceeded ? 'text-rose-400' : 'text-white'}`}>৳ {item.spent.toLocaleString()}</span>
                    </p>
                    <p className={`text-lg font-black ${isExceeded ? 'text-rose-500' : isWarning ? 'text-amber-500' : 'text-cyan-400'}`}>
                      {percentage}%
                    </p>
                  </div>

                  <div className="relative h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(percentage, 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        isExceeded 
                        ? 'bg-gradient-to-r from-rose-600 to-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]' 
                        : isWarning 
                        ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                        : 'bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      }`}
                    />
                  </div>
                </div>

                {!isExceeded && (
                  <div className="mt-6 flex items-center gap-2 text-gray-500 text-xs font-bold">
                    <TrendingUp size={14} />
                    <span>You can still spend ৳ {(item.limit - item.spent).toLocaleString()} in this category.</span>
                  </div>
                )}

                {isExceeded && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center gap-3"
                  >
                    <div className="p-2 bg-rose-500 text-white rounded-lg">
                      <AlertTriangle size={16} />
                    </div>
                    <p className="text-rose-400 text-xs font-bold">
                      Warning: You are ৳ {(item.spent - item.limit).toLocaleString()} over budget!
                    </p>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {budgets.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
            <Target size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-500 font-bold">No budgets set. Start by defining a spending limit.</p>
          </div>
        )}
      </div>
    </div>
  );
}