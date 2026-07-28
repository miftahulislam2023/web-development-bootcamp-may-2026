import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UnreadBadge } from "@/components/chat/unread-badge";
import { cn } from "@/utils/utils";
import type { Chat } from "@/types/chat";

interface DirectMessageItemProps {
  dm: Chat;
  isActive?: boolean;
  onClick?: () => void;
}

/**
 * Single row in the Direct Messages list.
 * Shows avatar, user name, preview, timestamp, and unread badge.
 */
export function DirectMessageItem({
  dm,
  isActive = false,
  onClick,
}: DirectMessageItemProps) {
  return (
    <button
      id={`dm-${dm.id}`}
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-200",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50",
      )}
    >
      <Avatar size="default">
        <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
          {dm.initials}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium">
            {dm.name}
          </span>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {dm.timestamp}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {dm.lastMessage}
        </p>
      </div>

      <UnreadBadge count={dm.unreadCount} />
    </button>
  );
}
