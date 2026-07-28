"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "@/components/chat/message-bubble";
import type { ChatMessage } from "@/types/chat";

interface MessageListProps {
  messages: ChatMessage[];
  isGroup?: boolean;
}

/**
 * Scrollable message list area with auto-scroll to latest message.
 */
export function MessageList({ messages, isGroup = false }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto px-5 py-5">
      <div className="mt-auto flex flex-col gap-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            No messages yet. Start the conversation!
          </p>
        )}
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            showSenderName={isGroup}
          />
        ))}
        <div ref={bottomRef} aria-hidden="true" />
      </div>
    </div>
  );
}
