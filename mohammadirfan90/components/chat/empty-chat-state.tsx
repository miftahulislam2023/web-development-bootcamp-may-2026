import { MessageSquare, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyChatStateProps {
  onOpenFindFriends?: () => void;
  onOpenRequests?: () => void;
}

/**
 * Shown in the main area when no conversation is selected.
 * Provides useful actions: find friends, view requests.
 */
export function EmptyChatState({ onOpenFindFriends, onOpenRequests }: EmptyChatStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-sidebar-accent">
        <MessageSquare className="size-7 text-sidebar-accent-foreground" />
      </div>

      <div className="space-y-1.5">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Welcome to DevConnect
        </h2>
        <p className="max-w-xs text-sm text-muted-foreground">
          Find friends and start live conversations.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="default"
          size="sm"
          className="gap-1.5"
          onClick={onOpenFindFriends}
        >
          <Search className="size-3.5" />
          Find Friends
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={onOpenRequests}
        >
          <Users className="size-3.5" />
          View Requests
        </Button>
      </div>
    </div>
  );
}
