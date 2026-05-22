"use client";

import { motion } from "framer-motion";

import type { ChatMessageRow } from "@/lib/chat/types";

type MessageListProps = {
  messages: ChatMessageRow[];
  loading: boolean;
};

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  } catch {
    return "";
  }
}

export function MessageList({ messages, loading }: MessageListProps) {
  if (loading && messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-secondary" aria-live="polite">
        Loading messages…
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-center text-secondary" aria-live="polite">
        No messages yet. Say hello below.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3 p-4" aria-label="Chat messages">
      {messages.map((m) => (
        <motion.li
          key={m.id}
          layout
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 shadow-sm transition-[box-shadow,transform] duration-150 hover:shadow-md motion-reduce:transition-none"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="font-semibold text-on-surface">{m.display_name}</span>
            <time className="text-xs text-secondary" dateTime={m.created_at}>
              {formatTime(m.created_at)}
            </time>
          </div>
          <p className="mt-2 whitespace-pre-wrap break-words text-on-surface">{m.content}</p>
        </motion.li>
      ))}
    </ul>
  );
}
