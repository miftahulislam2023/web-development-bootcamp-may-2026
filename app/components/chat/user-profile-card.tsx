"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Compact user profile card shown at the bottom of the sidebar.
 * Uses the authenticated user from AuthProvider.
 */
export function UserProfileCard() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const initials = getInitials(user.username);

  return (
    <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/60 px-3 py-3">
      <Avatar size="default">
        <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-sidebar-foreground">
          {user.username}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {user.email}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon-sm"
        className="shrink-0 text-muted-foreground hover:text-destructive"
        aria-label="Log out"
        onClick={() => logout()}
      >
        <LogOut className="size-4" />
      </Button>
    </div>
  );
}
