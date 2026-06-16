"use client"

import { useRef, useEffect } from "react"
import { useChat } from "@/hooks/useChat"
import { useAuthStore } from "@/lib/auth-store"
import { ChatMessageItem } from "@/components/views/stream/chat/ChatMessageItem"
import { ChatInput } from "@/components/views/stream/chat/ChatInput"
import { PinnedMessage } from "@/components/views/stream/chat/PinnedMessage"
import { ChatGuestBlock } from "@/components/views/stream/chat/ChatGuestBlock"
import { ChatText, X } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChatPanelProps {
  roomKey: string
  hostName: string // Added to identify host messages
  isHost: boolean
  guestChatEnabled: boolean
  isOpen: boolean
  onClose: () => void
}

function ChatPanel({ roomKey, hostName, isHost, guestChatEnabled, isOpen, onClose }: ChatPanelProps) {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = !!user
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, pinnedMessage, sendMessage, deleteMessage, pinMessage } =
    useChat({ roomKey, isHost })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  const canChat = isAuthenticated || guestChatEnabled
  const showGuestBlock = !isAuthenticated && !guestChatEnabled

  return (
    <aside
      className={cn(
        "fixed z-40 flex flex-col overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
        "bg-background/30 backdrop-blur-md shadow-2xl",
        "bottom-0 inset-x-0 h-[55dvh] rounded-t-[2rem] border-t border-border/30", // Mobile
        "lg:bottom-auto lg:top-4 lg:right-4 lg:left-auto lg:h-[calc(100dvh-32px)] lg:w-[380px] lg:rounded-3xl lg:border lg:border-border/30", // Desktop
        !isOpen && "translate-y-full opacity-0 lg:translate-y-0 lg:translate-x-full pointer-events-none"
      )}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/30 bg-background/20">
        <div className="flex items-center gap-2">
          <ChatText className="size-4 text-muted-foreground" />
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/80">
            Live Chat
          </h2>
        </div>
        <Button 
          variant="ghost" 
          size="icon-xs" 
          onClick={onClose} 
          aria-label="Close chat"
          className="text-muted-foreground hover:text-foreground hover:bg-background/30 rounded-full transition-colors"
        >
          <X className="size-4" />
        </Button>
      </header>

      {/* Pinned message */}
      {pinnedMessage && <PinnedMessage message={pinnedMessage} />}

      {/* Message list */}
      <div
        className="chat-message-list flex-1 overflow-y-auto scroll-smooth py-3"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-[13px] font-medium text-muted-foreground">
              No messages yet — say something!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessageItem
              key={msg.id}
              message={msg}
              isHost={isHost}
              isSenderHost={msg.senderName === hostName}
              isOwnMessage={user !== null && msg.senderId === user.id}
              onDelete={deleteMessage}
              onPin={pinMessage}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      {showGuestBlock ? (
        <ChatGuestBlock />
      ) : canChat ? (
        <ChatInput onSend={sendMessage} />
      ) : null}
    </aside>
  )
}

export { ChatPanel }
