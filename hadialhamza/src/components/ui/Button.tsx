"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "motion/react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full disabled:opacity-50 disabled:pointer-events-none py-2.5 text-sm relative gap-2 overflow-hidden px-6 transition-colors duration-300",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active border-2 border-transparent",
        outline:
          "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
        ghost:
          "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
        danger:
          "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive-hover",
        icon: "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6 text-sm",
        lg: "h-14 px-10 text-base",
        icon: "h-11 w-11 px-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface ButtonProps
  extends HTMLMotionProps<"button">, VariantProps<typeof buttonVariants> {
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const Button = ({
  className,
  variant,
  size,
  icon,
  isLoading,
  children,
  ...props
}: ButtonProps) => {
  const isIcon = variant === "icon" || size === "icon";

  return (
    <motion.button
      initial="initial"
      whileHover="hover"
      whileTap={{ scale: 1 }}
      variants={{
        initial: { scale: 1 },
        hover: { scale: 1.03 },
      }}
      transition={{ type: "spring", stiffness: 300 }}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {/* Loading Spinner */}
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}

      {/* Text Content */}
      {!isIcon && (
        <motion.span className="relative z-10 font-bold tracking-wide flex items-center">
          {children}
        </motion.span>
      )}

      {/* Icon variant */}
      {!isLoading && isIcon && (
        <motion.span className="w-5 h-5 flex items-center justify-center">
          {icon || children}
        </motion.span>
      )}

      {/* Icon Effect */}
      {!isLoading && !isIcon && icon && (
        <motion.span
          className="w-5 h-5 flex items-center justify-center"
          variants={{
            initial: { x: 0 },
            hover: { x: 4 },
          }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {icon}
        </motion.span>
      )}
    </motion.button>
  );
};

export { Button, buttonVariants };
