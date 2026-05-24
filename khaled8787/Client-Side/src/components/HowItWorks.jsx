import { motion } from "framer-motion";
import { 
  UserPlus, 
  ArrowRightLeft, 
  LineChart, 
  ArrowRight 
} from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Secure Onboarding",
      desc: "Deploy your financial profile instantly with cryptographic cloud authentication protocols.",
      icon: <UserPlus size={24} />,
      gradient: "from-cyan-500/10 via-transparent to-transparent",
      glow: "group-hover:border-cyan-500/30",
      iconColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/10"
    },
    {
      step: "02",
      title: "Stream Ledger Assets",
      desc: "Log continuous income streams and expense vectors into your personalized financial datagrid.",
      icon: <ArrowRightLeft size={24} />,
      gradient: "from-purple-500/10 via-transparent to-transparent",
      glow: "group-hover:border-purple-500/30",
      iconColor: "text-purple-400 bg-purple-500/10 border-purple-500/10"
    },
    {
      step: "03",
      title: "Synthesize Intel & Save",
      desc: "Extract automated AI habit diagnostics to stabilize burn rates and secure liquidity targets.",
      icon: <LineChart size={24} />,
      gradient: "from-emerald-500/10 via-transparent to-transparent",
      glow: "group-hover:border-emerald-500/30",
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/10"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70, damping: 15 } }
  };

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-[-10%] w-[400px] h-[400px] bg-purple-500/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[-10%] w-[400px] h-[400px] bg-cyan-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="text-center mb-24">
          <span className="text-xs font-black uppercase tracking-widest text-cyan-500 bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 rounded-full shadow-lg">
            Operational Blueprint
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mt-6">
            Engineered Efficiency in <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">3 Steps</span>
          </h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
        >
          {steps.map((item, i) => (
            <motion.div
              variants={cardVariants}
              key={i}
              className={`group bg-gradient-to-br ${item.gradient} bg-white/[0.02] border border-white/10 rounded-[3rem] p-10 transition-all duration-500 shadow-2xl flex flex-col justify-between relative overflow-hidden ${item.glow}`}
            >
              <div className="flex items-start justify-between mb-12 relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 ${item.iconColor}`}>
                  {item.icon}
                </div>
                
                <div className="text-5xl font-black font-mono text-white/[0.03] group-hover:text-cyan-400/5 transition-colors tracking-tighter select-none">
                  {item.step}
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>

              {i < 2 && (
                <div className="hidden lg:flex absolute top-14 -right-4 translate-x-1/2 p-2 bg-[#071028] border border-white/5 rounded-full text-gray-600 group-hover:text-cyan-400 group-hover:border-cyan-500/20 transition-all z-20 shadow-xl">
                  <ArrowRight size={14} className="animate-pulse" />
                </div>
              )}

              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}