import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/utils/utils";
import type { ChatMessage } from "@/types/chat";

interface MessageBubbleProps {
  message: ChatMessage;
  showSenderName?: boolean;
}

/**
 * A single message bubble.
 * - Own messages: right-aligned, primary accent background.
 * - Other messages: left-aligned, card background.
 */
export function MessageBubble({
  message,
  showSenderName = true,
}: MessageBubbleProps) {
  const { isOwn, sender, content, timestamp } = message;

  return (
    <div
      className={cn(
        "flex items-end gap-2.5",
        isOwn ? "flex-row-reverse" : "flex-row",
      )}
    >
      {!isOwn && (
        <Avatar size="sm">
          <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-[10px] font-semibold">
            {sender.initials}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed md:max-w-[65%]",
          isOwn
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-card text-card-foreground border border-border",
        )}
      >
        {!isOwn && showSenderName && (
          <p className="mb-1 text-xs font-semibold text-primary">
            {sender.name}
          </p>
        )}
        <p>{content}</p>
        <p
          className={cn(
            "mt-1.5 text-[10px]",
            isOwn ? "text-primary-foreground/60" : "text-muted-foreground",
          )}
        >
          {timestamp}
        </p>
      </div>
    </div>
  );
}
