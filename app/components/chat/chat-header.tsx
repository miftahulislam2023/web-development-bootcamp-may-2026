import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu, Hash, Users } from "lucide-react";
import type { Chat } from "@/types/chat";

interface ChatHeaderProps {
  chat: Chat;
  onMenuClick?: () => void;
}

/**
 * Top bar of the active chat area.
 * Shows chat avatar/icon, name, and subtitle.
 */
export function ChatHeader({ chat, onMenuClick }: ChatHeaderProps) {
  const isDm = chat.type === "dm";

  return (
    <header className="flex items-center gap-3 border-b border-border px-5 py-4">
      {onMenuClick && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-muted-foreground md:hidden"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <Menu className="size-5" />
        </Button>
      )}

      {isDm ? (
        <Avatar size="default">
          <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs font-semibold">
            {chat.initials}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent">
          <Hash className="size-4 text-sidebar-accent-foreground" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <h2 className="truncate text-sm font-semibold text-foreground">
          {chat.name}
        </h2>
        <p className="text-xs text-muted-foreground">
          {isDm ? (
            "Direct message"
          ) : (
            <span className="flex items-center gap-1">
              <Users className="inline size-3" />
              {chat.memberCount} members
            </span>
          )}
        </p>
      </div>
    </header>
  );
}
