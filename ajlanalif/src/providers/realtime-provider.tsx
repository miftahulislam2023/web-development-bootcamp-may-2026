"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import { bumpDmUnreadCount, readDmUnreadCounts, readRoomUnreadCounts } from "@/lib/dm-unread";
import { getSocketClient } from "@/lib/socket/client";

type RealtimeProviderProps = {
  children: ReactNode;
};

type DirectMessagePayload = {
  id: string;
  content: string;
  conversationId: string;
  createdAt: string;
  editedAt?: string | null;
  deletedAt?: string | null;
  seenAt?: string | null;
  author: {
    id: string;
    username: string | null;
    name: string | null;
    image: string | null;
  };
};

type DirectMessageEventDetail = {
  kind: "message" | "edited" | "deleted";
  conversationId: string;
  message: DirectMessagePayload;
  sender: {
    id: string;
    username: string | null;
    name: string | null;
    image: string | null;
  };
};

type PresenceEventDetail = {
  userId: string;
  isOnline: boolean;
  lastSeenAt: string | null;
};

type UnreadEventDetail = {
  dm: Record<string, number>;
  rooms: Record<string, number>;
};

function getActiveConversationId(pathname: string | null) {
  if (!pathname) {
    return null;
  }

  const match = pathname.match(/^\/dm\/([^/]+)$/);
  return match ? match[1] : null;
}

function shouldNotifyForConversation(pathname: string | null, conversationId: string) {
  const activeConversationId = getActiveConversationId(pathname);
  const isVisible = typeof document !== "undefined" && document.visibilityState === "visible";

  return !isVisible || activeConversationId !== conversationId;
}

function notifyUnreadUpdate() {
  window.dispatchEvent(
    new CustomEvent<UnreadEventDetail>("realtime_unread_updated", {
      detail: {
        dm: readDmUnreadCounts(),
        rooms: readRoomUnreadCounts(),
      },
    })
  );
}

