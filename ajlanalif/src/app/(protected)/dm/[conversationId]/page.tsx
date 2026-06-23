"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import { ConversationSidebar } from "@/components/dm/conversation-sidebar";
import { LogoutButton } from "@/components/auth/logout-button";
import { bumpDmUnreadCount, clearDmUnreadCount, getTotalUnreadCount, readDmUnreadCounts, readRoomUnreadCounts } from "@/lib/dm-unread";
import { getSocketClient } from "@/lib/socket/client";
import type { DmConversationSummary, DmMessage, DmUser } from "@/lib/dm";

type ConversationDetail = {
  conversation: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  otherUser: DmUser;
};

type DirectMessagesResponse = {
  messages: DmMessage[];
  nextCursor: string | null;
};

type DmSocketMessage = {
  id: string;
  content: string;
  conversationId: string;
  createdAt: string;
  seenAt?: string | null;
  author: {
    id: string;
    username: string | null;
    name: string | null;
    image: string | null;
  };
};

type MessageEditedPayload = {
  messageId: string;
  content: string;
  editedAt: string;
  author: {
    id: string;
    username: string | null;
    image: string | null;
  };
};

type MessageDeletedPayload = {
  messageId: string;
  deletedAt: string;
};

type MessageSeenPayload = {
  conversationId: string;
  messageIds: string[];
  seenAt: string;
  seenByUserId: string;
};

type PresenceSnapshotPayload = {
  userIds: string[];
};

type PresenceEventPayload = {
  userId: string;
  lastSeenAt?: string;
};

type DirectTypingPayload = {
  conversationId: string;
  user: {
    id: string;
    username: string | null;
  };
};

