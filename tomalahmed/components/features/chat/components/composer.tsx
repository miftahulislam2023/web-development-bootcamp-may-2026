"use client";

import { useState } from "react";

import { Button, Label, TextArea } from "@heroui/react";

import { CHAT_DISPLAY_NAME_MAX, CHAT_DISPLAY_NAME_STORAGE_KEY, CHAT_MESSAGE_MAX } from "@/lib/chat/constants";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

type ComposerProps = {
  roomId: string;
  onRequestName: () => void;
  onSent?: () => void;
};

export function Composer({ roomId, onRequestName, onSent }: ComposerProps) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = text.trim();
  const tooLong = trimmed.length > CHAT_MESSAGE_MAX;
  const canSend = trimmed.length > 0 && !tooLong && !sending;

  async function send() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("Chat is not configured.");
      return;
    }
    const name = window.localStorage.getItem(CHAT_DISPLAY_NAME_STORAGE_KEY)?.trim() ?? "";
    if (!name || name.length > CHAT_DISPLAY_NAME_MAX) {
      onRequestName();
      return;
    }
    if (!canSend) {
      return;
    }

    setSending(true);
    setError(null);
    const { error: insertError } = await supabase.from("messages").insert({
      room_id: roomId,
      content: trimmed,
      display_name: name,
    });
    setSending(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }
    setText("");
    onSent?.();
  }

  return (
    <div className="border-t border-outline-variant bg-surface p-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-2">
        <Label htmlFor="composer-message" className="sr-only">
          Message
        </Label>
        <TextArea
          id="composer-message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={CHAT_MESSAGE_MAX}
          placeholder="Type a message…"
          rows={2}
          className="min-h-[4.5rem] rounded-lg border-0 bg-surface-container px-4 py-3 text-base outline-none ring-primary/20 focus-visible:ring-2"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-secondary">
            {trimmed.length}/{CHAT_MESSAGE_MAX} · Enter to send, Shift+Enter for newline
          </span>
          <Button
            type="button"
            isDisabled={!canSend}
            className="rounded-lg bg-primary px-4 py-2 font-semibold text-on-primary shadow-md shadow-primary/20 outline-none transition-[transform,colors,opacity] hover:bg-[#8f0010] disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            onPress={() => void send()}
          >
            {sending ? "Sending…" : "Send"}
          </Button>
        </div>
        {tooLong ? (
          <p className="text-sm text-error" role="alert">
            Message is too long (max {CHAT_MESSAGE_MAX} characters).
          </p>
        ) : null}
        {error ? (
          <p className="text-sm text-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
