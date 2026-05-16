import { cn } from "@/utils/utils";

interface StatusIndicatorProps {
  status: "online" | "offline" | "away" | "dnd";
  className?: string;
}

const statusStyles: Record<StatusIndicatorProps["status"], string> = {
  online: "bg-success",
  offline: "bg-text-muted",
  away: "bg-amber-400",
  dnd: "bg-danger",
};

/**
 * Colored dot that signals a user's online presence.
 */
export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  return (
    <span
      aria-label={`Status: ${status}`}
      className={cn(
        "inline-block size-2.5 rounded-full ring-2 ring-background",
        statusStyles[status],
        className,
      )}
    />
  );
}
