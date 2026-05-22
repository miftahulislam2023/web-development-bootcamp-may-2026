"use client";

import { useCallback, useEffect, useState } from "react";

import { CHAT_MESSAGE_MAX } from "@/lib/chat/constants";
import type { ChatMessageRow } from "@/lib/chat/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

const RECENT_MESSAGE_LIMIT = 100;

export function useRoomMessages(roomId: string) {
  const [messages, setMessages] = useState<ChatMessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const appendMessage = useCallback((row: ChatMessageRow) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === row.id)) {
        return prev;
      }
      return [...prev, row];
    });
  }, []);

  useEffect(() => {
    if (!roomId) {
      setMessages([]);
      setLoading(false);
      setError(null);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setLoading(false);
      setError("not_configured");
      return;
    }
    const client = supabase;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      const { data, error: queryError } = await client
        .from("messages")
        .select("id, room_id, content, display_name, created_at")
        .eq("room_id", roomId)
        .order("created_at", { ascending: false })
        .limit(RECENT_MESSAGE_LIMIT);

      if (cancelled) {
        return;
      }
      if (queryError) {
        setError(queryError.message);
        setMessages([]);
      } else {
        const rows = (data ?? []) as ChatMessageRow[];
        setMessages(rows.slice().reverse());
      }
      setLoading(false);
    }

    void load();

    const channel = client
      .channel(`messages:room:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const row = payload.new as ChatMessageRow;
          if (row.content.length > CHAT_MESSAGE_MAX) {
            return;
          }
          appendMessage(row);
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      void client.removeChannel(channel);
    };
  }, [appendMessage, roomId]);

  return { messages, loading, error };
}
