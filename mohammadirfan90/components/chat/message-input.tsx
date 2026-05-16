"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState, useCallback, type FormEvent } from "react";

interface MessageInputProps {
  onSend: (content: string) => void;
  placeholder?: string;
}

/**
 * Chat message input with send button.
 * Per uidesignsystem.md §7 — chat inputs use border-radius: full.
 */
export function MessageInput({
  onSend,
  placeholder = "Type a message…",
}: MessageInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const trimmed = value.trim();
      if (!trimmed) return;
      onSend(trimmed);
      setValue("");
    },
    [value, onSend],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20"
    >
      <Input
        id="message-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="h-8 flex-1 border-0 bg-transparent px-1 text-sm shadow-none ring-0 placeholder:text-muted-foreground focus-visible:border-0 focus-visible:ring-0"
      />

      <Button
        type="submit"
        size="icon-sm"
        className="shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        aria-label="Send message"
        disabled={!value.trim()}
      >
        <Send className="size-4" />
      </Button>
    </form>
  );
}
