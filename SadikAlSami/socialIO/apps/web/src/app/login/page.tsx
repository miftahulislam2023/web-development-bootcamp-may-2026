"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquareText } from "lucide-react";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";

export default function LoginPage() {
  const [showSignIn, setShowSignIn] = useState(true);

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-[#F9F9F8] dark:bg-[#1C1C1E]">
      {/* Left/Top Branding Panel */}
      <div className="flex w-full flex-col justify-center bg-[#E07A5F] p-8 text-white md:w-1/2 lg:p-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto w-full"
        >
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <MessageSquareText className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
            Welcome to social.io
          </h1>
          <p className="text-lg text-white/80">
            A cozy, modern, and refined space for your conversations. Connect instantly, chat warmly.
          </p>
        </motion.div>
      </div>

      {/* Right/Bottom Forms Panel */}
      <div className="flex w-full items-center justify-center p-8 md:w-1/2 lg:p-16">
        <div className="relative w-full max-w-md">
          <AnimatePresence mode="wait">
            {showSignIn ? (
              <motion.div
                key="signin"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full rounded-3xl bg-white p-8 shadow-xl dark:bg-[#27272A] border border-[#E4E4E7] dark:border-[#3F3F46]"
              >
                <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full rounded-3xl bg-white p-8 shadow-xl dark:bg-[#27272A] border border-[#E4E4E7] dark:border-[#3F3F46]"
              >
                <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
