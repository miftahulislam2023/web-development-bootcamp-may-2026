"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useSession } from "next-auth/react";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import HeroSlider from "./HeroSlider";

const features = [
  "No credit card required",
  "Free for individuals",
  "Bank-level security",
];

export default function Hero() {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Content */}
          <div className="flex flex-col space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold w-fit mx-auto lg:mx-0"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              New: AI-Powered Insights are here
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]"
            >
              Master Your Money with{" "}
              <span className="text-primary underline decoration-primary/20 underline-offset-8">
                Intelligence.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed"
            >
              The premium personal finance tracker designed for modern teams and
              individuals. Track expenses, set budgets, and gain deep insights
              effortlessly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-4"
            >
              <Link
                href={isLoggedIn ? "/dashboard" : "/login"}
                className="w-full sm:w-auto"
              >
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5" />}
                  className="w-full"
                >
                  {isLoggedIn ? "Go to Dashboard" : "Start Tracking Free"}
                </Button>
              </Link>
              <Link href="/features" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full group"
                  icon={
                    <Play className="w-5 h-5 fill-primary text-primary group-hover:fill-primary-foreground transition-colors" />
                  }
                >
                  Explore Features
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-2"
            >
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-sm text-muted-foreground font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  {feature}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Hero Slider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              type: "spring",
              stiffness: 100,
            }}
            className="relative"
          >
            <HeroSlider />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
