"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function SplashLoader({ isLoading }) {
  const [phase, setPhase] = useState(0); // 0: orb, 1: text reveal
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    // Check theme from localStorage
    const savedTheme = localStorage.getItem("chat_theme");
    if (savedTheme === "dark") {
      setIsDark(true);
    }

    // Phase 0 -> 1: Show orb for 800ms then reveal text
    const t1 = setTimeout(() => setPhase(1), 800);
    return () => {
      clearTimeout(t1);
    };
  }, []);

  const letters = "ArikoChats".split("");

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden ${isDark ? "dark" : ""}`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Blended gradient background matching inbox */}
          <div
            className="absolute inset-0 transition-colors duration-500"
            style={{
              background: isDark 
                ? "linear-gradient(180deg, #141821 0%, #1a2235 50%, #1e3a5f 100%)"
                : "linear-gradient(180deg, #ffffff 0%, #d8efff 25%, #a8d8f5 50%, #76bbf2 75%, #5aa0e0 100%)",
            }}
          />

          {/* Animated floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 8 + 3,
                height: Math.random() * 8 + 3,
                background: `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.1})`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30 - Math.random() * 40, 0],
                x: [0, (Math.random() - 0.5) * 30, 0],
                opacity: [0.2, 0.7, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* Subtle radial glow behind logo */}
          <motion.div
            className="absolute"
            style={{
              width: 350,
              height: 350,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(61,139,216,0.25) 0%, rgba(61,139,216,0.08) 40%, transparent 70%)",
              filter: "blur(30px)",
            }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Central content */}
          <div className="relative flex flex-col items-center justify-center gap-6">
            
            {/* Animated orb/ring */}
            <motion.div
              className="relative"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                duration: 0.8,
              }}
            >
              {/* Outer spinning ring */}
              <motion.div
                className="w-20 h-20 rounded-full"
                style={{
                  border: "3px solid transparent",
                  borderTopColor: "#3d8bd8",
                  borderRightColor: "#36649f",
                  boxShadow: "0 0 30px rgba(61,139,216,0.3), inset 0 0 20px rgba(61,139,216,0.1)",
                }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Inner pulsing dot */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  className="w-8 h-8 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #3d8bd8, #36649f)",
                    boxShadow: "0 0 20px rgba(61,139,216,0.5)",
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    boxShadow: [
                      "0 0 20px rgba(61,139,216,0.5)",
                      "0 0 40px rgba(61,139,216,0.8)",
                      "0 0 20px rgba(61,139,216,0.5)",
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>

              {/* Orbiting small circles */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: i === 0 ? "#ffb800" : i === 1 ? "#3d8bd8" : "#ffffff",
                    boxShadow: `0 0 10px ${i === 0 ? "rgba(255,184,0,0.6)" : i === 1 ? "rgba(61,139,216,0.6)" : "rgba(255,255,255,0.6)"}`,
                    top: "50%",
                    left: "50%",
                    marginTop: -3,
                    marginLeft: -3,
                  }}
                  animate={{
                    x: [
                      Math.cos((i * 2 * Math.PI) / 3) * 50,
                      Math.cos((i * 2 * Math.PI) / 3 + Math.PI) * 50,
                      Math.cos((i * 2 * Math.PI) / 3 + 2 * Math.PI) * 50,
                    ],
                    y: [
                      Math.sin((i * 2 * Math.PI) / 3) * 50,
                      Math.sin((i * 2 * Math.PI) / 3 + Math.PI) * 50,
                      Math.sin((i * 2 * Math.PI) / 3 + 2 * Math.PI) * 50,
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.3,
                  }}
                />
              ))}
            </motion.div>

            {/* ArikoChats text with rolling letter animation */}
            <AnimatePresence>
              {phase >= 1 && (
                <motion.div
                  className="flex items-center overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {letters.map((letter, index) => (
                    <motion.span
                      key={index}
                      className="inline-block text-3xl font-bold tracking-tight"
                      style={{
                        color: index < 5 
                          ? (isDark ? "#ffffff" : "#1e3a5f") 
                          : "#3d8bd8",
                        textShadow: isDark 
                          ? "0 2px 15px rgba(61,139,216,0.4)" 
                          : "0 2px 10px rgba(61,139,216,0.2)",
                        fontFamily: "var(--font-poppins), sans-serif",
                      }}
                      initial={{
                        opacity: 0,
                        rotateX: -90,
                        y: 30,
                        filter: "blur(8px)",
                      }}
                      animate={{
                        opacity: 1,
                        rotateX: 0,
                        y: 0,
                        filter: "blur(0px)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: index * 0.07,
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Subtle tagline */}
            <AnimatePresence>
              {phase >= 1 && (
                <motion.p
                  className="text-xs tracking-[0.3em] uppercase font-medium"
                  style={{ color: isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(30, 58, 95, 0.5)" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
                >
                  Connect & Chat
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom wave decoration */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          >
            <svg
              viewBox="0 0 1440 120"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,70 1440,60 L1440,120 L0,120 Z"
                fill={isDark ? "rgba(61,139,216,0.2)" : "rgba(61,139,216,0.1)"}
                animate={{
                  d: [
                    "M0,60 C360,120 720,0 1080,60 C1260,90 1380,70 1440,60 L1440,120 L0,120 Z",
                    "M0,80 C360,20 720,100 1080,40 C1260,60 1380,80 1440,70 L1440,120 L0,120 Z",
                    "M0,60 C360,120 720,0 1080,60 C1260,90 1380,70 1440,60 L1440,120 L0,120 Z",
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.path
                d="M0,80 C480,40 960,100 1440,80 L1440,120 L0,120 Z"
                fill={isDark ? "rgba(61,139,216,0.12)" : "rgba(61,139,216,0.06)"}
                animate={{
                  d: [
                    "M0,80 C480,40 960,100 1440,80 L1440,120 L0,120 Z",
                    "M0,90 C480,100 960,50 1440,90 L1440,120 L0,120 Z",
                    "M0,80 C480,40 960,100 1440,80 L1440,120 L0,120 Z",
                  ],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
