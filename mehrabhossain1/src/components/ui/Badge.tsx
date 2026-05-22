import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type BadgeVariant = "neutral" | "accent" | "success" | "danger";

const VARIANTS: Record<BadgeVariant, string> = {
  neutral: "border-border bg-surface text-fg-muted",
  accent: "border-primary/20 bg-accent-soft text-primary-active",
  success: "border-primary/20 bg-accent-soft text-primary-active",
  danger: "border-danger/20 bg-rose-50 text-danger",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

/** A small pill — labels, statuses, counts. */
export function Badge({
  variant = "neutral",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}
