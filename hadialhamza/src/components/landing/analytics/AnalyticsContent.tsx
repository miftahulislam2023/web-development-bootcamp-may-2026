"use client";

import { motion } from "motion/react";
import { LineChart, PieChart, TrendingUp, Target, Wallet, ArrowUpRight } from "lucide-react";
import Image from "next/image";

const ANALYTICS_FEATURES = [
  {
    title: "Visual Spending Trends",
    description: "Understand your financial flow with beautiful, interactive charts that track your progress over time.",
    icon: <TrendingUp className="w-6 h-6 text-primary" />,
  },
  {
    title: "Category Breakdown",
    description: "See exactly where your money goes with detailed category distributions and custom tagging.",
    icon: <PieChart className="w-6 h-6 text-primary" />,
  },
  {
    title: "Goal Projection",
    description: "Visualize your future savings and investment growth with smart projection algorithms.",
    icon: <Target className="w-6 h-6 text-primary" />,
  },
];

export default function AnalyticsPublicContent() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="text-center mb-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black text-foreground tracking-tight mb-6"
        >
          Insights that Drive <br />
          <span className="text-primary">Smarter Decisions</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground font-medium text-lg max-w-2xl mx-auto"
        >
          Our advanced analytics engine turns raw data into actionable financial wisdom. Gain clarity and grow your wealth.
        </motion.p>
      </div>

      <div className="relative mb-32">
        <div className="absolute inset-0 bg-primary/5 rounded-[3rem] -rotate-1 scale-105" />
        <div className="relative bg-card border border-border p-8 md:p-16 rounded-[3rem] shadow-2xl flex flex-col lg:flex-row items-center gap-16 overflow-hidden">
          <div className="flex-1 space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
              <LineChart className="w-4 h-4" />
              Next-Gen Analytics
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-foreground leading-tight">
              Beautiful Data <br /> at Your Fingertips
            </h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              We believe that financial data shouldn&apos;t be boring. SpendSentry provides a premium interface that makes monitoring your money a pleasure, not a chore.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5 text-primary" />
                 </div>
                 <span className="font-bold text-sm">Real-time Sync</span>
               </div>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-primary" />
                 </div>
                 <span className="font-bold text-sm">Budget Alerts</span>
               </div>
            </div>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 w-full relative"
          >
            <Image
              src="/images/analytics.png"
              alt="Analytics Dashboard Preview"
              width={800}
              height={600}
              className="w-full h-auto rounded-3xl shadow-2xl border border-border/50"
            />
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {ANALYTICS_FEATURES.map((feature, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (0.1 * index) }}
            className="space-y-6 text-center md:text-left"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto md:mx-0">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
            <p className="text-muted-foreground font-medium text-sm leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
