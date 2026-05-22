import { Blocks } from "lucide-react";

import { cn } from "@/lib/cn";

/**
 * The product wordmark with its gradient logo mark.
 * `tone="inverse"` renders it for dark/gradient backgrounds.
 */
export function BrandMark({
  tone = "default",
  className,
}: {
  tone?: "default" | "inverse";
  className?: string;
}) {
  const inverse = tone === "inverse";
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-lg text-white",
          inverse ? "bg-white/15" : "bg-gradient-brand",
        )}
      >
        <Blocks className="size-5" />
      </span>
      <span
        className={cn(
          "font-semibold tracking-tight",
          inverse ? "text-white" : "text-fg",
        )}
      >
        Website Builder
      </span>
    </span>
  );
}
