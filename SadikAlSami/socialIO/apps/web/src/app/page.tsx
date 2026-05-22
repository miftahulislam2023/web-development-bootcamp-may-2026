"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

import { useAuthStore } from "@/stores/auth-store";
import cubeAnimation from "@/assets/cubeAnimation.json";

export default function Home() {
  const router = useRouter();
  const { session, isPending } = useAuthStore();
  const [minDelayPassed, setMinDelayPassed] = useState(false);

  // Enforce a 1-second minimum delay for the animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinDelayPassed(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isPending && minDelayPassed) {
      if (session) {
        router.push("/chat");
      } else {
        router.push("/login");
      }
    }
  }, [isPending, session, minDelayPassed, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <AnimatePresence>
        {(!minDelayPassed || isPending) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center"
          >
            <div className="w-64 h-64 md:w-96 md:h-96">
              <Lottie animationData={cubeAnimation} loop={true} />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-lg font-medium text-muted-foreground animate-pulse"
            >
              Initializing social.io...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
