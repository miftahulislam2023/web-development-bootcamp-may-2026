"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { CHAT_DISPLAY_NAME_STORAGE_KEY, GLOBAL_ROOM_NAME } from "@/lib/chat/constants";
import { ROUTES } from "@/lib/routes";
import { isSupabaseChatConfigured } from "@/lib/supabase/browser-client";

import { ChatShell } from "../components/chat-shell";
import { NamePrompt } from "../components/name-prompt";

type Phase = "hydrate" | "name" | "pick-room";

export function ChatLobbyPage() {
  const [phase, setPhase] = useState<Phase>("hydrate");
  const configured = isSupabaseChatConfigured();

  useEffect(() => {
    const stored = window.localStorage.getItem(CHAT_DISPLAY_NAME_STORAGE_KEY)?.trim();
    setPhase(stored ? "pick-room" : "name");
  }, []);

  if (phase === "hydrate") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-background text-secondary">
        <motion.span
          className="material-symbols-outlined mb-3 animate-pulse text-primary"
          style={{ fontSize: 40 }}
          aria-hidden
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          forum
        </motion.span>
        <p className="text-sm font-medium">Loading chat…</p>
      </div>
    );
  }

  return (
    <ChatShell
      title={phase === "name" ? "Join the conversation" : "Rooms"}
      subtitle={
        phase === "name"
          ? "Add your name first — then open Global to chat live with everyone."
          : "Choose a room. Messages sync in real time."
      }
    >
      {!configured ? (
        <div className="border-b border-outline-variant bg-surface-container-low px-4 py-3 text-center text-sm text-secondary">
          Add <code className="text-on-surface">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="text-on-surface">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> in{" "}
          <code className="text-on-surface">.env.local</code>, then run Supabase migrations.
        </div>
      ) : null}

      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-10 md:px-8">
        <AnimatePresence mode="wait">
          {phase === "name" ? (
            <motion.div
              key="name-step"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="w-full max-w-md"
            >
              <NamePrompt open variant="inline" onSaved={() => setPhase("pick-room")} />
            </motion.div>
          ) : (
            <motion.div
              key="room-step"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex w-full flex-col items-center gap-8"
            >
              <p className="max-w-md text-center text-base text-secondary">
                You&apos;re set as <span className="font-semibold text-on-surface">{getStoredName()}</span>. Tap{" "}
                <span className="font-semibold text-on-surface">{GLOBAL_ROOM_NAME}</span> to enter the shared group chat.
              </p>

              <Link
                href={ROUTES.chatGlobal}
                className="group no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.992 }}
                  transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.65 }}
                  className="relative w-full max-w-md overflow-hidden rounded-2xl border-2 border-outline-variant bg-surface-container-lowest p-0 shadow-md transition-[box-shadow,border-color] duration-200 ease-out hover:border-primary hover:shadow-xl motion-reduce:transition-none"
                >
                  <div
                    className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    aria-hidden
                  />
                  <div className="relative flex items-center gap-5 p-8 md:p-10">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/20 transition-transform duration-200 group-hover:scale-105 motion-reduce:group-hover:scale-100">
                      <span className="material-symbols-outlined" style={{ fontSize: 36 }}>
                        public
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <h2 className="text-2xl font-bold tracking-tight text-on-surface md:text-3xl">{GLOBAL_ROOM_NAME}</h2>
                      <p className="mt-1 text-sm text-secondary md:text-base">Public group · live messages · no account</p>
                    </div>
                    <span
                      className="material-symbols-outlined shrink-0 text-on-surface-variant transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary"
                      aria-hidden
                    >
                      arrow_forward
                    </span>
                  </div>
                </motion.div>
              </Link>

              <button
                type="button"
                className="text-sm font-medium text-secondary underline-offset-4 transition-colors hover:text-primary hover:underline"
                onClick={() => {
                  window.localStorage.removeItem(CHAT_DISPLAY_NAME_STORAGE_KEY);
                  setPhase("name");
                }}
              >
                Use a different name
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ChatShell>
  );
}

function getStoredName() {
  if (typeof window === "undefined") {
    return "";
  }
  return window.localStorage.getItem(CHAT_DISPLAY_NAME_STORAGE_KEY)?.trim() ?? "";
}
