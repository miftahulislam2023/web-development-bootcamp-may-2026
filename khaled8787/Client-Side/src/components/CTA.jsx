import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Terminal } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-cyan-500/10 via-purple-500/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          className="relative bg-gradient-to-br from-[#0B1536] via-[#071028] to-[#0d1b46] border border-cyan-500/20 rounded-[3.5rem] p-12 md:p-16 text-center shadow-[0_0_50px_rgba(6,182,212,0.05)] overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl text-xs font-black uppercase tracking-widest mb-8 shadow-inner">
            <Sparkles size={12} className="animate-pulse" /> Final Optimization Node
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter max-w-3xl mx-auto">
            Take Control of Your <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Financial Destiny
            </span>
          </h2>

          <p className="text-gray-400 mt-6 text-base md:text-lg max-w-xl mx-auto font-medium leading-relaxed">
            Join a global network of smart asset builders. Sync your nodes, automate workflows, and reduce your burn rate today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 relative z-10">
            <Link to={'/dashboard'}>
                <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-2xl font-black transition-colors shadow-[0_0_30px_rgba(6,182,212,0.3)] group/btn"
            >
              Initialize Free Profile
              <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
            </motion.button>
            </Link>

            <Link to={'/features'}>
              <motion.button 
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-white/[0.02] border border-white/10 text-gray-300 hover:text-white rounded-2xl font-black transition-all"
            >
              <Terminal size={16} className="text-gray-500" />
              Explore Ecosystem
            </motion.button>
            </Link>
          </div>

          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/[0.03] rounded-full blur-2xl group-hover:bg-cyan-500/[0.06] transition-all duration-700" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/[0.03] rounded-full blur-2xl group-hover:bg-indigo-500/[0.06] transition-all duration-700" />
        </motion.div>
      </div>
    </section>
  );
}