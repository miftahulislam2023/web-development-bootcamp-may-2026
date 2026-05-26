"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import ConversationSidebar from "@/components/chat/ConversationSidebar";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = use(params);
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-[#0F1419] flex overflow-hidden">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300
        md:relative md:translate-x-0 md:w-80 md:flex md:flex-col
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

      {/* Chat panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#334155] bg-[#1E2530] md:hidden shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col gap-1 p-1 shrink-0"
          >
            <span className="block w-5 h-0.5 bg-[#F1F5F9]" />
            <span className="block w-5 h-0.5 bg-[#F1F5F9]" />
            <span className="block w-5 h-0.5 bg-[#F1F5F9]" />
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-[#94A3B8] text-sm hover:text-[#F1F5F9] transition-colors"
          >
            ← Back
          </button>
        </div>

        <ChatWindow conversationId={conversationId} />
      </div>
    </div>
  );
}