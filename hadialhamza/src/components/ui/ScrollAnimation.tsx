"use client";

import React from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

interface ScrollAnimationProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "scale";
  delay?: number;
  duration?: number;
  className?: string;
  staggerChildren?: number;
  once?: boolean;
}

const springTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 20,
};

function getVariants(direction: string): Variants {
  switch (direction) {
    case "left":
      return {
        hidden: { opacity: 0, x: -100 },
        visible: { opacity: 1, x: 0, transition: springTransition },
      };
    case "right":
      return {
        hidden: { opacity: 0, x: 100 },
        visible: { opacity: 1, x: 0, transition: springTransition },
      };
    case "down":
      return {
        hidden: { opacity: 0, y: -60 },
        visible: { opacity: 1, y: 0, transition: springTransition },
      };
    case "scale":
      return {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: springTransition },
      };
    case "up":
    default:
      return {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: springTransition },
      };
  }
}

function ScrollAnimation({
  children,
  direction = "up",
  delay = 0,
  className,
  staggerChildren,
  once = true,
}: ScrollAnimationProps) {
  const itemVariants = getVariants(direction);

  if (staggerChildren) {
    const containerVariants: Variants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerChildren,
          delayChildren: delay,
        },
      },
    };

    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount: 0.1, margin: "0px" }}
        variants={containerVariants}
        className={cn(className)}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;

          return (
            <motion.div variants={itemVariants} className="w-full">
              {child}
            </motion.div>
          );
        })}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.1, margin: "0px" }}
      variants={itemVariants}
      transition={{ ...springTransition, delay }}
      className={cn("w-full h-full relative", className)}
    >
      {children}
    </motion.div>
  );
}

export default ScrollAnimation;
export type { ScrollAnimationProps };
