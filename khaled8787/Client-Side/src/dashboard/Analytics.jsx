import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { TrendingUp, Activity, BarChart3, PieChart as PieIcon } from "lucide-react";
import api from "../services/api";

export default function Analytics() {
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

  const pieData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  const COLORS = ["#10b981", "#f43f5e"]; 

  const categoryMap = {};
  transactions.forEach((item) => {
    categoryMap[item.category] = (categoryMap[item.category] || 0) + item.amount;
  });

  const categoryData = Object.keys(categoryMap).map((key) => ({
    category: key,
    amount: categoryMap[key],
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0B1736]/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl">
          <p className="text-gray-400 font-bold text-xs uppercase mb-1">{payload[0].name || payload[0].payload.category}</p>
          <p className="text-white text-xl font-black">৳ {payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="pb-20 space-y-12"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter">
            Financial <span className="text-cyan-400 italic">Insights</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Deep dive into your spending and earning patterns.</p>
        </div>
        <div className="flex gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
            <div className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-xl font-bold text-sm">Real-time Data</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="group relative bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-500/20 p-8 rounded-[3rem] overflow-hidden transition-all hover:border-emerald-500/40">
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-emerald-400 mb-4">
              <TrendingUp size={20} />
              <span className="text-xs font-black uppercase tracking-widest">Revenue Stream</span>
            </div>
            <h2 className="text-5xl font-black text-white leading-none">৳ {income.toLocaleString()}</h2>
            <p className="text-emerald-500/60 mt-4 font-bold text-sm">Total earnings recorded</p>
          </div>
          <Activity className="absolute -right-8 -bottom-8 text-emerald-500/10 group-hover:scale-110 transition-transform" size={200} />
        </div>

        <div className="group relative bg-gradient-to-br from-rose-500/20 to-transparent border border-rose-500/20 p-8 rounded-[3rem] overflow-hidden transition-all hover:border-rose-500/40">
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-rose-400 mb-4">
              <TrendingUp size={20} className="rotate-180" />
              <span className="text-xs font-black uppercase tracking-widest">Expenditure</span>
            </div>
            <h2 className="text-5xl font-black text-white leading-none">৳ {expense.toLocaleString()}</h2>
            <p className="text-rose-500/60 mt-4 font-bold text-sm">Total money spent</p>
          </div>
          <Activity className="absolute -right-8 -bottom-8 text-rose-500/10 group-hover:scale-110 transition-transform" size={200} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-10 relative">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
               <PieIcon className="text-cyan-400" /> Ratio Analysis
            </h2>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={140}
                  paddingAngle={8}
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index]} 
                      className="hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center gap-10 mt-6">
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-gray-400 font-bold text-sm">Income</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <span className="text-gray-400 font-bold text-sm">Expense</span>
             </div>
          </div>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-10">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
               <BarChart3 className="text-cyan-400" /> Category Breakdown
            </h2>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#6b7280', fontWeight: 'bold', fontSize: 12}}
                  dy={15}
                />
                <YAxis hide />
                <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip />} />
                <Bar 
                  dataKey="amount" 
                  fill="url(#barGradient)" 
                  radius={[12, 12, 12, 12]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </motion.div>
  );
}