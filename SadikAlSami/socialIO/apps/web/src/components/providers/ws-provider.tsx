"use client";

import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { toast } from "sonner";

import { env } from "@socialIO/env/web";

import { useAuthStore } from "@/stores/auth-store";
import { useChatStore } from "@/stores/chat-store";
import { getWsUrl, WS_HEARTBEAT_INTERVAL, WS_RECONNECT_DELAY } from "@/lib/ws";
import { messageKeys, conversationKeys } from "@/lib/query-keys";
import { parseInboundEvent } from "@/types/ws";
import type { OutboundEvent, InboundEvent } from "@/types/ws";
import type { MessagePage } from "@/types/api";

/**
 * @description
 * Context for WebSocket connection
 */
interface WSContextValue {
  send: (event: OutboundEvent) => void;
  isConnected: boolean;
}

const WSContext = createContext<WSContextValue | null>(null);

export function useWS() {
  const ctx = useContext(WSContext);
  if (!ctx) throw new Error("useWS must be used inside WSProvider");
  return ctx;
}

/**
 * @description
 * Provider for WebSocket connection
 */
export function WSProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const session = useAuthStore((s) => s.session);
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const setTypingUsers = useChatStore((s) => s.setTypingUsers);
  const setWsStatus = useChatStore((s) => s.setWsStatus);
  const wsStatus = useChatStore((s) => s.wsStatus);

  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeConversationRef = useRef(activeConversationId);
  const prevConversationRef = useRef<string | null>(null);

  // Keep ref in sync with state (avoid stale closures in WS callbacks)
  activeConversationRef.current = activeConversationId;

  /**
   * @description
   * Handles inbound WebSocket events
   */
  const handleInbound = useCallback(
    (event: InboundEvent) => {
      switch (event.type) {
        case "new_message": {
          const { conversationId, message } = event;

          queryClient.setQueryData<InfiniteData<MessagePage>>(
            messageKeys.list(conversationId),
            (old) => {
              if (!old) return old;

              // Edit/delete case — update in place across all pages
              for (let i = 0; i < old.pages.length; i++) {
                const idx = old.pages[i].messages.findIndex((m) => m.id === message.id);
                if (idx !== -1) {
                  const newPages = [...old.pages];
                  newPages[i] = {
                    ...newPages[i],
                    messages: newPages[i].messages.map((m) =>
                      m.id === message.id ? message : m,
                    ),
                  };
                  return { ...old, pages: newPages };
                }
              }

              // New message — prepend to first page
              const newPages = [...old.pages];
              newPages[0] = {
                ...newPages[0],
                messages: [message, ...newPages[0].messages],
              };
              return { ...old, pages: newPages };
            },
          );

          // If not the active conversation, invalidate list for unread badge
          if (conversationId !== activeConversationRef.current) {
            queryClient.invalidateQueries({ queryKey: conversationKeys.all });
          }
          break;
        }

        case "typing_update": {
          setTypingUsers(event.conversationId, event.typingUserIds);
          break;
        }

        case "presence_update": {
          // Invalidate conversations to refresh online indicators
          queryClient.invalidateQueries({ queryKey: conversationKeys.all });
          break;
        }

        case "message_status_update": {
          queryClient.setQueryData<InfiniteData<MessagePage>>(
            messageKeys.list(event.conversationId),
            (old) => {
              if (!old) return old;
              const newPages = [...old.pages];
              for (let i = 0; i < newPages.length; i++) {
                const idx = newPages[i].messages.findIndex((m) => m.id === event.messageId);
                if (idx !== -1) {
                  const msg = newPages[i].messages[idx];
                  newPages[i] = {
                    ...newPages[i],
                    messages: [
                      ...newPages[i].messages.slice(0, idx),
                      {
                        ...msg,
                        deliveredCount: event.status === "delivered" ? (msg.deliveredCount || 0) + 1 : msg.deliveredCount,
                        seenCount: event.status === "seen" ? (msg.seenCount || 0) + 1 : msg.seenCount,
                      },
                      ...newPages[i].messages.slice(idx + 1),
                    ],
                  };
                  return { ...old, pages: newPages };
                }
              }
              return old;
            },
          );
          break;
        }

        case "conversation_updated": {
          queryClient.invalidateQueries({ queryKey: conversationKeys.all });
          break;
        }

        case "joined": {
          break;
        }

        case "heartbeat_ack": {
          break;
        }

        case "error": {
          toast.error("Realtime error: " + event.error);
          break;
        }
      }
    },
    [queryClient, setTypingUsers],
  );

  /**
   * @description
   * Sends raw WebSocket events
   */
  const sendRaw = useCallback((ws: WebSocket, event: OutboundEvent) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(event));
    }
  }, []);

  const send = useCallback(
    (event: OutboundEvent) => {
      if (wsRef.current) {
        sendRaw(wsRef.current, event);
      }
    },
    [sendRaw],
  );

  /**
   * @description
   * Handles WebSocket connection lifecycle
   */
  useEffect(() => {
    if (!session?.user) return;

    // Close any existing connection
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }

    const wsUrl = getWsUrl(env.NEXT_PUBLIC_SERVER_URL);
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setWsStatus("open");

      // Start heartbeat
      heartbeatTimerRef.current = setInterval(() => {
        sendRaw(ws, { type: "heartbeat", payload: {} });
      }, WS_HEARTBEAT_INTERVAL);

      // Rejoin active conversation after reconnect
      const convId = activeConversationRef.current;
      if (convId) {
        sendRaw(ws, {
          type: "join_conversation",
          payload: { conversationId: convId },
        });
      }
    };

    ws.onmessage = (event) => {
      const raw = typeof event.data === "string" ? event.data : String(event.data);
      const parsed = parseInboundEvent(raw);
      if (parsed) {
        handleInbound(parsed);
      }
    };

    ws.onclose = () => {
      setWsStatus("closed");

      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
        heartbeatTimerRef.current = null;
      }

      // Auto-reconnect
      reconnectTimerRef.current = setTimeout(() => {
        // Re-check session before reconnecting (may have logged out)
        if (useAuthStore.getState().session?.user) {
          setWsStatus("connecting");
        }
      }, WS_RECONNECT_DELAY);
    };

    ws.onerror = () => {
      // onerror always fires before onclose — onclose handles cleanup
    };

    setWsStatus("connecting");

    return () => {
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      ws.close();
      wsRef.current = null;
    };
  }, [session?.user?.id, setWsStatus, sendRaw, handleInbound]);

  /**
   * @description
   * Handles auto-join/leave when active conversation changes
   */
  useEffect(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    // Leave previous conversation
    const prev = prevConversationRef.current;
    if (prev && prev !== activeConversationId) {
      send({
        type: "leave_conversation",
        payload: { conversationId: prev },
      });
    }

    // Join new conversation
    if (activeConversationId) {
      send({
        type: "join_conversation",
        payload: { conversationId: activeConversationId },
      });
      setTypingUsers(activeConversationId, []);
    }

    prevConversationRef.current = activeConversationId;
  }, [activeConversationId, send, setTypingUsers]);

  /**
   * @description
   * Render WebSocket provider
   */
  const contextValue: WSContextValue = {
    send,
    isConnected: wsStatus === "open",
  };

  return (
    <WSContext.Provider value={contextValue}>
      {children}
    </WSContext.Provider>
  );
}
