import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  DollarSign, 
  Tag, 
  FileText, 
  ArrowUpDown,
  XCircle 
} from "lucide-react";
import api from "../services/api";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    note: "",
  });
  const [editingId, setEditingId] = useState(null);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/transactions/update/${editingId}`, formData);
        setEditingId(null);
      } else {
        await api.post("/transactions/add", formData);
      }
      setFormData({ type: "expense", amount: "", category: "", note: "" });
      fetchTransactions();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/delete/${id}`);
      fetchTransactions();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      type: item.type,
      amount: item.amount,
      category: item.category,
      note: item.note,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredTransactions = transactions.filter((item) =>
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Manage <span className="text-cyan-400">Transactions</span>
          </h1>
          <p className="text-gray-400 mt-2 font-medium italic">Track every penny with precision.</p>
        </div>
        
        <div className="relative group w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search by category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none text-white focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all shadow-2xl"
          />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden mb-12"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Plus size={120} className="text-cyan-400" />
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Entry Type</label>
            <div className="relative">
              <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-[#0B1736] border border-white/10 p-4 pl-12 rounded-2xl outline-none text-white focus:border-cyan-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="income">Income (+)</option>
                <option value="expense">Expense (-)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Amount (৳)</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Category</label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="category"
                placeholder="e.g. Food, Rent, Salary"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-[#0B1736] border border-white/10 p-4 pl-12 rounded-2xl outline-none text-white focus:border-cyan-500/50 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Note (Optional)</label>
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="note"
                placeholder="Add a small detail..."
                value={formData.note}
                onChange={handleChange}
                className="w-full bg-[#0B1736] border border-white/10 p-4 pl-12 rounded-2xl outline-none text-white focus:border-cyan-500/50 transition-all"
              />
            </div>
          </div>

          <div className="md:col-span-2 flex gap-4 mt-2">
            <button
              type="submit"
              className={`flex-1 group flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-white transition-all shadow-xl ${
                editingId ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20" : "bg-cyan-500 hover:bg-cyan-600 shadow-cyan-500/20"
              }`}
            >
              {editingId ? <Edit3 size={20} /> : <Plus size={20} />}
              {editingId ? "Update Transaction" : "Add Transaction Entry"}
            </button>
            
            {editingId && (
              <button 
                onClick={() => {setEditingId(null); setFormData({type:"expense", amount:"", category:"", note:""})}}
                className="px-6 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </motion.div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white mb-6 ml-2 flex items-center gap-2">
          <ArrowUpDown size={18} className="text-cyan-400" /> All Records
        </h2>
        
        <AnimatePresence>
          {filteredTransactions.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={item._id}
              className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-[2rem] p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all"
            >
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl ${
                  item.type === "income" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                }`}>
                  <DollarSign size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white capitalize">{item.category}</h3>
                  <p className="text-gray-500 text-sm font-medium">{item.note || "No additional notes"}</p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-8">
                <div className="text-right">
                  <p className={`text-2xl font-black ${
                    item.type === "income" ? "text-emerald-400" : "text-rose-400"
                  }`}>
                    {item.type === "income" ? "+" : "-"} ৳{item.amount}
                  </p>
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">Verified Transaction</p>
                </div>

                <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-3 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white rounded-xl transition-all"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
            <XCircle size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-500 font-bold">No transactions found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}