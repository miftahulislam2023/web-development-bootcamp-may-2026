"use client";

import { Input } from "@/components/ui/input";
import { DirectMessageItem } from "@/components/chat/direct-message-item";
import { GroupChatItem } from "@/components/chat/group-chat-item";
import { UserProfileCard } from "@/components/chat/user-profile-card";
import { MessageSquare, Search, Users, UserPlus } from "lucide-react";
import { useChatContext } from "@/providers/chat-provider";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Button } from "../ui/button";

interface SidebarContentProps {
  onChatSelect?: () => void;
  onOpenFindFriends?: () => void;
  onOpenRequests?: () => void;
  onOpenCreateGroup?: () => void;
  onOpenMyFriends?: () => void;
}

/**
 * Sidebar content — shared between the desktop persistent sidebar
 * and the mobile sheet drawer.
 */
export function SidebarContent({ onChatSelect, onOpenFindFriends, onOpenRequests, onOpenCreateGroup, onOpenMyFriends }: SidebarContentProps) {
  const { state, selectChat, dmChats, groupChats } = useChatContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch("/api/friends/requests");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setRequestCount(data.data.length);
        }
      } catch (err) {
        console.error("Failed to fetch friend requests", err);
      }
    }
    fetchRequests();
  }, []);

  const handleSelectChat = useCallback(
    (chatId: string) => {
      selectChat(chatId);
      onChatSelect?.();
    },
    [selectChat, onChatSelect],
  );

  const filteredDms = useMemo(() => {
    if (!searchQuery.trim()) return dmChats;
    const q = searchQuery.toLowerCase();
    return dmChats.filter(
      (dm) =>
        dm.name.toLowerCase().includes(q) ||
        dm.lastMessage.toLowerCase().includes(q),
    );
  }, [searchQuery, dmChats]);

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groupChats;
    const q = searchQuery.toLowerCase();
    return groupChats.filter(
      (gc) =>
        gc.name.toLowerCase().includes(q) ||
        gc.lastMessage.toLowerCase().includes(q),
    );
  }, [searchQuery, groupChats]);

  return (
    <div className="flex h-full flex-col">
      {/* Logo / Title */}
      <div className="flex items-center gap-2.5 px-4 pt-5 pb-4">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary">
          <MessageSquare className="size-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-base font-semibold tracking-tight text-sidebar-foreground">
            DevConnect
          </h1>
          <p className="text-[11px] leading-none text-muted-foreground">
            Live Chatting Platform
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="sidebar-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations…"
            className="h-9 rounded-xl border-sidebar-border bg-card pl-9 text-sm placeholder:text-muted-foreground focus-visible:border-primary/60 focus-visible:ring-primary/20"
          />
        </div>
      </div>

      {/* Scrollable lists */}
      <div className="custom-scrollbar flex-1 overflow-y-auto px-3 pb-3">
        {/* Direct Messages */}
        <div className="pt-2">
          <div className="flex items-center gap-2 px-2 pb-2">
            <MessageSquare className="size-3.5 text-muted-foreground" />
            <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Direct Messages
            </h2>
          </div>
          <div className="space-y-0.5">
            {filteredDms.map((dm) => (
              <DirectMessageItem
                key={dm.id}
                dm={dm}
                isActive={state.activeChatId === dm.id}
                onClick={() => handleSelectChat(dm.id)}
              />
            ))}
            {filteredDms.length === 0 && (
              <p className="px-3 py-2 text-xs text-muted-foreground">
                No direct messages yet
              </p>
            )}
          </div>
        </div>

        {/* Separator */}
        <div className="my-3 h-px bg-sidebar-border" />

        {/* Group Chats */}
        <div>
          <div className="flex items-center gap-2 px-2 pb-2">
            <Users className="size-3.5 text-muted-foreground" />
            <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex-1">
              Group Chats
            </h2>
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-5 text-muted-foreground hover:text-foreground"
              onClick={onOpenCreateGroup}
              title="Create Group"
            >
              <UserPlus className="size-3.5" />
            </Button>
          </div>
          <div className="space-y-0.5">
            {filteredGroups.map((gc) => (
              <GroupChatItem
                key={gc.id}
                group={gc}
                isActive={state.activeChatId === gc.id}
                onClick={() => handleSelectChat(gc.id)}
              />
            ))}
            {filteredGroups.length === 0 && (
              <p className="px-3 py-2 text-xs text-muted-foreground">
                No group chats yet
              </p>
            )}
          </div>
        </div>

        {/* Separator */}
        <div className="my-3 h-px bg-sidebar-border" />

        {/* Social */}
        <div>
          <div className="flex items-center gap-2 px-2 pb-2">
            <Users className="size-3.5 text-muted-foreground" />
            <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex-1">
              Social
            </h2>
          </div>
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={onOpenMyFriends}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
            >
              <Users className="size-4 text-muted-foreground" />
              My Friends
            </button>
            <button
              type="button"
              onClick={onOpenFindFriends}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
            >
              <Search className="size-4 text-muted-foreground" />
              Find Friends
            </button>
            <button
              type="button"
              onClick={onOpenRequests}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
            >
              <div className="flex items-center gap-3">
                <UserPlus className="size-4 text-muted-foreground" />
                Friend Requests
              </div>
              {requestCount > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {requestCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="border-t border-sidebar-border p-3">
        <UserProfileCard />
      </div>
    </div>
  );
}
