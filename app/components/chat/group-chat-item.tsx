import { UnreadBadge } from "@/components/chat/unread-badge";
import { cn } from "@/utils/utils";
import { Hash } from "lucide-react";
import type { Chat } from "@/types/chat";

interface GroupChatItemProps {
  group: Chat;
  isActive?: boolean;
  onClick?: () => void;
}

/**
 * Single row in the Group Chats list.
 * Shows hash icon, group name, member count, preview, and unread badge.
 */
export function GroupChatItem({
  group,
  isActive = false,
  onClick,
}: GroupChatItemProps) {
  return (
    <button
      id={`gc-${group.id}`}
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-200",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50",
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent">
        <Hash className="size-4 text-sidebar-accent-foreground" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium">
            {group.name}
          </span>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {group.timestamp}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {group.memberCount || 0} members · {group.lastMessage}
        </p>
      </div>

      <UnreadBadge count={group.unreadCount} />
    </button>
  );
}
