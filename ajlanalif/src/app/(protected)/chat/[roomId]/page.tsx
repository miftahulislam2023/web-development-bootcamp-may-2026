"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { LogoutButton } from "@/components/auth/logout-button";

type Message = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string | null;
    name: string | null;
    image: string | null;
  };
};

type MessagesResponse = {
  messages: Message[];
  nextCursor: string | null;
};

type Room = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  memberCount: number;
};

function formatTimestamp(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function RoomChatPage() {
  const params = useParams<{ roomId: string }>();
  const roomId = params.roomId;

  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [isRoomLoading, setIsRoomLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadRoom() {
    setIsRoomLoading(true);
    setError(null);

    const response = await fetch(`/api/rooms/${roomId}`);

    if (response.status === 404) {
      setRoom(null);
      setIsRoomLoading(false);
      return;
    }

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ message: "Failed to load room." }));
      setError(payload.message ?? "Failed to load room.");
      setIsRoomLoading(false);
      return;
    }

    const payload = (await response.json()) as Room;
    setRoom(payload);
    setIsRoomLoading(false);
  }

  async function loadMessages(cursor?: string) {
    const query = new URLSearchParams({
      roomId,
      limit: "20",
    });

    if (cursor) {
      query.set("cursor", cursor);
    }

    const response = await fetch(`/api/messages?${query.toString()}`);

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ message: "Failed to fetch messages." }));
      setError(payload.message ?? "Failed to fetch messages.");
      setIsLoading(false);
      return;
    }

    const payload = (await response.json()) as MessagesResponse;

    setMessages((current) => (cursor ? [...current, ...payload.messages] : payload.messages));
    setNextCursor(payload.nextCursor);
    setIsLoading(false);
  }

  useEffect(() => {
    setMessages([]);
    setNextCursor(null);
    setContent("");
    setError(null);
    void (async () => {
      await loadRoom();
    })();
  }, [roomId]);

  useEffect(() => {
    if (!room) {
      return;
    }

    void loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  async function onSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    setError(null);

    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId,
        content,
      }),
    });

    setIsSending(false);

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ message: "Failed to send message." }));
      setError(payload.message ?? "Failed to send message.");
      return;
    }

    setContent("");
    await loadMessages();
  }

  if (isRoomLoading) {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 px-4 py-6">
        <p className="text-sm text-zinc-600">Loading room...</p>
      </main>
    );
  }

  if (!room) {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 px-4 py-6">
        <header className="flex items-center justify-between border border-zinc-200 bg-white p-4">
          <div>
            <h1 className="text-lg font-semibold">Room not found</h1>
            <p className="text-xs text-zinc-600">The requested room does not exist.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/chat" className="border border-zinc-300 px-3 py-1.5 text-xs">
              Back to rooms
            </Link>
            <LogoutButton />
          </div>
        </header>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 px-4 py-6">
      <header className="flex items-center justify-between border border-zinc-200 bg-white p-4">
        <div>
          <h1 className="text-lg font-semibold">{room.name}</h1>
          <p className="text-xs text-zinc-600">{room.description ?? "No description"}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/chat" className="border border-zinc-300 px-3 py-1.5 text-xs">
            Back to rooms
          </Link>
          <LogoutButton />
        </div>
      </header>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <section className="border border-zinc-200 bg-white p-4">
        <h2 className="text-sm font-semibold">Messages</h2>

        {isLoading ? <p className="mt-3 text-sm text-zinc-600">Loading messages...</p> : null}

        {!isLoading && messages.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-600">No messages yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {messages.map((message) => (
              <li key={message.id} className="border border-zinc-200 p-2">
                <p className="text-xs text-zinc-500">
                  {message.author.username ?? message.author.name ?? "Unknown"} - {formatTimestamp(message.createdAt)}
                </p>
                <p className="text-sm">{message.content}</p>
              </li>
            ))}
          </ul>
        )}

        {nextCursor ? (
          <button
            type="button"
            onClick={() => {
              void loadMessages(nextCursor);
            }}
            className="mt-3 border border-zinc-300 px-3 py-1.5 text-xs"
          >
            Load older messages
          </button>
        ) : null}
      </section>

      <form onSubmit={onSendMessage} className="border border-zinc-200 bg-white p-4">
        <label htmlFor="content" className="text-sm font-semibold">
          New message
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="mt-2 block w-full border border-zinc-300 px-3 py-2 text-sm"
          rows={3}
          required
        />
        <button
          type="submit"
          disabled={isSending}
          className="mt-2 border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white disabled:opacity-60"
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </form>
    </main>
  );
}
