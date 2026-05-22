"use client";

import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Props ---
interface InputGroupProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"
> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconClassName?: string;
  containerClassName?: string;
  helperText?: string;
}

// --- Component ---
const InputGroup = React.forwardRef<HTMLInputElement, InputGroupProps>(
  (
    {
      label,
      error,
      icon,
      iconClassName,
      type = "text",
      className,
      containerClassName,
      placeholder,
      helperText,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    // Password toggle
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className={cn("w-full space-y-1", containerClassName)}>
        {/* Label */}
        {label && (
          <label className="text-sm font-medium text-foreground/80 first-letter:uppercase">
            {label}
          </label>
        )}

        <div className="relative group">
          {/* Icon */}
          {icon && (
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 right-4 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary z-10 pointer-events-none",
                iconClassName,
              )}
            >
              <span className="h-4 w-4 flex items-center justify-center">
                {icon}
              </span>
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "flex h-11 w-full rounded-full border-2 border-input bg-transparent px-4 py-2 text-sm shadow-sm transition-all duration-200 outline-none mt-0.5",
              "placeholder:text-muted-foreground/50",
              "disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pr-10",
              error && "border-destructive",
              className,
            )}
            placeholder={placeholder}
            {...props}
          />

          {/* Password Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 transition-transform hover:scale-110" />
              ) : (
                <Eye className="h-4 w-4 transition-transform hover:scale-110" />
              )}
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-1 text-xs text-destructive font-medium mt-1">
            <AlertCircle className="h-3 w-3" />
            <span>{error}</span>
          </div>
        )}

        {/* Helper Text */}
        {!error && helperText && (
          <p className="text-[0.8rem] text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  },
);

InputGroup.displayName = "InputGroup";

export default InputGroup;
export type { InputGroupProps };
