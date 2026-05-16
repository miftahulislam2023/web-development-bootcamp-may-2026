"use client";

import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";
import type { DmConversationSummary, DmUser } from "@/lib/dm";

type ConversationSidebarProps = {
  conversations: DmConversationSummary[];
  activeConversationId?: string | null;
  isLoadingConversations: boolean;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  searchResults: DmUser[];
  isSearching: boolean;
  onStartConversation: (targetUserId: string) => void;
  emptyLabel: string;
  activeSection?: "dm" | "rooms";
  presenceByUserId?: Record<string, { isOnline: boolean; lastSeenAt?: string | null }>;
  unreadByConversationId?: Record<string, number>;
  typingByConversationId?: Record<string, boolean>;
};

function avatarSeed(user: DmUser) {
  return (user.username ?? user.name ?? "User").trim().charAt(0).toUpperCase();
}

function formatPreview(message: DmConversationSummary["latestMessage"]) {
  if (!message) {
    return "No messages yet.";
  }

  if (message.deletedAt) {
    return "Message deleted.";
  }

  return message.content;
}

export function ConversationSidebar({
  conversations,
  activeConversationId,
  isLoadingConversations,
  searchQuery,
  setSearchQuery,
  searchResults,
  isSearching,
  onStartConversation,
  emptyLabel,
  activeSection = "dm",
  presenceByUserId,
  unreadByConversationId,
  typingByConversationId,
}: ConversationSidebarProps) {
  const dmLinkClassName =
    activeSection === "dm"
      ? "rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold text-slate-50"
      : "rounded-full border border-cyan-400/20 bg-slate-950/60 px-4 py-2 text-xs font-semibold text-slate-100 transition hover:border-cyan-300/35 hover:bg-slate-900";
  const roomsLinkClassName =
    activeSection === "rooms"
      ? "rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold text-slate-50"
      : "rounded-full border border-cyan-400/20 bg-slate-950/60 px-4 py-2 text-xs font-semibold text-slate-100 transition hover:border-cyan-300/35 hover:bg-slate-900";

  return (
    <aside className="rounded-[28px] border border-cyan-400/12 bg-slate-950/75 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-6 lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">Direct messages</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50">Messages</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">Search for a user or continue an existing conversation.</p>
      </div>

      <div className="mt-5 space-y-3">
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search by username"
          className="w-full rounded-xl border border-cyan-400/10 bg-slate-900/80 px-3 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-400/25"
        />

        {searchQuery.trim().length > 0 ? (
          <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Search results</p>
            {isSearching ? (
              <p className="mt-3 text-sm text-slate-400">Searching...</p>
            ) : searchResults.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">No matching users.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {searchResults.map((user) => (
                  <li key={user.id}>
                    <button
                      type="button"
                      onClick={() => onStartConversation(user.id)}
                      className="flex w-full items-center gap-3 rounded-2xl border border-transparent bg-slate-900/70 px-3 py-3 text-left transition hover:border-cyan-400/20 hover:bg-slate-900"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-400/15 bg-cyan-400/10 text-xs font-semibold text-cyan-100">
                        {avatarSeed(user)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-slate-100">{user.username ?? user.name ?? "Unknown"}</span>
                        <span className="block truncate text-xs text-slate-400">Start a direct conversation</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Conversations</h3>
      </div>

      <div className="mt-4 rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-slate-300">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Quick links</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/dm" className={dmLinkClassName} aria-current={activeSection === "dm" ? "page" : undefined}>
            DMs
          </Link>
          <Link href="/chat" className={roomsLinkClassName} aria-current={activeSection === "rooms" ? "page" : undefined}>
            Rooms
          </Link>
          <LogoutButton />
        </div>
      </div>

      {isLoadingConversations ? (
        <div className="mt-4 space-y-3">
          {[1, 2, 3].map((index) => (
            <div key={index} className="h-20 animate-pulse rounded-2xl border border-white/5 bg-white/5" />
          ))}
        </div>
      ) : null}

      {!isLoadingConversations && conversations.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-cyan-400/15 bg-slate-900/50 p-4 text-sm text-slate-400">
          {emptyLabel}
        </div>
      ) : null}

      {!isLoadingConversations && conversations.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {conversations.map((conversation) => {
            const isActive = conversation.id === activeConversationId;
            const preview = formatPreview(conversation.latestMessage);
            const displayName = conversation.otherUser.username ?? conversation.otherUser.name ?? "Unknown";
            const presence = presenceByUserId?.[conversation.otherUser.id];
            const isOnline = presence?.isOnline ?? false;
            const unreadCount = unreadByConversationId?.[conversation.id] ?? 0;
            const isTyping = typingByConversationId?.[conversation.id] ?? false;
            const previewText = isTyping ? `${displayName} is typing...` : preview;

            return (
              <li key={conversation.id}>
                <Link
                  href={`/dm/${conversation.id}`}
                  className={`block rounded-2xl border px-4 py-3 transition ${
                    isActive
                      ? "border-cyan-300/30 bg-cyan-400/10 text-slate-50"
                      : "border-white/5 bg-white/5 text-slate-200 hover:border-cyan-400/20 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-400/15 bg-cyan-400/10 text-xs font-semibold text-cyan-100">
                      {avatarSeed(conversation.otherUser)}
                      <span
                        className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-slate-950 ${isOnline ? "bg-emerald-300" : "bg-slate-500"}`}
                        title={isOnline ? "Online" : "Offline"}
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate text-sm font-medium">{displayName}</span>
                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && !isActive ? (
                            <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
                              {unreadCount}
                            </span>
                          ) : null}
                          {isActive ? (
                            <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
                              Active
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <p className={`mt-1 truncate text-xs leading-5 ${isTyping ? "text-cyan-100" : "text-slate-400"}`}>{previewText}</p>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </aside>
  );
}
