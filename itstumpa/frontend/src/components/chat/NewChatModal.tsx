"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
/* eslint-disable react-hooks/set-state-in-effect */

interface SearchUser {
  id: string;
  name: string;
  email: string;
  isOnline: boolean;
}
export default function NewChatModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isStarting, setIsStarting] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const limit = 10;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const fetchUsers = useCallback(async (pageNum: number, reset = false, searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    try {
      const res = await api.get("/users/search", {
        params: { query: searchQuery, page: pageNum, limit },
      });
      const result = res.data.data;
      const list: SearchUser[] = Array.isArray(result)
        ? result
        : result.users ?? result.data ?? [];
      const total: number = result.total ?? list.length;
      setUsers((prev) => (reset ? list : [...prev, ...list]));
      setHasMore(pageNum * limit < total);
      setPage(pageNum);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      setPage(1);
      setHasMore(false);
      return;
    }
    const timeout = setTimeout(() => {
      fetchUsers(1, true, query);
    }, 400);
    return () => clearTimeout(timeout);
  }, [query, fetchUsers]);

  const loadMore = () => {
    fetchUsers(page + 1, false, query);
  };

  const handleStart = async (userId: string) => {
    setIsStarting(userId);
    try {
      const res = await api.post("/chat/conversations", { otherUserId: userId });
      const conv = res.data.data;
      router.push(`/dashboard/chat/${conv.id}`);
      onClose();
    } finally {
      setIsStarting(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-[#1E2530] border border-[#334155] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#334155]">
          <h2 className="text-[#F1F5F9] font-semibold text-sm">New Conversation</h2>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#F1F5F9] transition-colors text-lg leading-none">✕</button>
        </div>

        <div className="px-5 py-3 border-b border-[#334155]">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#0F1419] border border-[#334155] rounded-xl px-4 py-2.5 text-[#F1F5F9] text-sm placeholder:text-[#94A3B8] focus:outline-none focus:border-[#06B6D4] transition-colors"
          />
        </div>

        <div className="max-h-80 overflow-y-auto">
          {!query.trim() && (
            <div className="flex items-center justify-center py-12 text-[#94A3B8] text-sm">
              Type to search users
            </div>
          )}
          {query.trim() && isLoading && users.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 rounded-full border-2 border-[#06B6D4] border-t-transparent animate-spin" />
            </div>
          )}
          {query.trim() && !isLoading && users.length === 0 && (
            <div className="flex items-center justify-center py-12 text-[#94A3B8] text-sm">
              No users found
            </div>
          )}
          {users.map((u) => (
            <div key={u.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#0F1419]/50 border-b border-[#334155]/50 transition-colors">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center text-white font-bold text-sm">
                  {u.name[0].toUpperCase()}
                </div>
                {u.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#10B981] rounded-full border-2 border-[#1E2530]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#F1F5F9] text-sm font-medium truncate">{u.name}</p>
                <p className="text-[#94A3B8] text-xs truncate">{u.email}</p>
              </div>
              <button
                onClick={() => handleStart(u.id)}
                disabled={isStarting === u.id}
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-linear-to-r from-[#8B5CF6] to-[#06B6D4] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isStarting === u.id ? "..." : "Chat"}
              </button>
            </div>
          ))}
          {hasMore && (
            <div className="px-5 py-3 flex justify-center">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="text-xs text-[#06B6D4] hover:text-[#22D3EE] transition-colors disabled:opacity-50"
              >
                {isLoading ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}