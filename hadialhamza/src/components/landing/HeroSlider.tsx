"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/slider/dashboard.png",
    title: "Advanced Analytics",
    description: "Deep dive into your spending habits.",
  },
  {
    id: 2,
    image: "/slider/budget.png",
    title: "Smart Budgeting",
    description: "Set and manage budgets effortlessly.",
  },
  {
    id: 3,
    image: "/slider/goals.png",
    title: "Savings Goals",
    description: "Reach your financial milestones faster.",
  },
  {
    id: 4,
    image: "/slider/mobile.png",
    title: "Mobile Ready",
    description: "Access your finances on the go.",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full aspect-4/3 lg:aspect-square group">
      {/* Decorative Blur Background */}
      <div className="absolute -inset-4 bg-primary/20 blur-xl rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-500" />

      <div className="relative h-full w-full rounded-3xl overflow-hidden border border-border bg-card shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent" />

            {/* Slide Info */}
            <div className="absolute bottom-0 left-0 right-0 p-8 pt-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {slides[currentSlide].title}
                </h3>
                <p className="text-muted-foreground font-medium">
                  {slides[currentSlide].description}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={prevSlide}
            className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all duration-300 shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all duration-300 shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Indicators */}
        <div className="absolute top-6 right-8 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 bg-primary shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Floating UI Elements */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-6 bottom-4 z-10 hidden xl:flex items-center gap-3 p-4 bg-background/90 backdrop-blur-md rounded-2xl border border-border shadow-xl shadow-primary/5"
      >
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </div>
        <div className="pr-4">
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
            Live Updates
          </p>
          <p className="text-sm font-bold text-foreground">
            AI Monitoring Active
          </p>
        </div>
      </motion.div>
    </div>
  );
}
