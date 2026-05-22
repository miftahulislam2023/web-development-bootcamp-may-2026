"use client";

import { motion } from "motion/react";
import { CheckCircle2, Shield, Zap, BarChart3, Globe, Users } from "lucide-react";
import Image from "next/image";

const FEATURES = [
  {
    title: "Real-time Tracking",
    description: "Monitor your expenses and income as they happen with instant synchronization.",
    icon: <Zap className="w-6 h-6 text-primary" />,
  },
  {
    title: "Secure Data",
    description: "Your financial information is encrypted and protected with bank-grade security.",
    icon: <Shield className="w-6 h-6 text-primary" />,
  },
  {
    title: "Smart Insights",
    description: "Gain valuable understanding of your spending patterns with AI-driven analytics.",
    icon: <BarChart3 className="w-6 h-6 text-primary" />,
  },
  {
    title: "Global Reach",
    description: "Support for multiple currencies and international financial standards.",
    icon: <Globe className="w-6 h-6 text-primary" />,
  },
  {
    title: "Collaborative Tools",
    description: "Share budgets and track shared expenses with family or team members.",
    icon: <Users className="w-6 h-6 text-primary" />,
  },
  {
    title: "Automated Reports",
    description: "Receive weekly and monthly summaries of your financial health automatically.",
    icon: <CheckCircle2 className="w-6 h-6 text-primary" />,
  },
];

export default function FeaturesContent() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
        <div className="flex-1 text-center lg:text-left">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-foreground tracking-tight mb-6"
          >
            Powerful Features for <br />
            <span className="text-primary">Financial Freedom</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground font-medium text-lg max-w-2xl mx-auto lg:mx-0"
          >
            Everything you need to take control of your money, all in one place. Simple, powerful, and secure.
          </motion.p>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 w-full relative"
        >
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-[100px] -z-10" />
          <Image
            src="/images/features.png"
            alt="Financial Features"
            width={600}
            height={600}
            className="w-full h-auto rounded-3xl drop-shadow-2xl"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {FEATURES.map((feature, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group shadow-sm hover:shadow-xl hover:shadow-primary/5"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
            <p className="text-muted-foreground font-medium text-sm leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
