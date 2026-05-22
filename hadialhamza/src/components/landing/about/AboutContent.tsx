"use client";

import { motion } from "motion/react";
import { Heart, Rocket, ShieldCheck, Mail } from "lucide-react";
import Image from "next/image";

export default function AboutContent() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
        <div className="flex-1 max-w-3xl text-center lg:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-foreground tracking-tight mb-8"
          >
            We&apos;re on a mission to <br />
            <span className="text-primary">Simplify Finance</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground font-medium text-lg leading-relaxed"
          >
            SpendSentry was born out of a simple frustration: financial tools
            were either too complex for everyday use or too simple to be useful.
            We built the middle ground—a premium, intelligent, and private
            platform for modern money management.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex-1 w-full"
        >
          <Image
            src="/images/about.png"
            alt="Our Mission"
            width={600}
            height={600}
            className="w-full h-auto rounded-3xl shadow-2xl"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Rocket className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
          <p className="text-muted-foreground font-medium leading-relaxed">
            We envision a world where everyone has the clarity and confidence to
            make informed financial decisions. By removing the friction from
            tracking and analysis, we empower our users to focus on what truly
            matters—building their future.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">Privacy First</h3>
          <p className="text-muted-foreground font-medium leading-relaxed">
            Your financial data is your most sensitive information. That&apos;s
            why SpendSentry is built with a privacy-first architecture. We never
            sell your data, and we use industry-leading encryption to keep your
            records safe.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-card border border-border p-8 md:p-16 rounded-[3rem] text-center space-y-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -ml-32 -mb-32" />

        <div className="relative z-10">
          <Heart className="w-12 h-12 text-primary mx-auto mb-6 fill-primary/20" />
          <h2 className="text-3xl md:text-4xl font-black text-foreground">
            Built with Love by Finance Geeks
          </h2>
          <p className="text-muted-foreground font-medium text-lg max-w-2xl mx-auto mt-4">
            We are a small, dedicated team of developers and designers who are
            passionate about financial literacy. Every pixel and every line of
            code is crafted to help you succeed.
          </p>
          <div className="pt-8">
            <a
              href="mailto:hamzaglory@gmail.com"
              className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
            >
              <Mail className="w-5 h-5" />
              Get in touch with us
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
