import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp, Wallet, PieChart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] bg-[#071028] text-white flex items-center overflow-hidden">
      
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider text-cyan-400 uppercase bg-cyan-400/10 border border-cyan-400/20 rounded-full"
          >
            ✨ The Future of Personal Finance
          </motion.span>
          
          <h1 className="text-6xl lg:text-8xl font-black leading-[1.1] tracking-tight">
            Smart Way <br />
            To Manage <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Your Money</span>
          </h1>

          <p className="mt-8 text-xl text-gray-400 leading-relaxed max-w-lg">
            Track your income, expenses, and savings with an intuitive dashboard designed for financial freedom.
          </p>

          <div className="mt-10 flex flex-wrap gap-5">
            <Link to={'/dashboard'}><button className="group relative px-8 py-4 bg-cyan-500 rounded-2xl font-bold text-white transition-all duration-300 hover:bg-cyan-600 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] flex items-center gap-2">
              Get Started 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button></Link>
            
            
          </div>

          <div className="mt-10 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#071028] bg-gray-700" />
              ))}
            </div>
            <p>Joined by 10k+ smart users this month</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative group"
          style={{ perspective: "1000px" }}
        >
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/20 shadow-2xl transition-transform duration-500 group-hover:rotate-1">
            
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Balance</p>
                <h3 className="text-4xl font-bold">৳ 54,250.00</h3>
              </div>
              <div className="p-3 bg-cyan-500/20 rounded-xl">
                <Wallet className="text-cyan-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#0D1B3D] p-5 rounded-2xl border border-white/5 relative overflow-hidden group/card">
                <div className="absolute top-0 right-0 p-2 opacity-20"><TrendingUp size={40} /></div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Monthly Income</p>
                <h4 className="text-2xl font-bold mt-1 text-green-400">+ ৳ 80K</h4>
                <div className="mt-3 flex items-center gap-1 text-[10px] text-green-400">
                  <ArrowUpRight size={12} /> 12% from last month
                </div>
              </div>

              <div className="bg-[#0D1B3D] p-5 rounded-2xl border border-white/5 relative overflow-hidden group/card">
                <div className="absolute top-0 right-0 p-2 opacity-20"><PieChart size={40} /></div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Total Expense</p>
                <h4 className="text-2xl font-bold mt-1 text-red-400">- ৳ 25K</h4>
                <div className="w-full bg-gray-800 h-1.5 mt-4 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full w-[40%]" />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">Recent Activity</span>
                  
               </div>
               <div className="mt-4 flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">🛒</div>
                    <div>
                      <p className="text-sm font-bold">Supermarket</p>
                      <p className="text-[10px] text-gray-500">Today, 2:45 PM</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-red-400">- ৳ 1,200</span>
               </div>
            </div>
          </div>

          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-6 -right-6 bg-cyan-500 p-4 rounded-2xl shadow-xl hidden lg:block"
          >
            <TrendingUp size={24} className="text-white" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}