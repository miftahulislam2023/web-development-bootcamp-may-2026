import { cn } from "@/utils/utils";

interface UnreadBadgeProps {
  count: number;
  className?: string;
}

/**
 * Small pill badge showing unread message count.
 * Hidden when count is 0.
 */
export function UnreadBadge({ count, className }: UnreadBadgeProps) {
  if (count === 0) return null;

  return (
    <span
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground",
        className,
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
