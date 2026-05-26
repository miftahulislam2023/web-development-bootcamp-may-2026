"use client";

import { useState } from "react";
import ConversationSidebar from "@/components/chat/ConversationSidebar";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-[#0F1419] flex overflow-hidden">
      {/* Sidebar — always visible on md+, drawer on mobile */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 md:relative md:translate-x-0 md:w-80 md:flex md:flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <ConversationSidebar onSelect={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Empty state panel */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0F1419] relative">
        {/* Mobile top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center gap-3 px-4 py-4 border-b border-[#334155] md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col gap-1 p-1"
          >
            <span className="block w-5 h-0.5 bg-[#F1F5F9]" />
            <span className="block w-5 h-0.5 bg-[#F1F5F9]" />
            <span className="block w-5 h-0.5 bg-[#F1F5F9]" />
          </button>
          <span className="font-bold bg-linear-to-r from-[#8B5CF6] via-[#06B6D4] to-[#10B981] bg-clip-text text-transparent">
            LiveChat
          </span>
        </div>

        <div className="text-center px-4">
          <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-[#8B5CF6]/20 via-[#06B6D4]/20 to-[#10B981]/20 border border-[#334155] flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">💬</span>
          </div>
          <h2 className="text-[#F1F5F9] font-semibold text-lg mb-2">Your messages</h2>
          <p className="text-[#94A3B8] text-sm max-w-xs">
            Select a conversation from the sidebar to start chatting
          </p>
        </div>
      </div>
    </div>
  );
}