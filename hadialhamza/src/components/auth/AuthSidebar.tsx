"use client";

import { motion } from "motion/react";
import Logo from "@/components/ui/Logo";

interface AuthSidebarProps {
  title?: React.ReactNode;
  subtitle?: string;
}

export default function AuthSidebar({
  title = (
    <>
      Track your expenses with <span className="text-primary">precision.</span>
    </>
  ),
  subtitle = "Join thousands of users who have transformed their financial life with SpendSentry's intelligent tracking and analytics.",
}: AuthSidebarProps) {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 overflow-hidden items-center justify-center p-12">
      {/* Background Patterns & Glows */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-primary/20 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-lg text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Logo
            inverted
            hideTagline
            className="mb-12 scale-150 origin-center justify-center"
          />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-white mb-6 tracking-tight"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-slate-400 font-medium leading-relaxed"
        >
          {subtitle}
        </motion.p>
      </div>

      {/* Decorative Corner Text */}
      <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
        <span>SpendSentry © 2026</span>
      </div>
    </div>
  );
}
