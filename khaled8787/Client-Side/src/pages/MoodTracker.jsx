import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Smile, 
  Frown, 
  AlertCircle, 
  Zap, 
  Sparkles, 
  Wallet, 
  StickyNote, 
  BrainCircuit, 
  Calendar,
  Layers
} from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function MoodTracker() {
  const [mood, setMood] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [records, setRecords] = useState([]);
  const [insight, setInsight] = useState("");

  const fetchData = async () => {
    try {
      const res = await api.get("/mood");
      setRecords(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchInsight = async () => {
    try {
      const res = await api.get("/insights");
      setInsight(res.data.insight);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchInsight();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/mood/add", {
        mood,
        amount,
        notes,
      });

      setMood("");
      setAmount("");
      setNotes("");

      toast.success("Mood saved!");

      fetchData();
      fetchInsight();

    } catch (err) {
      toast.error("Failed to save mood");
    }
  };

  const moodMap = {
    happy: { label: "Happy", icon: <Smile size={24} />, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", glow: "shadow-[0_0_30px_rgba(52,211,153,0.15)]", active: "bg-emerald-500 text-black font-black" },
    sad: { label: "Sad", icon: <Frown size={24} />, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20", glow: "shadow-[0_0_30px_rgba(248,113,113,0.15)]", active: "bg-rose-500 text-white font-black" },
    stress: { label: "Stress", icon: <AlertCircle size={24} />, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", glow: "shadow-[0_0_30px_rgba(251,191,36,0.15)]", active: "bg-amber-400 text-black font-black" },
    excited: { label: "Excited", icon: <Zap size={24} />, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20", glow: "shadow-[0_0_30px_rgba(6,182,212,0.15)]", active: "bg-cyan-500 text-black font-black" },
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 px-4 font-sans text-white">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg">
            <BrainCircuit size={12} className="animate-pulse" /> Behavioral Analytics Core
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Mood vs Money <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Tracker</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Analyzing correlation thresholds between emotional status and real-time capital burn rates.
          </p>
        </div>

        <div className="px-6 py-3 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center gap-4 backdrop-blur-md shrink-0">
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Total Indexed Logs</p>
            <p className="text-xl font-black text-cyan-400 mt-0.5">{records.length} Nodes</p>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-cyan-950/40 via-[#071028] to-[#0a163a] border border-cyan-500/30 p-6 md:p-8 rounded-[2.5rem] mb-12 shadow-[0_0_40px_rgba(6,182,212,0.05)] overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/[0.02] rounded-full blur-3xl group-hover:bg-cyan-500/[0.05] transition-all duration-500" />
        <div className="flex items-start gap-4 relative z-10">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl shrink-0">
            <Sparkles size={20} className="animate-spin [animation-duration:8s]" />
          </div>
          <div>
            <h2 className="font-black text-xs uppercase tracking-widest text-cyan-400 mb-1.5">
              Smart Insight Engine
            </h2>
            <p className="text-gray-300 font-medium text-sm md:text-base leading-relaxed">
              {insight || "No analytical insight compiled yet. Log your frequencies to activate calculation pipelines."}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-10 items-start">
        
        <div className="lg:col-span-5 bg-gradient-to-b from-white/[0.03] to-transparent border border-white/10 rounded-[3rem] p-8 shadow-2xl backdrop-blur-xl relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <h3 className="text-lg font-black tracking-tight mb-8 text-gray-300">Initialize Operational Log</h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-3">
              <label className="text-xs font-black uppercase text-gray-500 tracking-wider">Valence State</label>
              
              <div className="grid grid-cols-2 gap-3 mb-2">
                {Object.keys(moodMap).map((mKey) => {
                  const isTarget = mood === mKey;
                  const item = moodMap[mKey];
                  return (
                    <button
                      key={mKey}
                      type="button"
                      onClick={() => setMood(mKey)}
                      className={`p-4 rounded-xl border flex items-center gap-3 text-sm transition-all duration-300 text-left ${
                        isTarget 
                          ? `${item.active} ${item.glow} border-transparent scale-[1.02]` 
                          : `bg-black/20 border-white/5 ${item.color} hover:bg-white/5`
                      }`}
                    >
                      {item.icon}
                      <span className={isTarget ? "text-inherit" : "text-gray-400 font-bold"}>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="relative hidden">
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full p-4 bg-black/30 border border-white/10 rounded-xl font-medium outline-none"
                >
                  <option value="">Select Mood</option>
                  <option value="happy">Happy 😊</option>
                  <option value="sad">Sad 😢</option>
                  <option value="stress">Stress 😫</option>
                  <option value="excited">Excited 🤩</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
                <Wallet size={12} className="text-gray-400" /> Capital Flow Matrix (৳)
              </label>
              <div className="relative group">
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-4 bg-black/30 border border-white/10 rounded-xl font-semibold outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all text-white placeholder-gray-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
                <StickyNote size={12} className="text-gray-400" /> Qualitative Metadata Notes
              </label>
              <textarea
                placeholder="Document localized environmental prompts or spending impulses..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="3"
                className="w-full p-4 bg-black/30 border border-white/10 rounded-xl font-medium outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all text-white placeholder-gray-600 resize-none"
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 py-4 rounded-xl font-black uppercase tracking-wider text-sm transition-all shadow-[0_0_30px_rgba(6,182,212,0.15)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles size={16} /> Save Telemetry Mood
            </motion.button>
          </form>
        </div>

        
        <div className="lg:col-span-7 space-y-4">
          <div className="border-b border-white/5 pb-3 flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Chronological Ledger Streaming</h3>
            <span className="text-xs text-cyan-400/80 font-bold tracking-tight">{records.length} Data Packets</span>
          </div>

          
          <motion.div layout className="space-y-3">
            <AnimatePresence mode="popLayout">
              {records.map((item) => {
                const config = moodMap[item.mood?.toLowerCase()] || {
                  label: item.mood || "General",
                  icon: <Layers size={18} />,
                  color: "text-cyan-400",
                  bg: "bg-cyan-500/5 border-cyan-500/10"
                };

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    key={item._id}
                    className="group relative bg-white/[0.01] hover:bg-white/[0.025] border border-white/5 hover:border-white/10 p-5 rounded-2xl flex items-start justify-between gap-6 transition-all duration-300 overflow-hidden"
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      
                      <div className={`p-3.5 border rounded-xl shrink-0 group-hover:scale-105 transition-transform duration-300 ${config.bg} ${config.color}`}>
                        {config.icon}
                      </div>

                      
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <p className="font-black text-sm uppercase tracking-wider text-white">
                            {config.label}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] text-gray-600 font-bold">
                            <Calendar size={10} /> Recent Log
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed break-words pr-2">
                          {item.notes || <span className="text-gray-600 italic font-normal text-xs">No descriptive metadata packets written.</span>}
                        </p>
                      </div>
                    </div>

                    
                    <div className="text-right shrink-0 self-center">
                      <p className="font-black text-lg tracking-tight text-cyan-400 group-hover:scale-105 transition-transform">
                        ৳{item.amount?.toLocaleString() || "0"}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            
            {records.length === 0 && (
              <div className="py-24 text-center bg-white/[0.005] border border-dashed border-white/5 rounded-[2.5rem]">
                <Layers size={36} className="mx-auto text-gray-700 mb-4 animate-pulse" />
                <h3 className="text-base font-bold text-gray-500 tracking-tight">Ecosystem Ledger Offline</h3>
                <p className="text-gray-600 text-xs font-medium mt-1 max-w-xs mx-auto">
                  No behavioral vectors recorded for tracking. Submit your metrics using the logging console.
                </p>
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </div>
  );
}