import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RefreshCcw, 
  Plus, 
  Calendar, 
  DollarSign, 
  FileText, 
  Layers, 
  ArrowUpDown,
  Clock
} from "lucide-react";
import api from "../services/api";

export default function Recurring() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    frequency: "monthly",
    nextDate: "",
  });

  const fetchRecurring = async () => {
    try {
      const res = await api.get("/recurring/all");
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRecurring();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/recurring/add", formData);
      setFormData({
        title: "",
        amount: "",
        type: "expense",
        frequency: "monthly",
        nextDate: "",
      });
      fetchRecurring();
    } catch (error) {
      console.log(error);
    }
  };

  const getFrequencyBadge = (frequency) => {
    const base = "px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-xl ";
    switch (frequency) {
      case "daily": return base + "bg-blue-500/10 text-blue-400 border border-blue-500/10";
      case "weekly": return base + "bg-purple-500/10 text-purple-400 border border-purple-500/10";
      case "monthly": return base + "bg-cyan-500/10 text-cyan-400 border border-cyan-500/10";
      default: return base + "bg-gray-500/10 text-gray-400 border border-gray-500/10";
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Recurring <span className="text-cyan-400">Flows</span>
          </h1>
          <p className="text-gray-400 mt-2 font-medium">Monitor subscriptions, bills, and automated payrolls.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 shadow-2xl">
          <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg animate-spin [animation-duration:10s]">
            <RefreshCcw size={20} />
          </div>
          <span className="text-white font-bold">{data.length} Subscriptions Active</span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 mb-16 relative overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 relative z-10">
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Flow Title</label>
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                name="title"
                placeholder="e.g. Netflix Premium, House Rent"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-[#0B1736] border border-white/10 p-4 pl-12 rounded-2xl outline-none text-white focus:border-cyan-500/50 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Amount (৳)</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="number"
                name="amount"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                className="w-full bg-[#0B1736] border border-white/10 p-4 pl-12 rounded-2xl outline-none text-white focus:border-cyan-500/50 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Transaction Type</label>
            <div className="relative">
              <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-[#0B1736] border border-white/10 p-4 pl-12 rounded-2xl outline-none text-white focus:border-cyan-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="expense">Automated Expense (-)</option>
                <option value="income">Automated Income (+)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Interval Frequency</label>
            <div className="relative">
              <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="w-full bg-[#0B1736] border border-white/10 p-4 pl-12 rounded-2xl outline-none text-white focus:border-cyan-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Next Billing Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="date"
                name="nextDate"
                value={formData.nextDate}
                onChange={handleChange}
                className="w-full bg-[#0B1736] border border-white/10 p-4 pl-12 rounded-2xl outline-none text-white focus:border-cyan-500/50 transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="md:col-span-2 group flex items-center justify-center gap-2 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-black rounded-2xl transition-all shadow-[0_0_25px_rgba(6,182,212,0.25)]"
          >
            <Plus size={20} /> Initialize Recurring Plan
          </button>
        </form>
      </motion.div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence>
          {data.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              key={item._id}
              className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-[2.5rem] p-6 flex flex-col justify-between transition-all duration-300 shadow-xl group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-white capitalize tracking-tight group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className={getFrequencyBadge(item.frequency)}>
                      {item.frequency}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                      item.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                </div>
                
                <h3 className={`text-2xl font-black tracking-tight ${
                  item.type === "income" ? "text-emerald-400" : "text-rose-400"
                }`}>
                  {item.type === "income" ? "+" : "-"} ৳{item.amount.toLocaleString()}
                </h3>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-cyan-400">
                  <div className="p-2 bg-cyan-500/10 rounded-xl">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Next Process</p>
                    <p className="text-sm font-bold text-gray-300">
                      {new Date(item.nextDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                
                <RefreshCcw size={14} className="text-gray-600 animate-spin [animation-duration:15s] group-hover:text-cyan-500" />
              </div>

            </motion.div>
          ))}
        </AnimatePresence>

        {data.length === 0 && (
          <div className="col-span-full py-24 text-center bg-white/[0.01] border border-dashed border-white/10 rounded-[3rem]">
            <RefreshCcw size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-500 font-bold">No recurring transactions mapped yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}