export function RealtimeProvider({ children }: RealtimeProviderProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const seenMessageIdsRef = useRef<Set<string>>(new Set());

  async function joinAllDirectConversations(socket: ReturnType<typeof getSocketClient>) {
    const response = await fetch("/api/conversations");

    if (!response.ok) {
      return;
    }

    const conversations = (await response.json()) as Array<{ id: string }>;

    for (const conversation of conversations) {
      socket.emit("join_conversation", {
        conversationId: conversation.id,
        markSeen: false,
      });
    }
  }

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) {
      return;
    }

    const socket = getSocketClient();

    const handleConnect = () => {
      socket.emit("authenticate", { userId: session.user.id });
    };

    const handleReconnect = () => {
      socket.emit("authenticate", { userId: session.user.id });
    };

    const handleAuthenticated = (payload: { userId?: string }) => {
      if (!payload?.userId || payload.userId !== session.user.id) {
        return;
      }

      void joinAllDirectConversations(socket);
    };

    const handleReceiveDirectMessage = (message: DirectMessagePayload) => {
      if (seenMessageIdsRef.current.has(message.id)) {
        return;
      }

      seenMessageIdsRef.current.add(message.id);
      const isOwnMessage = message.author.id === session.user.id;

      const shouldIncrementUnread = shouldNotifyForConversation(pathname, message.conversationId);

      if (!isOwnMessage && shouldIncrementUnread) {
        bumpDmUnreadCount(message.conversationId);
        notifyUnreadUpdate();
      }

      const senderName = message.author.username ?? message.author.name ?? "Unknown user";

      if (!isOwnMessage && shouldIncrementUnread) {
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.log("DM toast fired", message.id, message.conversationId);
        }

        toast.custom(
          (t) => (
            <div
              className={`max-w-sm rounded-2xl border border-cyan-400/20 bg-slate-950/95 px-4 py-3 shadow-2xl transition ${
                t.visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/80">Direct message</p>
              <p className="mt-1 text-sm font-semibold text-slate-50">{senderName}</p>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-300">
                {message.content.length > 120 ? `${message.content.slice(0, 117)}...` : message.content}
              </p>
            </div>
          ),
          { id: `dm-${message.id}` }
        );
      }

      window.dispatchEvent(
        new CustomEvent<DirectMessageEventDetail>("dm_updated", {
          detail: {
            kind: "message",
            conversationId: message.conversationId,
            message,
            sender: message.author,
          },
        })
      );
    };

    const handleMessageEdited = (payload: {
      messageId: string;
      conversationId?: string | null;
      content: string;
      editedAt: string;
      author: { id: string; username: string | null; image: string | null };
    }) => {
      window.dispatchEvent(
        new CustomEvent<DirectMessageEventDetail>("dm_updated", {
          detail: {
            kind: "edited",
            conversationId: payload.conversationId ?? "",
            message: {
              id: payload.messageId,
              content: payload.content,
              conversationId: payload.conversationId ?? "",
              createdAt: payload.editedAt,
              editedAt: payload.editedAt,
              deletedAt: null,
              seenAt: null,
              author: {
                id: payload.author.id,
                username: payload.author.username,
                name: null,
                image: payload.author.image,
              },
            },
            sender: {
              id: payload.author.id,
              username: payload.author.username,
              name: null,
              image: payload.author.image,
            },
          },
        })
      );
    };

    const handleMessageDeleted = (payload: { messageId: string; conversationId?: string | null; deletedAt: string }) => {
      window.dispatchEvent(
        new CustomEvent<DirectMessageEventDetail>("dm_updated", {
          detail: {
            kind: "deleted",
            conversationId: payload.conversationId ?? "",
            message: {
              id: payload.messageId,
              content: "[deleted]",
              conversationId: payload.conversationId ?? "",
              createdAt: payload.deletedAt,
              editedAt: null,
              deletedAt: payload.deletedAt,
              seenAt: null,
              author: {
                id: session.user.id,
                username: session.user.username ?? null,
                name: session.user.name ?? null,
                image: session.user.image ?? null,
              },
            },
            sender: {
              id: session.user.id,
              username: session.user.username ?? null,
              name: session.user.name ?? null,
              image: session.user.image ?? null,
            },
          },
        })
      );
    };

    const handleUserOnline = (payload: { userId: string }) => {
      window.dispatchEvent(
        new CustomEvent<PresenceEventDetail>("presence_updated", {
          detail: { userId: payload.userId, isOnline: true, lastSeenAt: null },
        })
      );
    };

    const handleUserOffline = (payload: { userId: string; lastSeenAt?: string }) => {
      window.dispatchEvent(
        new CustomEvent<PresenceEventDetail>("presence_updated", {
          detail: { userId: payload.userId, isOnline: false, lastSeenAt: payload.lastSeenAt ?? null },
        })
      );
    };

    socket.on("connect", handleConnect);
    socket.on("reconnect", handleReconnect);
    socket.on("authenticated", handleAuthenticated);
    socket.on("receive_direct_message", handleReceiveDirectMessage);
    socket.on("message_edited", handleMessageEdited);
    socket.on("message_deleted", handleMessageDeleted);
    socket.on("user_online", handleUserOnline);
    socket.on("user_offline", handleUserOffline);
    socket.connect();

    if (socket.connected) {
      socket.emit("authenticate", { userId: session.user.id });
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("reconnect", handleReconnect);
      socket.off("authenticated", handleAuthenticated);
      socket.off("receive_direct_message", handleReceiveDirectMessage);
      socket.off("message_edited", handleMessageEdited);
      socket.off("message_deleted", handleMessageDeleted);
      socket.off("user_online", handleUserOnline);
      socket.off("user_offline", handleUserOffline);
    };
  }, [pathname, session?.user?.id, session?.user?.image, session?.user?.name, session?.user?.username, status]);

  useEffect(() => {
    const handleRefresh = () => {
      notifyUnreadUpdate();
    };

    window.addEventListener("realtime_unread_refresh", handleRefresh);

    return () => {
      window.removeEventListener("realtime_unread_refresh", handleRefresh);
    };
  }, []);

  return children;
}