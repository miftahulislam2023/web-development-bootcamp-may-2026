"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface SelectOption {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

interface SelectGroupProps {
  label?: string;
  value?: string | number;
  onChange: (value: string | number) => void;
  options?: SelectOption[];
  placeholder?: string;
  error?: string;
  icon?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  disabled?: boolean;
}

function SelectGroup({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  error,
  icon,
  className,
  containerClassName,
  disabled = false,
}: SelectGroupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string | number) => {
    if (disabled) return;
    onChange(optionValue);
    setIsOpen(false);
  };

  const isSelected = (optionValue: string | number) => {
    return String(value) === String(optionValue);
  };

  return (
    <div
      className={cn("w-full space-y-1.5", containerClassName)}
      ref={dropdownRef}
    >
      {label && (
        <label className="text-sm font-medium text-foreground/80 lowercase first-letter:uppercase block mb-1">
          {label}
        </label>
      )}

      <div className="relative group">
        <motion.button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-xl border bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition-colors",
            "hover:border-primary/50 hover:bg-muted/10",
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            className
          )}
          animate={{
            borderColor: error
              ? "var(--destructive)"
              : isOpen
              ? "var(--primary)"
              : "var(--input)",
            boxShadow: isOpen
              ? `0 0 0 2px ${
                  error ? "rgba(239, 68, 68, 0.2)" : "rgba(16, 185, 129, 0.2)"
                }`
              : "0 0 0 0px rgba(0, 0, 0, 0)",
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 truncate">
            {icon && (
              <span
                className={cn(
                  "text-muted-foreground group-hover:text-primary transition-colors",
                  isOpen && "text-primary"
                )}
              >
                {icon}
              </span>
            )}

            <span
              className={cn(
                "truncate",
                selectedOption
                  ? "text-foreground font-medium"
                  : "text-muted-foreground/50"
              )}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>

          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              isOpen ? "rotate-180 text-primary" : "rotate-0"
            )}
          />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 5, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-0 right-0 z-50 overflow-hidden rounded-xl border border-border bg-background/95 backdrop-blur-xs shadow-sm mt-1"
            >
              <div className="p-1 max-h-60 overflow-y-auto min-w-30">
                {options.length > 0 ? (
                  options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all text-left mb-0.5 last:mb-0",
                        isSelected(option.value)
                          ? "bg-primary text-primary-foreground font-semibold pr-4"
                          : "text-foreground hover:bg-muted/80 hover:pl-4"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {option.icon && (
                          <span
                            className={
                              isSelected(option.value)
                                ? "text-primary-foreground"
                                : "text-primary"
                            }
                          >
                            {option.icon}
                          </span>
                        )}
                        <span>{option.label}</span>
                      </div>

                      {isSelected(option.value) && (
                        <motion.div
                          layoutId="active-dot"
                          className="w-1.5 h-1.5 rounded-full bg-primary-foreground shadow-sm ml-2"
                        />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-4 text-sm text-center text-muted-foreground italic">
                    No options available
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1 text-xs text-destructive font-medium mt-1 ml-1"
          >
            <AlertCircle className="h-3 w-3" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SelectGroup;
export type { SelectGroupProps, SelectOption };
