"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

const benefits = [
  "Free 14-day trial",
  "No setup fees",
  "Cancel anytime",
  "Personalized onboarding",
];

export default function CTA() {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute top-0 right-0 w-100 h-100 bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative z-10 p-10 lg:p-20 rounded-[3rem] bg-foreground text-background overflow-hidden shadow-2xl"
        >
          {/* Decorative Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(var(--background) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-black uppercase tracking-widest mb-8"
            >
              <Sparkles className="w-4 h-4" />
              Get Started Today
            </motion.div>

            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-8 leading-[1.1]">
              Ready to take control of your{" "}
              <span className="text-primary">financial future?</span>
            </h2>

            <p className="text-lg lg:text-xl text-background/70 max-w-2xl mb-12 font-medium leading-relaxed">
              Join thousands of users who are already mastering their money with
              SpendSentry. Start your journey towards financial freedom in less
              than 2 minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
              <Link href={isLoggedIn ? "/dashboard" : "/login"}>
                <Button
                  variant="primary"
                  size="lg"
                  className="px-10"
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  {isLoggedIn ? "Go to Dashboard" : "Create Account"}
                </Button>
              </Link>
              <Link href="/about-us">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-10 border-background/20 text-background hover:bg-background hover:text-foreground"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full pt-8 border-t border-background/10">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center gap-2 text-sm text-background/60 font-bold"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>

          {/* Decorative Corner Elements */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
