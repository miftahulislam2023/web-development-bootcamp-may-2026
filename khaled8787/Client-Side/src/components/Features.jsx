import { motion } from "framer-motion";
import { Wallet, BarChart3, Banknote, ShieldCheck, Zap, BellRing } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Wallet className="w-8 h-8" />,
      title: "Expense Tracking",
      description: "Track all your daily expenses easily with smart categorization.",
      color: "from-cyan-500/20 to-blue-500/20",
      borderColor: "group-hover:border-cyan-500/50"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics Dashboard",
      description: "Visualize your financial growth with interactive charts and deep insights.",
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "group-hover:border-purple-500/50"
    },
    {
      icon: <Banknote className="w-8 h-8" />,
      title: "Budget Management",
      description: "Set monthly budgets and goals to keep your spending under control.",
      color: "from-orange-500/20 to-yellow-500/20",
      borderColor: "group-hover:border-orange-500/50"
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Secure Data",
      description: "Your financial data is encrypted and stored with bank-grade security.",
      color: "from-green-500/20 to-emerald-500/20",
      borderColor: "group-hover:border-green-500/50"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Sync",
      description: "Access your data from any device with instant cloud synchronization.",
      color: "from-blue-500/20 to-indigo-500/20",
      borderColor: "group-hover:border-blue-500/50"
    },
    {
      icon: <BellRing className="w-8 h-8" />,
      title: "Smart Alerts",
      description: "Get notified before you overspend or when your bills are due.",
      color: "from-red-500/20 to-rose-500/20",
      borderColor: "group-hover:border-red-500/50"
    },
  ];

  return (
    <section className="bg-[#071028] text-white py-32 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black mb-6 tracking-tight"
          >
            Everything you need to <br />
            <span className="text-cyan-400">Master your Money</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Powerful tools and insights to help you manage your personal finance professionally and reach your goals faster.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className={`h-full bg-white/5 border border-white/10 p-10 rounded-[2.5rem] transition-all duration-500 ${feature.borderColor} hover:bg-white/[0.08] relative overflow-hidden`}>
                
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10">
                  <div className="w-16 h-16 flex items-center justify-center bg-white/5 rounded-2xl mb-6 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-500 text-cyan-400">
                    {feature.icon}
                  </div>

                  <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300">
                    {feature.description}
                  </p>
                </div>

                <div className="absolute bottom-0 left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}