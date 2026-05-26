"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface AdminConversation {
  id: string;
  participants: { name: string }[];
  messageCount: number;
  createdAt: string;
}

export default function AdminConversationsPage() {
  const [conversations, setConversations] = useState<AdminConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/admin/conversations");
        setConversations(res.data.data);
        const result = res.data.data;
setConversations(Array.isArray(result) ? result : result.conversations ?? result.data ?? []);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this conversation? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/conversations/${id}`);
      setConversations((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#F1F5F9]">Conversations</h1>
        <p className="text-[#94A3B8] text-sm mt-1">Monitor and moderate conversations</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 rounded-full border-2 border-[#06B6D4] border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="bg-[#1E2530] border border-[#334155] rounded-2xl overflow-hidden">
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#334155]">
                  {["Participants", "Messages", "Created", "Action"].map((h) => (
                    <th key={h} className="text-left px-5 py-4 text-[#94A3B8] font-medium text-xs uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {conversations.map((c) => (
                  <tr key={c.id} className="border-b border-[#334155]/50 hover:bg-[#0F1419]/30 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-[#F1F5F9] font-medium">
                        {c.participants.map((p) => p.name).join(" & ")}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-[#94A3B8]">{c.messageCount}</td>
                    <td className="px-5 py-4 text-[#94A3B8]">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleDelete(c.id)}
                        disabled={deletingId === c.id}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                      >
                        {deletingId === c.id ? "..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden flex flex-col divide-y divide-[#334155]/50">
            {conversations.map((c) => (
              <div key={c.id} className="px-4 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[#F1F5F9] text-sm font-medium">
                    {c.participants.map((p) => p.name).join(" & ")}
                  </p>
                  <p className="text-[#94A3B8] text-xs mt-0.5">{c.messageCount} messages · {new Date(c.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => handleDelete(c.id)}
                  disabled={deletingId === c.id}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium bg-red-500/10 text-red-400 shrink-0 disabled:opacity-50"
                >
                  {deletingId === c.id ? "..." : "Delete"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}