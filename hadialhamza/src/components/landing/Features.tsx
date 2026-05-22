"use client";

import {
  BarChart3,
  Smartphone,
  ShieldCheck,
  Zap,
  Layers,
  Wallet,
  ArrowUpRight,
} from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import ScrollAnimation from "@/components/ui/ScrollAnimation";

const features = [
  {
    title: "Smart Expense Tracking",
    description:
      "Automatically categorize and track every penny with AI-driven insights and real-time updates.",
    icon: BarChart3,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Financial Analytics",
    description:
      "Deep dive into your spending habits with interactive charts, trends, and personalized reports.",
    icon: Zap,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    title: "Secure Authentication",
    description:
      "Your data is protected with bank-level encryption and secure multi-factor authentication.",
    icon: ShieldCheck,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    title: "Responsive Dashboard",
    description:
      "Access your financial data anywhere, anytime. Perfectly optimized for all your devices.",
    icon: Smartphone,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    title: "Spending Insights",
    description:
      "Receive smart alerts and suggestions to help you save more and reach your financial goals faster.",
    icon: Layers,
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    title: "Transaction Management",
    description:
      "Easily add, edit, and filter transactions. Manage your recurring subscriptions in one place.",
    icon: Wallet,
    color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-24 lg:py-32 bg-background relative overflow-hidden"
    >
      <div className="absolute top-1/4 left-0 w-125 h-125 bg-primary/5 rounded-full blur-[120px] -z-10 -translate-x-1/2" />
      <div className="absolute bottom-1/4 right-0 w-100 h-100 bg-primary/5 rounded-full blur-[100px] -z-10 translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <SectionTitle
          tag="Features"
          title={
            <>
              Everything you need to{" "}
              <span className="text-primary">master</span> your money
            </>
          }
          subtitle="SpendSentry provides a comprehensive suite of tools designed to give you total control over your financial life."
          className="mb-20"
        />

        <ScrollAnimation
          direction="up"
          staggerChildren={0.1}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl bg-card border border-border hover:border-primary/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 overflow-hidden"
            >
              {/* Feature Icon */}
              <div
                className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}
              >
                <feature.icon className="w-7 h-7" />
              </div>

              {/* Feature Content */}
              <h3 className="text-xl font-bold text-foreground mb-4 tracking-tight flex items-center gap-2">
                {feature.title}
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-primary" />
              </h3>
              <p className="text-muted-foreground leading-relaxed font-medium">
                {feature.description}
              </p>

              {/* Decorative Hover Effect */}
              <div className="absolute -inset-1 rounded-3xl bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Bottom accent bar */}
              <div className="absolute bottom-0 left-8 right-8 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-t-full" />
            </div>
          ))}
        </ScrollAnimation>
      </div>
    </section>
  );
}
