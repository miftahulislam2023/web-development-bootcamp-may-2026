import { cn } from "@/utils/cn";

export function Label({ className, ...props }) {
  return (
    <label
      className={cn("text-xs font-medium text-[var(--muted-foreground)]", className)}
      {...props}
    />
  );
}
