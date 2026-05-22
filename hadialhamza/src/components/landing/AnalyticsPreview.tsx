"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { TrendingUp, ArrowUpRight, Target, BrainCircuit } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import AnalyticsChart from "@/components/charts/AnalyticsChart";
import { Button } from "@/components/ui/Button";

const insights = [
  {
    title: "Spending Analysis",
    value: "+12.5%",
    description:
      "Your dining expenses are 12% higher than your 3-month average. Consider adjusting your food budget.",
    icon: TrendingUp,
    trend: "up",
    color: "text-rose-500 bg-rose-500/10",
  },
  {
    title: "Savings Potential",
    value: "$420/mo",
    description:
      "By optimizing 3 redundant subscriptions, you could increase your monthly savings by $420.",
    icon: Target,
    trend: "down",
    color: "text-primary bg-primary/10",
  },
];

export default function AnalyticsPreview() {
  return (
    <section
      id="analytics"
      className="py-24 lg:py-32 bg-muted/20 relative overflow-hidden"
    >
      {/* Subtle Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(var(--foreground) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[30%] h-[30%] rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Side: Content Section */}
          <div className="flex flex-col space-y-10 order-2 lg:order-1">
            <SectionTitle
              align="left"
              tag="Smart Insights"
              title={
                <>
                  Gain{" "}
                  <span className="text-primary underline decoration-primary/20 underline-offset-8">
                    Financial Clarity
                  </span>{" "}
                  with AI Analytics
                </>
              }
              subtitle="Don't just track your numbers—understand the story behind them. Our platform transforms your transaction history into actionable financial wisdom."
              className="mb-0"
              titleClassName="lg:text-5xl"
            />

            <div className="grid sm:grid-cols-2 gap-6">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="group p-6 rounded-3xl bg-card border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`p-3 rounded-2xl ${insight.color} group-hover:scale-110 transition-transform duration-500`}
                    >
                      <insight.icon className="w-5 h-5" />
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm font-bold ${insight.trend === "up" ? "text-rose-500" : "text-primary"}`}
                    >
                      {insight.value}
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold mb-2 text-foreground">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {insight.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="pt-4"
            >
              <Link href="/analytics">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<BrainCircuit className="w-5 h-5" />}
                >
                  View Full Analytics
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Side: Chart Interface Section */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative order-1 lg:order-2"
          >
            {/* The "Command Center" UI */}
            <div className="relative z-10 p-8 rounded-[2.5rem] bg-card border border-border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
              {/* Interface Header */}
              <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold tracking-tight text-foreground">
                    Cash Flow Analysis
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      Active Monitoring
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-muted text-[10px] font-bold uppercase tracking-wider">
                    Weekly
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                    Monthly
                  </div>
                </div>
              </div>

              {/* Real Chart Component */}
              <div className="relative min-h-80 h-80 w-full">
                <AnalyticsChart />
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-border/50">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">
                    Income
                  </p>
                  <p className="text-xl font-bold text-primary">$12,450.00</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">
                    Expense
                  </p>
                  <p className="text-xl font-bold text-rose-500">$8,240.20</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">
                    Savings
                  </p>
                  <p className="text-xl font-bold text-foreground">$4,209.80</p>
                </div>
              </div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -z-10" />

            {/* Floating Glass Element */}
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-10 z-20 hidden xl:block p-5 bg-background/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-linear-to-tr from-primary to-emerald-400 flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Efficiency
                  </p>
                  <p className="text-xl font-bold text-foreground">94.2%</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
