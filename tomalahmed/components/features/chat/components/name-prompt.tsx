"use client";

import { useEffect, useState } from "react";

import { Button, Input, Label } from "@heroui/react";

import { CHAT_DISPLAY_NAME_MAX, CHAT_DISPLAY_NAME_STORAGE_KEY } from "@/lib/chat/constants";

type NamePromptProps = {
  open: boolean;
  onSaved: (name: string) => void;
  /** `inline` = embedded card (chat hub). `modal` = full-screen dimmed overlay (in-room gate). */
  variant?: "modal" | "inline";
};

export function NamePrompt({ open, onSaved, variant = "modal" }: NamePromptProps) {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const isModal = variant === "modal";

  useEffect(() => {
    if (open) {
      const stored = window.localStorage.getItem(CHAT_DISPLAY_NAME_STORAGE_KEY);
      setValue(stored?.trim() ?? "");
      setTouched(false);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const trimmed = value.trim();
  const tooLong = trimmed.length > CHAT_DISPLAY_NAME_MAX;
  const invalid = trimmed.length === 0 || tooLong;

  function handleSave() {
    setTouched(true);
    if (invalid) {
      return;
    }
    window.localStorage.setItem(CHAT_DISPLAY_NAME_STORAGE_KEY, trimmed);
    onSaved(trimmed);
  }

  const panel = (
    <div
      className={
        isModal
          ? "w-full max-w-md rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-lg"
          : "w-full max-w-md rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 shadow-md"
      }
    >
      <h2 id="name-prompt-title" className="text-xl font-semibold text-on-surface">
        Your display name
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-secondary">
        Required before you can chat. Shown on every message. Stored only in this browser — not an account.
      </p>
      <div className="mt-6 flex flex-col gap-2">
        <Label htmlFor="display-name" className="text-sm font-medium text-on-surface-variant">
          Display name
        </Label>
        <Input
          id="display-name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={CHAT_DISPLAY_NAME_MAX}
          autoFocus
          placeholder="e.g. Alex"
          className="rounded-lg border-0 bg-surface-container py-3 px-4 text-base outline-none ring-primary/20 focus-visible:ring-2"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSave();
            }
          }}
        />
        {touched && invalid ? (
          <p className="text-sm text-error" role="alert">
            {tooLong ? `Use at most ${CHAT_DISPLAY_NAME_MAX} characters.` : "Enter a display name to continue."}
          </p>
        ) : null}
      </div>
      <div className="mt-8 flex justify-stretch sm:justify-end">
        <Button
          type="button"
          className="w-full rounded-lg bg-primary px-6 py-3 text-base font-semibold text-on-primary shadow-md shadow-primary/25 transition-[transform,colors] hover:bg-[#8f0010] active:scale-[0.99] motion-reduce:active:scale-100 sm:w-auto"
          onPress={handleSave}
        >
          Save and continue
        </Button>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/50 p-4 backdrop-blur-[2px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="name-prompt-title"
      >
        {panel}
      </div>
    );
  }

  return (
    <div className="w-full" role="region" aria-labelledby="name-prompt-title">
      {panel}
    </div>
  );
}