type DirectMessageBrowserEventDetail = {
  kind: "message" | "edited" | "deleted";
  conversationId: string;
  message: {
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
  sender: {
    id: string;
    username: string | null;
    name: string | null;
    image: string | null;
  };
};

type PresenceBrowserEventDetail = {
  userId: string;
  isOnline: boolean;
  lastSeenAt: string | null;
};

type UnreadBrowserEventDetail = {
  dm: Record<string, number>;
  rooms: Record<string, number>;
};

type SocketConnectionState = "connected" | "connecting" | "reconnecting" | "disconnected";

type LoadMessagesOptions = {
  showLoading?: boolean;
  scrollToBottom?: boolean;
  preserveScrollPosition?: boolean;
  appendAtTop?: boolean;
  syncing?: boolean;
};

const socketStatusCopy: Record<SocketConnectionState, string> = {
  connected: "Connected",
  connecting: "Connecting...",
  reconnecting: "Reconnecting...",
  disconnected: "Disconnected",
};

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function avatarLabel(user: DmUser) {
  return (user.username ?? user.name ?? "?").trim().charAt(0).toUpperCase();
}

function formatLastSeen(lastSeenAt: string | null | undefined) {
  if (!lastSeenAt) {
    return "Last seen recently";
  }

  const timestamp = new Date(lastSeenAt).getTime();

  if (!Number.isFinite(timestamp)) {
    return "Last seen recently";
  }

  const diffMs = Date.now() - timestamp;

  if (diffMs < 60_000) {
    return "Last seen recently";
  }

  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 60) {
    return `Last seen ${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `Last seen ${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `Last seen ${diffDays}d ago`;
}

export default function DirectMessagePage() {
  const router = useRouter();
  const params = useParams<{ conversationId: string }>();
  const conversationId = params.conversationId;
  const { data: session, status } = useSession();

  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [conversations, setConversations] = useState<DmConversationSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DmUser[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [messages, setMessages] = useState<DmMessage[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [isConversationLoading, setIsConversationLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSocketAuthenticated, setIsSocketAuthenticated] = useState(false);
  const [socketStatus, setSocketStatus] = useState<SocketConnectionState>("disconnected");
  const [error, setError] = useState<string | null>(null);
  const [presenceByUserId, setPresenceByUserId] = useState<Record<string, { isOnline: boolean; lastSeenAt: string | null }>>({});
  const [typingByConversationId, setTypingByConversationId] = useState<Record<string, boolean>>({});
  const [activeTypingUsers, setActiveTypingUsers] = useState<Array<{ id: string; username: string | null }>>([]);
  const [unreadByConversationId, setUnreadByConversationId] = useState<Record<string, number>>({});
  const [roomUnreadByRoomId, setRoomUnreadByRoomId] = useState<Record<string, number>>({});
  const [isWindowFocused, setIsWindowFocused] = useState(true);

  const messagesViewportRef = useRef<HTMLDivElement | null>(null);
  const shouldStickToBottomRef = useRef(true);
  const reconnectToastVisibleRef = useRef(false);
  const isLoadingOlderRef = useRef(false);
  const editingMessageIdRef = useRef<string | null>(null);
  const topLoadArmedRef = useRef(true);
  const typingTimeoutByConversationIdRef = useRef<Map<string, number>>(new Map());
  const localTypingTimeoutRef = useRef<number | null>(null);
  const isLocallyTypingRef = useRef(false);
  const conversationsRef = useRef<DmConversationSummary[]>([]);
  const notifiedDmMessageIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    editingMessageIdRef.current = editingMessageId;
  }, [editingMessageId]);

  useEffect(() => {
    isLoadingOlderRef.current = isLoadingOlder;
  }, [isLoadingOlder]);

  useEffect(() => {
    setUnreadByConversationId(readDmUnreadCounts());
    setRoomUnreadByRoomId(readRoomUnreadCounts());
  }, []);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  useEffect(() => {
    const handleDmUpdated = (event: Event) => {
      const detail = (event as CustomEvent<DirectMessageBrowserEventDetail>).detail;

      if (!detail?.conversationId) {
        return;
      }

      setUnreadByConversationId(readDmUnreadCounts());
      setRoomUnreadByRoomId(readRoomUnreadCounts());

      setConversations((current) => {
        const updatedAt = new Date().toISOString();
        const next = current.map((entry) => {
          if (entry.id !== detail.conversationId) {
            return entry;
          }

          return {
            ...entry,
            updatedAt,
            latestMessage: {
              ...detail.message,
              editedAt: detail.message.editedAt ?? null,
              deletedAt: detail.message.deletedAt ?? null,
              seenAt: detail.message.seenAt ?? null,
            },
          };
        });

        return next.sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());
      });

      if (detail.conversationId !== conversationId) {
        return;
      }

      if (detail.kind === "message") {
        setMessages((current) => {
          if (current.some((message) => message.id === detail.message.id)) {
            return current;
          }

          return [
            ...current,
            {
              id: detail.message.id,
              content: detail.message.content,
              conversationId: detail.message.conversationId,
              createdAt: detail.message.createdAt,
              editedAt: detail.message.editedAt ?? null,
              deletedAt: detail.message.deletedAt ?? null,
              seenAt: detail.message.seenAt ?? null,
              author: {
                id: detail.message.author.id,
                username: detail.message.author.username,
                name: detail.message.author.name,
                image: detail.message.author.image,
              },
            },
          ];
        });
      }

      if (detail.kind === "edited") {
        setMessages((current) =>
          current.map((message) =>
            message.id === detail.message.id
              ? { ...message, content: detail.message.content, editedAt: detail.message.editedAt ?? null, deletedAt: null }
              : message
          )
        );
      }

      if (detail.kind === "deleted") {
        setMessages((current) =>
          current.map((message) =>
            message.id === detail.message.id ? { ...message, content: "[deleted]", deletedAt: detail.message.deletedAt ?? null } : message
          )
        );
      }

      if (editingMessageIdRef.current === detail.message.id) {
        setEditingMessageId(null);
        setEditingContent("");
      }
    };

    const handlePresenceUpdated = (event: Event) => {
      const detail = (event as CustomEvent<PresenceBrowserEventDetail>).detail;

      if (!detail?.userId) {
        return;
      }

      setPresenceByUserId((current) => ({
        ...current,
        [detail.userId]: {
          isOnline: detail.isOnline,
          lastSeenAt: detail.lastSeenAt,
        },
      }));
    };

    const handleUnreadUpdated = (event: Event) => {
      const detail = (event as CustomEvent<UnreadBrowserEventDetail>).detail;

      if (!detail) {
        return;
      }

      setUnreadByConversationId(detail.dm);
      setRoomUnreadByRoomId(detail.rooms);
    };

    window.addEventListener("dm_updated", handleDmUpdated);
    window.addEventListener("presence_updated", handlePresenceUpdated);
    window.addEventListener("realtime_unread_updated", handleUnreadUpdated);

    return () => {
      window.removeEventListener("dm_updated", handleDmUpdated);
      window.removeEventListener("presence_updated", handlePresenceUpdated);
      window.removeEventListener("realtime_unread_updated", handleUnreadUpdated);
    };
  }, [conversationId]);

  useEffect(() => {
    const updateWindowState = () => {
      setIsWindowFocused(document.visibilityState === "visible" && window.document.hasFocus());
    };

    updateWindowState();
    window.addEventListener("focus", updateWindowState);
    window.addEventListener("blur", updateWindowState);
    document.addEventListener("visibilitychange", updateWindowState);

    return () => {
      window.removeEventListener("focus", updateWindowState);
      window.removeEventListener("blur", updateWindowState);
      document.removeEventListener("visibilitychange", updateWindowState);
    };
  }, []);

  useEffect(() => {
    const totalUnread = getTotalUnreadCount({ dm: unreadByConversationId, rooms: roomUnreadByRoomId });

    document.title = totalUnread > 0 ? `(${totalUnread}) Realtime Chat App` : "Realtime Chat App";

    return () => {
      document.title = "Realtime Chat App";
    };
  }, [roomUnreadByRoomId, unreadByConversationId]);

  function normalizeMessages(entries: DmMessage[]) {
    const seen = new Set<string>();
    const uniqueMessages: DmMessage[] = [];

    for (const entry of entries) {
      if (seen.has(entry.id)) {
        continue;
      }

      seen.add(entry.id);
      uniqueMessages.push(entry);
    }

    return uniqueMessages;
  }

  function updateConversationPreview(latestMessage: DmMessage | null, onlyWhenLatestMessageMatches?: string) {
    const updatedAt = new Date().toISOString();

    setConversations((current) => {
      const next = current.map((entry) => {
        if (entry.id !== conversationId) {
          return entry;
        }

        if (onlyWhenLatestMessageMatches && entry.latestMessage?.id !== onlyWhenLatestMessageMatches) {
          return entry;
        }

        return {
          ...entry,
          updatedAt,
          latestMessage: latestMessage ?? entry.latestMessage,
        };
      });

      return next.sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());
    });
  }

  function scrollMessagesToBottom(behavior: ScrollBehavior = "auto") {
    messagesViewportRef.current?.scrollTo({ top: messagesViewportRef.current.scrollHeight, behavior });
  }

  function handleMessagesScroll() {
    const viewport = messagesViewportRef.current;

    if (!viewport) {
      return;
    }

    const distanceFromTop = viewport.scrollTop;
    const distanceFromBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
    shouldStickToBottomRef.current = distanceFromBottom < 120;

    if (distanceFromTop > 260) {
      topLoadArmedRef.current = true;
    }

    if (topLoadArmedRef.current && distanceFromTop < 160 && nextCursor && messages.length > 0 && !isLoadingOlderRef.current && !isLoadingMessages) {
      topLoadArmedRef.current = false;
      void loadOlderMessages();
    }
  }

  async function loadConversations() {
    setIsLoadingConversations(true);

    try {
      const response = await fetch("/api/conversations");

      if (!response.ok) {
        throw new Error("Failed to load conversations.");
      }

      const payload = (await response.json()) as DmConversationSummary[];
      setConversations(payload);
      setPresenceByUserId((current) => {
        const next = { ...current };

        for (const entry of payload) {
          next[entry.otherUser.id] = {
            isOnline: current[entry.otherUser.id]?.isOnline ?? false,
            lastSeenAt: entry.otherUser.lastSeenAt ?? current[entry.otherUser.id]?.lastSeenAt ?? null,
          };
        }

        return next;
      });
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Failed to load conversations.";
      toast.error(message);
    } finally {
      setIsLoadingConversations(false);
    }
  }

  async function loadConversation() {
    setIsConversationLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/conversations/${conversationId}`);

      if (response.status === 404) {
        setConversation(null);
        return;
      }

      if (response.status === 401 || response.status === 403) {
        const message = "You need to sign in again to continue.";
        setError(message);
        toast.error(message);
        setConversation(null);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load conversation.");
      }

      const payload = (await response.json()) as ConversationDetail;
      setConversation(payload);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Failed to load conversation.";
      setError(message);
      toast.error(message);
      setConversation(null);
    } finally {
      setIsConversationLoading(false);
    }
  }

  async function loadMessages(cursor?: string, options: LoadMessagesOptions = {}) {
    if (options.showLoading) {
      setIsLoadingMessages(true);
    }

    if (options.syncing) {
      setIsSyncing(true);
    }

    const viewport = messagesViewportRef.current;
    const previousScrollHeight = viewport?.scrollHeight ?? 0;
    const previousScrollTop = viewport?.scrollTop ?? 0;
    const shouldAutoScroll = options.scrollToBottom ?? shouldStickToBottomRef.current;

    const query = new URLSearchParams({ conversationId, limit: "20" });

    if (cursor) {
      query.set("cursor", cursor);
    }

    const response = await fetch(`/api/direct-messages?${query.toString()}`);

    if (response.status === 401 || response.status === 403) {
      const message = "You need to sign in again to view messages.";
      setError(message);
      toast.error(message);
      setIsLoadingMessages(false);
      setIsLoadingOlder(false);
      setIsSyncing(false);
      return;
    }

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ message: "Failed to fetch messages." }));
      setError(payload.message ?? "Failed to fetch messages.");
      toast.error(payload.message ?? "Failed to fetch messages.");
      setIsLoadingMessages(false);
      setIsLoadingOlder(false);
      setIsSyncing(false);
      return;
    }

    const payload = (await response.json()) as DirectMessagesResponse;
    const normalizedMessages = normalizeMessages(payload.messages.slice().reverse());

    setMessages((current) => (cursor || options.appendAtTop ? normalizeMessages([...normalizedMessages, ...current]) : normalizedMessages));
    setNextCursor(payload.nextCursor);
    setIsLoadingMessages(false);

    if (!cursor && !options.appendAtTop) {
      updateConversationPreview(normalizedMessages[normalizedMessages.length - 1] ?? null);
    }

    requestAnimationFrame(() => {
      const currentViewport = messagesViewportRef.current;

      if (!currentViewport) {
        setIsLoadingOlder(false);
        setIsSyncing(false);
        return;
      }

      if (cursor || options.appendAtTop) {
        currentViewport.scrollTop = currentViewport.scrollHeight - previousScrollHeight + previousScrollTop;
      } else if (shouldAutoScroll) {
        scrollMessagesToBottom("auto");
      } else if (options.preserveScrollPosition) {
        currentViewport.scrollTop = previousScrollTop;
      }

      setIsLoadingOlder(false);
      setIsSyncing(false);
    });
  }

  async function loadOlderMessages() {
    if (!nextCursor || isLoadingOlderRef.current) {
      return;
    }

    isLoadingOlderRef.current = true;
    setIsLoadingOlder(true);
    await loadMessages(nextCursor, { appendAtTop: true, preserveScrollPosition: true });
    setIsLoadingOlder(false);
    isLoadingOlderRef.current = false;
  }

  useEffect(() => {
    setMessages([]);
    setNextCursor(null);
    setContent("");
    setEditingMessageId(null);
    setEditingContent("");
    setError(null);
    setSocketStatus("disconnected");
    setIsLoadingMessages(true);
    setIsLoadingOlder(false);
    setIsSyncing(false);
    topLoadArmedRef.current = true;
    setTypingByConversationId((current) => {
      const { [conversationId]: _removed, ...next } = current;
      return next;
    });
    setUnreadByConversationId(clearDmUnreadCount(conversationId));
    void loadConversations();
    void loadConversation();
  }, [conversationId]);

  useEffect(() => {
    if (!conversation) {
      return;
    }

    void loadMessages(undefined, { showLoading: true, scrollToBottom: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation]);

  useEffect(() => {
    if (!conversation || status !== "authenticated" || !session?.user?.id) {
      return;
    }

    const socket = getSocketClient();

    const clearTypingConversation = (targetConversationId: string) => {
      setTypingByConversationId((current) => {
        if (!current[targetConversationId]) {
          return current;
        }

        const { [targetConversationId]: _removed, ...next } = current;
        return next;
      });

      if (targetConversationId === conversationId) {
        setActiveTypingUsers([]);
      }
    };

    const scheduleTypingAutoStop = (targetConversationId: string) => {
      const timeoutMap = typingTimeoutByConversationIdRef.current;
      const existingTimeout = timeoutMap.get(targetConversationId);

      if (typeof existingTimeout === "number") {
        window.clearTimeout(existingTimeout);
      }

      const timeout = window.setTimeout(() => {
        timeoutMap.delete(targetConversationId);
        clearTypingConversation(targetConversationId);
      }, 1800);

      timeoutMap.set(targetConversationId, timeout);
    };

    const joinConversationAndSync = () => {
      socket.emit("join_conversation", conversationId);
      setUnreadByConversationId(clearDmUnreadCount(conversationId));
      void loadMessages(undefined, {
        preserveScrollPosition: true,
        scrollToBottom: shouldStickToBottomRef.current,
        syncing: true,
      });
    };

    const handleDmUpdated = (event: Event) => {
      const detail = (event as CustomEvent<DirectMessageBrowserEventDetail>).detail;

      if (!detail?.conversationId) {
        return;
      }

      setUnreadByConversationId(readDmUnreadCounts());
      setRoomUnreadByRoomId(readRoomUnreadCounts());

      setConversations((current) => {
        const updatedAt = new Date().toISOString();
        const next = current.map((entry) => {
          if (entry.id !== detail.conversationId) {
            return entry;
          }

          return {
            ...entry,
            updatedAt,
            latestMessage: {
              ...detail.message,
              editedAt: detail.message.editedAt ?? null,
              deletedAt: detail.message.deletedAt ?? null,
              seenAt: detail.message.seenAt ?? null,
            },
          };
        });

        return next.sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());
      });

      if (detail.conversationId !== conversationId) {
        return;
      }

      if (detail.kind === "message") {
        setMessages((current) => {
          if (current.some((message) => message.id === detail.message.id)) {
            return current;
          }

          return [
            ...current,
            {
              id: detail.message.id,
              content: detail.message.content,
              conversationId: detail.message.conversationId,
              createdAt: detail.message.createdAt,
              editedAt: detail.message.editedAt ?? null,
              deletedAt: detail.message.deletedAt ?? null,
              seenAt: detail.message.seenAt ?? null,
              author: {
                id: detail.message.author.id,
                username: detail.message.author.username,
                name: detail.message.author.name,
                image: detail.message.author.image,
              },
            },
          ];
        });

        const viewport = messagesViewportRef.current;
        const distanceFromBottom = viewport ? viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight : 0;

        if (distanceFromBottom < 120) {
          requestAnimationFrame(() => scrollMessagesToBottom("smooth"));
        }
      }

      if (detail.kind === "edited") {
        setMessages((current) =>
          current.map((message) =>
            message.id === detail.message.id ? { ...message, content: detail.message.content, editedAt: detail.message.editedAt ?? null, deletedAt: null } : message
          )
        );
      }

      if (detail.kind === "deleted") {
        setMessages((current) =>
          current.map((message) =>
            message.id === detail.message.id ? { ...message, content: "[deleted]", deletedAt: detail.message.deletedAt ?? null } : message
          )
        );
      }

      if (editingMessageIdRef.current === detail.message.id) {
        setEditingMessageId(null);
        setEditingContent("");
      }

      clearTypingConversation(conversationId);
    };

    const handlePresenceUpdated = (event: Event) => {
      const detail = (event as CustomEvent<PresenceBrowserEventDetail>).detail;

      if (!detail?.userId) {
        return;
      }

      setPresenceByUserId((current) => ({
        ...current,
        [detail.userId]: {
          isOnline: detail.isOnline,
          lastSeenAt: detail.lastSeenAt,
        },
      }));
    };

    const handleUnreadUpdated = (event: Event) => {
      const detail = (event as CustomEvent<UnreadBrowserEventDetail>).detail;

      if (!detail) {
        return;
      }

      setUnreadByConversationId(detail.dm);
      setRoomUnreadByRoomId(detail.rooms);
    };

    const handleDirectTypingStart = (payload: DirectTypingPayload) => {
      if (payload.user.id === session.user.id) {
        return;
      }

      setTypingByConversationId((current) => ({
        ...current,
        [payload.conversationId]: true,
      }));

      if (payload.conversationId === conversationId) {
        setActiveTypingUsers((current) => {
          if (current.some((user) => user.id === payload.user.id)) {
            return current;
          }

          return [...current, payload.user];
        });
      }

      scheduleTypingAutoStop(payload.conversationId);
    };

    const handleDirectTypingStop = (payload: DirectTypingPayload) => {
      const timeoutMap = typingTimeoutByConversationIdRef.current;
      const existingTimeout = timeoutMap.get(payload.conversationId);

      if (typeof existingTimeout === "number") {
        window.clearTimeout(existingTimeout);
        timeoutMap.delete(payload.conversationId);
      }

      clearTypingConversation(payload.conversationId);
    };

    const handleMessageSeen = (payload: MessageSeenPayload) => {
      if (payload.conversationId !== conversationId || !payload.messageIds.length) {
        return;
      }

      const seenMessageIds = new Set(payload.messageIds);

      setMessages((current) => current.map((message) => (seenMessageIds.has(message.id) ? { ...message, seenAt: payload.seenAt } : message)));
    };

    const handleSocketError = (payload: { message?: string }) => {
      if (payload.message) {
        setError(payload.message);
        toast.error(payload.message);
      }
    };

    setSocketStatus(socket.connected ? "connected" : "connecting");
    socket.on("direct_typing_start", handleDirectTypingStart);
    socket.on("direct_typing_stop", handleDirectTypingStop);
    socket.on("message_seen", handleMessageSeen);
    socket.on("socket_error", handleSocketError);
    window.addEventListener("dm_updated", handleDmUpdated);
    window.addEventListener("presence_updated", handlePresenceUpdated);
    window.addEventListener("realtime_unread_updated", handleUnreadUpdated);

    if (socket.connected) {
      joinConversationAndSync();
    }

    return () => {
      socket.off("direct_typing_start", handleDirectTypingStart);
      socket.off("direct_typing_stop", handleDirectTypingStop);
      socket.off("message_seen", handleMessageSeen);
      socket.off("socket_error", handleSocketError);
      window.removeEventListener("dm_updated", handleDmUpdated);
      window.removeEventListener("presence_updated", handlePresenceUpdated);
      window.removeEventListener("realtime_unread_updated", handleUnreadUpdated);
      socket.emit("leave_conversation", conversationId);
      for (const timeout of typingTimeoutByConversationIdRef.current.values()) {
        window.clearTimeout(timeout);
      }
      typingTimeoutByConversationIdRef.current.clear();
      setActiveTypingUsers([]);
      setTypingByConversationId((current) => {
        const { [conversationId]: _removed, ...next } = current;
        return next;
      });
    };
  }, [conversation, conversationId, session?.user?.id, status]);

  useEffect(() => {
    void loadConversations();
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();

    if (query.length < 1) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let isActive = true;
    const timeout = window.setTimeout(async () => {
      setIsSearching(true);

      try {
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);

        if (!response.ok) {
          throw new Error("Failed to search users.");
        }

        const payload = (await response.json()) as DmUser[];

        if (isActive) {
          setSearchResults(payload);
        }
      } catch (caughtError) {
        const message = caughtError instanceof Error ? caughtError.message : "Failed to search users.";
        if (isActive) {
          toast.error(message);
        }
      } finally {
        if (isActive) {
          setIsSearching(false);
        }
      }
    }, 250);

    return () => {
      isActive = false;
      window.clearTimeout(timeout);
    };
  }, [searchQuery]);

  async function startConversation(targetUserId: string) {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetUserId }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.message ?? "Failed to open conversation.");
      }

      toast.success("Conversation opened.");
      router.push(`/dm/${payload.conversation.id}`);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Failed to open conversation.";
      toast.error(message);
    }
  }

  function stopLocalTyping() {
    const socket = getSocketClient();

    if (isLocallyTypingRef.current && socketStatus !== "disconnected") {
      socket.emit("direct_typing_stop", { conversationId });
    }

    isLocallyTypingRef.current = false;

    if (localTypingTimeoutRef.current) {
      window.clearTimeout(localTypingTimeoutRef.current);
      localTypingTimeoutRef.current = null;
    }
  }

  function handleComposerChange(nextValue: string) {
    setContent(nextValue);

    if (socketStatus === "disconnected") {
      return;
    }

    const socket = getSocketClient();
    const hasText = nextValue.trim().length > 0;

    if (!hasText) {
      stopLocalTyping();
      return;
    }

    if (!isLocallyTypingRef.current) {
      socket.emit("direct_typing_start", { conversationId });
      isLocallyTypingRef.current = true;
    }

    if (localTypingTimeoutRef.current) {
      window.clearTimeout(localTypingTimeoutRef.current);
    }

    localTypingTimeoutRef.current = window.setTimeout(() => {
      stopLocalTyping();
    }, 1200);
  }

  function saveEdit(messageId: string) {
    if (!editingContent.trim()) {
      return;
    }

    getSocketClient().emit("edit_message", {
      messageId,
      content: editingContent,
    });

    toast.success("Message updated.");
    setEditingMessageId(null);
    setEditingContent("");
  }

  function deleteMessage(messageId: string) {
    getSocketClient().emit("delete_message", { messageId });
    toast.success("Message deleted.");
  }

  async function sendMessage() {
    if (!content.trim()) {
      return;
    }

    if (socketStatus === "disconnected") {
      toast.error("Realtime connection is not ready yet.");
      return;
    }

    const shouldScroll = shouldStickToBottomRef.current;
    stopLocalTyping();
    getSocketClient().emit("send_direct_message", {
      conversationId,
      content,
    });

    setContent("");

    if (shouldScroll) {
      requestAnimationFrame(() => scrollMessagesToBottom("smooth"));
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    setError(null);

    await sendMessage();
    setIsSending(false);
  }

  const socketStatusTone: Record<SocketConnectionState, string> = {
    connected: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
    connecting: "border-cyan-400/20 bg-cyan-400/10 text-cyan-100",
    reconnecting: "border-amber-400/20 bg-amber-400/10 text-amber-100",
    disconnected: "border-rose-400/20 bg-rose-400/10 text-rose-100",
  };

  if (isConversationLoading) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex flex-1 items-center justify-center rounded-[28px] border border-cyan-400/12 bg-slate-950/75 px-6 py-10 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <p className="text-sm text-slate-300">Loading conversation...</p>
        </div>
      </main>
    );
  }

  if (!conversation) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex flex-1 items-center justify-center rounded-[28px] border border-cyan-400/12 bg-slate-950/75 px-6 py-10 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="max-w-md text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">Conversation unavailable</p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-50">Conversation not found</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">You may not have access to this conversation.</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link href="/dm" className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
                Back to DMs
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="grid flex-1 gap-4 lg:items-start lg:grid-cols-[320px_minmax(0,1fr)]">
        <ConversationSidebar
          conversations={conversations}
          activeConversationId={conversationId}
          isLoadingConversations={isLoadingConversations}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          isSearching={isSearching}
          onStartConversation={startConversation}
          emptyLabel="No conversations yet. Search a username to start one."
          activeSection="dm"
          presenceByUserId={presenceByUserId}
          unreadByConversationId={unreadByConversationId}
          typingByConversationId={typingByConversationId}
        />

        <section className="flex min-h-0 flex-col overflow-visible rounded-[28px] border border-cyan-400/12 bg-slate-950/75 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] lg:overflow-hidden">
          <header className="sticky top-0 z-40 flex flex-col gap-4 border-b border-white/5 bg-slate-950/95 px-5 py-5 backdrop-blur-xl sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">Direct conversation</p>
              <h1 className="mt-2 truncate text-2xl font-semibold tracking-tight text-slate-50">
                {conversation.otherUser.username ?? conversation.otherUser.name ?? "Unknown user"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Realtime direct messages with the same minimal architecture as room chat.</p>
              <p className="mt-1 text-xs text-slate-400">
                {presenceByUserId[conversation.otherUser.id]?.isOnline
                  ? "Online"
                  : formatLastSeen(presenceByUserId[conversation.otherUser.id]?.lastSeenAt ?? conversation.otherUser.lastSeenAt)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${socketStatusTone[socketStatus]}`}>
                {socketStatusCopy[socketStatus]}
              </span>
              <span
                className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                  presenceByUserId[conversation.otherUser.id]?.isOnline
                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
                    : "border-slate-400/20 bg-slate-500/10 text-slate-200"
                }`}
              >
                {presenceByUserId[conversation.otherUser.id]?.isOnline ? "Online" : "Offline"}
              </span>
              <Link href="/dm" className="rounded-full border border-cyan-400/20 bg-slate-950/60 px-4 py-2 text-xs font-semibold text-slate-100 transition hover:border-cyan-300/35 hover:bg-slate-900">
                Back to DMs
              </Link>
            </div>
          </header>

          {error ? <div className="border-b border-rose-400/15 bg-rose-400/10 px-5 py-3 text-sm text-rose-100 sm:px-6">{error}</div> : null}

          <div className="flex min-h-0 flex-1 flex-col">
            <div ref={messagesViewportRef} onScroll={handleMessagesScroll} className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 sm:px-6">
              {isSyncing ? (
                <div className="mb-4 flex justify-center">
                  <span className="rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100">Syncing latest messages...</span>
                </div>
              ) : null}

              {nextCursor ? (
                <div className="mb-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      void loadOlderMessages();
                    }}
                    disabled={isLoadingOlder}
                    className="rounded-full border border-cyan-400/20 bg-slate-950/60 px-4 py-2 text-xs font-semibold text-slate-100 transition hover:border-cyan-300/35 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoadingOlder ? "Loading older messages..." : "Load older messages"}
                  </button>
                </div>
              ) : null}

              {isLoadingMessages ? (
                <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-white/5 bg-white/5 text-center">
                  <div>
                    <p className="text-sm font-medium text-slate-100">Loading messages...</p>
                    <p className="mt-1 text-xs text-slate-400">Pulling the latest conversation history.</p>
                  </div>
                </div>
              ) : null}

              {!isLoadingMessages && messages.length === 0 ? (
                <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-dashed border-cyan-400/15 bg-slate-900/50 text-center">
                  <div>
                    <p className="text-sm font-medium text-slate-100">No messages yet</p>
                    <p className="mt-1 text-xs text-slate-400">Send the first message to start the conversation.</p>
                  </div>
                </div>
              ) : null}

              {!isLoadingMessages && messages.length > 0 ? (
                <ul className="space-y-3">
                  {messages.map((message) => {
                    const isOwnMessage = message.author.id === session?.user?.id;
                    const isEditingThisMessage = editingMessageId === message.id;
                    const displayName = message.author.username ?? message.author.name ?? "Unknown";
                    const deliveryStatus = isOwnMessage
                      ? message.seenAt
                        ? "Seen"
                        : socketStatus === "connected" && isSocketAuthenticated
                          ? "Delivered"
                          : "Sent"
                      : null;

                    return (
                      <li key={message.id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                        <article className={`max-w-[92%] rounded-3xl border px-4 py-3 shadow-lg sm:max-w-[78%] ${isOwnMessage ? "border-cyan-300/20 bg-gradient-to-br from-cyan-400/18 to-sky-500/10 text-slate-50" : "border-white/6 bg-slate-900/80 text-slate-50"}`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-3">
                              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${isOwnMessage ? "bg-cyan-400/20 text-cyan-100" : "bg-white/10 text-slate-200"}`}>{displayName.trim().charAt(0).toUpperCase()}</span>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-slate-100">{displayName}</p>
                                <p className="text-[11px] text-slate-400">{formatTimestamp(message.createdAt)}</p>
                              </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em]">
                              {message.editedAt ? <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-2 py-1 text-cyan-100">Edited</span> : null}
                              {message.deletedAt ? <span className="rounded-full border border-amber-300/20 bg-amber-400/10 px-2 py-1 text-amber-100">Deleted</span> : null}
                            </div>
                          </div>

                          {isEditingThisMessage ? (
                            <div className="mt-4 space-y-3">
                              <textarea
                                value={editingContent}
                                onChange={(event) => setEditingContent(event.target.value)}
                                className="block w-full rounded-2xl border border-cyan-400/10 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-400/25"
                                rows={3}
                              />
                              <div className="flex flex-wrap items-center gap-2">
                                <button type="button" onClick={() => saveEdit(message.id)} className="rounded-full bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300">Save</button>
                                <button type="button" onClick={() => { setEditingMessageId(null); setEditingContent(""); }} className="rounded-full border border-cyan-400/20 bg-slate-950/60 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-cyan-300/35 hover:bg-slate-900">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <p className={`mt-3 text-sm leading-6 ${message.deletedAt ? "italic text-slate-400" : "text-slate-100"}`}>{message.deletedAt ? "This message was deleted." : message.content}</p>
                          )}

                          {deliveryStatus && !isEditingThisMessage ? (
                            <p className="mt-2 text-right text-[11px] font-medium text-slate-400">{deliveryStatus}</p>
                          ) : null}

                          {isOwnMessage && !message.deletedAt && !isEditingThisMessage ? (
                            <div className="mt-4 flex flex-wrap items-center gap-2">
                              <button type="button" onClick={() => { setEditingMessageId(message.id); setEditingContent(message.content); }} className="rounded-full border border-cyan-400/20 bg-slate-950/60 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-cyan-300/35 hover:bg-slate-900">Edit</button>
                              <button type="button" onClick={() => deleteMessage(message.id)} className="rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs font-semibold text-rose-100 transition hover:bg-rose-400/15">Delete</button>
                            </div>
                          ) : null}
                        </article>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>

            <form onSubmit={onSubmit} className="border-t border-white/5 bg-slate-950/90 p-4 sm:p-5">
              {activeTypingUsers.length > 0 ? (
                <p className="mb-2 text-xs text-cyan-100">
                  {activeTypingUsers[0].username ?? "User"}
                  {activeTypingUsers.length > 1 ? ` and ${activeTypingUsers.length - 1} others` : ""} typing...
                </p>
              ) : null}
              <label htmlFor="content" className="text-sm font-semibold text-slate-100">New message</label>
              <textarea
                id="content"
                value={content}
                onChange={(event) => handleComposerChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
                className="mt-2 block w-full rounded-2xl border border-cyan-400/10 bg-slate-900/80 px-3 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-400/25"
                rows={3}
                placeholder="Write a direct message..."
                required
                disabled={isSending || socketStatus === "disconnected"}
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-400">Press Enter to send, Shift + Enter for a new line.</p>
                <button type="submit" disabled={isSending || socketStatus === "disconnected"} className="rounded-full bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60">{isSending ? "Sending..." : "Send"}</button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
