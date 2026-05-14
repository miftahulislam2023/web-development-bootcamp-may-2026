"use client";

import { useEffect, useRef, useState } from "react";

import { CHAT_DISPLAY_NAME_STORAGE_KEY, DEFAULT_LOBBY_ROOM_ID, GLOBAL_ROOM_NAME } from "@/lib/chat/constants";
import { getSupabaseBrowserClient, isSupabaseChatConfigured } from "@/lib/supabase/browser-client";

import { ChatShell } from "../components/chat-shell";
import { Composer } from "../components/composer";
import { MessageList } from "../components/message-list";
import { NamePrompt } from "../components/name-prompt";
import { useRoomMessages } from "../hooks/use-room-messages";

function isValidUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.trim());
}

type ChatRoomPageProps = {
  roomId: string;
};

export function ChatRoomPage({ roomId }: ChatRoomPageProps) {
  const [roomTitle, setRoomTitle] = useState<string>("Room");
  const [roomError, setRoomError] = useState<string | null>(null);
  const [namePromptOpen, setNamePromptOpen] = useState(false);
  const listEndRef = useRef<HTMLDivElement>(null);

  const validId = isValidUuid(roomId);
  const { messages, loading, error } = useRoomMessages(validId ? roomId : "");

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!validId) {
      setRoomError("Invalid room ID.");
      return;
    }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setRoomError(null);
      return;
    }
    const client = supabase;
    let cancelled = false;
    async function loadRoom() {
      const { data, error: qError } = await client.from("rooms").select("title").eq("id", roomId).maybeSingle();
      if (cancelled) {
        return;
      }
      if (qError) {
        setRoomError(qError.message);
        return;
      }
      if (!data) {
        const isDefaultLobby = roomId.toLowerCase() === DEFAULT_LOBBY_ROOM_ID.toLowerCase();
        setRoomError(
          isDefaultLobby
            ? `${GLOBAL_ROOM_NAME} room was not found. Apply Supabase migrations (including the seed that creates this room).`
            : "Room not found.",
        );
        return;
      }
      setRoomTitle(data.title);
      setRoomError(null);
    }
    void loadRoom();
    return () => {
      cancelled = true;
    };
  }, [roomId, validId]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const stored = window.localStorage.getItem(CHAT_DISPLAY_NAME_STORAGE_KEY)?.trim();
    if (!stored) {
      setNamePromptOpen(true);
    }
  }, []);

  const isLobby = validId && roomId.toLowerCase() === DEFAULT_LOBBY_ROOM_ID.toLowerCase();

  if (!validId) {
    return (
      <ChatShell title="Invalid room">
        <div className="flex flex-1 items-center justify-center p-8 text-secondary" role="alert">
          This link does not contain a valid room ID.
        </div>
      </ChatShell>
    );
  }

  const configured = isSupabaseChatConfigured();
  const fetchError = error === "not_configured" || !configured;

  return (
    <ChatShell
      title={roomTitle}
      subtitle={isLobby ? `The shared ${GLOBAL_ROOM_NAME} room — messages appear instantly for everyone here.` : null}
    >
      <NamePrompt
        open={namePromptOpen}
        onSaved={() => {
          setNamePromptOpen(false);
        }}
      />

      {fetchError ? (
        <div className="shrink-0 border-b border-outline-variant bg-surface-container-low px-4 py-3 text-center text-sm text-secondary">
          Configure <code className="text-on-surface">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="text-on-surface">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>, then run the chat migration. See{" "}
          <code className="text-on-surface">.env.example</code>.
        </div>
      ) : null}

      {roomError ? (
        <div
          className="shrink-0 border-b border-outline-variant bg-error-container px-4 py-3 text-center text-sm text-on-error-container"
          role="alert"
        >
          {roomError}
        </div>
      ) : null}

      {!fetchError && error && error !== "not_configured" ? (
        <div
          className="shrink-0 border-b border-outline-variant bg-error-container px-4 py-3 text-center text-sm text-on-error-container"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <MessageList messages={messages} loading={loading} />
          <div ref={listEndRef} className="h-1 w-full shrink-0" aria-hidden />
        </div>
        <Composer
          roomId={roomId}
          onRequestName={() => setNamePromptOpen(true)}
          onSent={() => {
            listEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </div>
    </ChatShell>
  );
}
