import { motion } from "framer-motion";
import {
  ShieldCheck,
  BarChart3,
  Wallet,
  Sparkles,
  Target,
  Globe,
  ArrowUpRight,
  CheckCircle2,
  Sparkle
} from "lucide-react";

export default function About() {
  const features = [
    {
      icon: <Wallet size={26} />,
      title: "Smart Expense Tracking",
      description: "Track your complex streams of income and daily expenditures within an elite hyper-responsive dashboard environment.",
      glow: "group-hover:shadow-[0_0_40px_rgba(34,197,94,0.15)]",
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/10"
    },
    {
      icon: <BarChart3 size={26} />,
      title: "Advanced Analytics",
      description: "Deconstruct your macro savings metrics using clean, modern statistical graphs, trends, and analytical data grids.",
      glow: "group-hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]",
      iconColor: "text-purple-400 bg-purple-500/10 border-purple-500/10"
    },
    {
      icon: <ShieldCheck size={26} />,
      title: "Secure & Reliable",
      description: "Enterprise-grade safety layers protecting your financial database behind multi-factor cloud token authentications.",
      glow: "group-hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]",
      iconColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/10"
    },
    {
      icon: <Sparkles size={26} />,
      title: "AI Insights Core",
      description: "Predictive, autonomous machine learning agents instantly flagging abnormal expenses and providing saving blueprints.",
      glow: "group-hover:shadow-[0_0_40px_rgba(236,72,153,0.15)]",
      iconColor: "text-pink-400 bg-pink-500/10 border-pink-500/10"
    },
    {
      icon: <Target size={26} />,
      title: "Budget Architecture",
      description: "Set targeted threshholds across specific operational spending tags and keep asset milestones mathematically aligned.",
      glow: "group-hover:shadow-[0_0_40px_rgba(249,115,22,0.15)]",
      iconColor: "text-orange-400 bg-orange-500/10 border-orange-500/10"
    },
    {
      icon: <Globe size={26} />,
      title: "Cloud-Scale Syncing",
      description: "Your ledger remains global, fully automated, and synchronized across every device node in absolute real-time.",
      glow: "group-hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]",
      iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/10"
    },
  ];

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
  };

  return (
    <div className="min-h-screen bg-[#071028] text-white px-6 py-28 relative overflow-hidden font-sans">
      
      <div className="absolute top-[-5%] left-[-15%] w-[600px] h-[600px] bg-cyan-500/[0.04] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/[0.03] rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-purple-500/[0.04] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="text-center mb-32 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-full text-xs font-black uppercase tracking-widest text-cyan-400 mb-6 shadow-xl backdrop-blur-md"
          >
            <Sparkle size={12} className="animate-spin [animation-duration:6s]" /> The Ecosystem Hub
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter max-w-4xl mx-auto leading-[1.05]"
          >
            Next-Generation <br />
            Financial <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Intelligence</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto mt-8 text-gray-400 text-lg md:text-xl leading-relaxed font-medium"
          >
            FinTrack is a premium web asset engineered to monitor capital flow vectors, stabilize corporate & personal liquidity targets, and optimize cash management via predictive analytics.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch mb-36">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-gradient-to-b from-white/[0.03] to-transparent border border-white/10 rounded-[3.5rem] p-12 flex flex-col justify-between group hover:border-white/20 transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/[0.02] rounded-full blur-2xl group-hover:bg-cyan-400/[0.05] transition-all duration-500" />
            <div>
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-8 text-gray-400 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-all">
                <Sparkles size={20} />
              </div>
              <h2 className="text-4xl font-black tracking-tight text-white mb-6">Our Core Blueprint</h2>
              <p className="text-gray-400 text-lg leading-relaxed font-medium max-w-xl">
                We optimize accounting vectors by merging pristine, state-of-the-art interface experiences with sophisticated cloud ledgers. FinTrack envisions an ecosystem where predictive asset management remains fluid, accessible, and mathematically intuitive for creators worldwide.
              </p>
            </div>
            
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 bg-gradient-to-br from-cyan-500/[0.07] via-[#081330] to-transparent border border-cyan-500/20 rounded-[3.5rem] p-12 flex flex-col justify-center shadow-2xl"
          >
            <h2 className="text-3xl font-black tracking-tight text-white mb-8">Architectural Benchmarks</h2>
            <div className="space-y-5">
              {[
                "High-performance decoupled MERN mechanics",
                "Cryptographic JWT authorization architecture",
                "Real-time cluster data virtualization arrays",
                "Dynamic analytical cron recurrence engines",
                "Low-latency cloud synchronization pipes"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="mt-1 text-cyan-400 p-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded-md">
                    <CheckCircle2 size={14} />
                  </div>
                  <p className="text-gray-300 font-semibold text-sm leading-tight tracking-wide">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            Core Operational <span className="text-cyan-400">Capabilities</span>
          </h2>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-3">Engineered for supreme modular scaling</p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, i) => (
            <motion.div
              variants={fadeInUp}
              key={i}
              className={`group bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 rounded-[2.8rem] p-8 transition-all duration-500 flex flex-col justify-between shadow-xl cursor-default relative overflow-hidden ${feature.glow}`}
            >
              <div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-8 transition-transform group-hover:scale-105 duration-300 ${feature.iconColor}`}>
                  {feature.icon}
                </div>

                <h3 className="text-2xl font-black text-white mb-4 tracking-tight group-hover:text-cyan-400 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>

              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-30 text-white transition-opacity duration-300">
                <ArrowUpRight size={16} />
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}