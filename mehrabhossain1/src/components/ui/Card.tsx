import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds a hover lift — for cards that act as links or buttons. */
  interactive?: boolean;
}

/** A surface container: rounded, hairline border, layered soft shadow. */
export function Card({ interactive = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-border bg-white shadow-card",
        interactive && "transition hover:-translate-y-1 hover:shadow-pop",
        className,
      )}
      {...props}
    />
  );
}
