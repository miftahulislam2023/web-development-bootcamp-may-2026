interface TypingIndicatorProps {
  /** Name of the user currently typing */
  userName?: string;
}

/**
 * Animated typing indicator with three bouncing dots.
 * Shows nothing when no userName is provided.
 */
export function TypingIndicator({ userName }: TypingIndicatorProps) {
  if (!userName) return null;

  return (
    <div className="flex items-center gap-2 px-1">
      <div className="flex items-center gap-1 rounded-full bg-surface-elevated px-4 py-2.5">
        <span className="size-1.5 animate-bounce rounded-full bg-soft-accent [animation-delay:0ms]" />
        <span className="size-1.5 animate-bounce rounded-full bg-soft-accent [animation-delay:150ms]" />
        <span className="size-1.5 animate-bounce rounded-full bg-soft-accent [animation-delay:300ms]" />
      </div>
      <span className="text-xs text-text-muted">{userName} is typing…</span>
    </div>
  );
}
