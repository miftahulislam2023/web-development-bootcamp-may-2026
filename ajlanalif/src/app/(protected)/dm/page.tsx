"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import { ConversationSidebar } from "@/components/dm/conversation-sidebar";
import type { DmConversationSummary, DmUser } from "@/lib/dm";

export default function DirectMessagesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<DmConversationSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DmUser[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const conversationCount = useMemo(() => conversations.length, [conversations]);

  async function loadConversations() {
    setIsLoadingConversations(true);
    setError(null);

    try {
      const response = await fetch("/api/conversations");

      if (!response.ok) {
        throw new Error("Failed to load conversations.");
      }

      const payload = (await response.json()) as DmConversationSummary[];
      setConversations(payload);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Failed to load conversations.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoadingConversations(false);
    }
  }

  useEffect(() => {
    void loadConversations();
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();

    if (query.length < 1) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let isActive = true;
    const timeout = window.setTimeout(async () => {
      setIsSearching(true);

      try {
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);

        if (!response.ok) {
          throw new Error("Failed to search users.");
        }

        const payload = (await response.json()) as DmUser[];

        if (isActive) {
          setSearchResults(payload);
        }
      } catch (caughtError) {
        const message = caughtError instanceof Error ? caughtError.message : "Failed to search users.";
        if (isActive) {
          toast.error(message);
        }
      } finally {
        if (isActive) {
          setIsSearching(false);
        }
      }
    }, 250);

    return () => {
      isActive = false;
      window.clearTimeout(timeout);
    };
  }, [searchQuery]);

  async function startConversation(targetUserId: string) {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetUserId }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.message ?? "Failed to open conversation.");
      }

      toast.success("Conversation opened.");
      router.push(`/dm/${payload.conversation.id}`);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Failed to open conversation.";
      toast.error(message);
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="grid flex-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <ConversationSidebar
          conversations={conversations}
          isLoadingConversations={isLoadingConversations}
          activeConversationId={null}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          isSearching={isSearching}
          onStartConversation={startConversation}
          emptyLabel="No conversations yet. Search a username to start one."
        />

        <section className="flex min-h-0 flex-col overflow-hidden rounded-[28px] border border-cyan-400/12 bg-slate-950/75 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <header className="border-b border-white/5 px-5 py-5 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">Direct messages</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50">Chat inbox</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Search for a user, open a conversation, and continue the realtime chat flow with the same message system.
            </p>
          </header>

          <div className="flex flex-1 items-center justify-center p-6">
            <div className="max-w-md text-center">
              <p className="text-sm font-medium text-slate-100">
                {session?.user?.username ? `Welcome, ${session.user.username}` : "Start a direct message"}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Use the left panel to search users or reopen an existing conversation.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <Link href="/chat" className="rounded-full border border-cyan-400/20 bg-slate-950/60 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/35 hover:bg-slate-900">
                  Rooms
                </Link>
                <Link href="/profile" className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
                  Profile
                </Link>
              </div>
              {error ? <p className="mt-6 text-sm text-rose-200">{error}</p> : null}
              <p className="mt-6 text-xs text-slate-500">{conversationCount} conversations</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
