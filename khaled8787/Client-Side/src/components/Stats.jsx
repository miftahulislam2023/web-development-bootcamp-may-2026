import { motion } from "framer-motion";
import { 
  Users, 
  ArrowUpRight, 
  ShieldCheck, 
  Globe2 
} from "lucide-react";

export default function Stats() {
  const stats = [
    {
      number: "50K+",
      label: "Active Users",
      icon: <Users size={18} />,
      color: "from-cyan-500/10 to-transparent",
      borderColor: "group-hover:border-cyan-500/30",
      textColor: "text-cyan-400"
    },
    {
      number: "৳25M+",
      label: "Volume Tracked",
      icon: <ArrowUpRight size={18} />,
      color: "from-emerald-500/10 to-transparent",
      borderColor: "group-hover:border-emerald-500/30",
      textColor: "text-emerald-400"
    },
    {
      number: "99.9%",
      label: "Uptime Security",
      icon: <ShieldCheck size={18} />,
      color: "from-purple-500/10 to-transparent",
      borderColor: "group-hover:border-purple-500/30",
      textColor: "text-purple-400"
    },
    {
      number: "120+",
      label: "Global Nodes",
      icon: <Globe2 size={18} />,
      color: "from-blue-500/10 to-transparent",
      borderColor: "group-hover:border-blue-500/30",
      textColor: "text-blue-400"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 80, damping: 15 } 
    }
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-cyan-500/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, i) => (
            <motion.div
              variants={itemVariants}
              key={i}
              className={`group bg-gradient-to-b ${stat.color} bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 transition-all duration-500 shadow-2xl relative overflow-hidden ${stat.borderColor}`}
            >
              <div className="flex items-center justify-between mb-6 text-gray-500 group-hover:text-white transition-colors">
                <div className={`p-2.5 bg-white/5 border border-white/5 rounded-xl ${stat.textColor}`}>
                  {stat.icon}
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-cyan-400 transition-colors" />
              </div>

              <h3 className={`text-4xl md:text-5xl font-black tracking-tight mb-2 ${stat.textColor} transition-transform duration-300 group-hover:scale-[1.02]`}>
                {stat.number}
              </h3>

              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                {stat.label}
              </p>

              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-white/[0.01] group-hover:bg-white/[0.03] rounded-full blur-xl transition-all duration-500" />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}