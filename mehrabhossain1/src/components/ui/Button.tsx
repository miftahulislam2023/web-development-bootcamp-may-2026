import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "gradient"
  | "secondary"
  | "ghost"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-btn " +
  "font-medium transition duration-150 ease-out " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 " +
  "focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-sm hover:-translate-y-px hover:bg-primary-hover active:bg-primary-active",
  gradient:
    "bg-gradient-brand text-white shadow-glow hover:-translate-y-px active:translate-y-0",
  secondary:
    "border border-border bg-white text-fg shadow-sm hover:-translate-y-px hover:bg-surface",
  ghost: "text-fg hover:bg-fg/5",
  danger:
    "bg-danger text-white shadow-sm hover:-translate-y-px hover:bg-danger-hover",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

/**
 * Returns the button className for a variant/size — use this to style a
 * `<Link>` or `<a>` so it matches `<Button>` exactly without a polymorphic
 * component.
 */
export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClass(variant, size, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
