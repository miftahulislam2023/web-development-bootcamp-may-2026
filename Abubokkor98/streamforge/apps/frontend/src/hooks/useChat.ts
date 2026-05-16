"use client"

import { useState, useEffect, useOptimistic, startTransition } from "react"
import { socket } from "@/lib/socket"
import { toast } from "sonner"
import type { ChatMessageResponse } from "@/lib/types/socket-events"

interface UseChatOptions {
  roomKey: string
  isHost: boolean
}

interface UseChatReturn {
  messages: ChatMessageResponse[]
  pinnedMessage: ChatMessageResponse | null
  sendMessage: (text: string) => void
  deleteMessage: (messageId: number) => void
  pinMessage: (messageId: number, isPinned: boolean) => void
}

interface OptimisticMessage extends ChatMessageResponse {
  pending?: boolean
}

let optimisticIdCounter = -1

export function useChat({ roomKey, isHost }: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessageResponse[]>([])
  const [optimisticMessages, addOptimistic] = useOptimistic<
    OptimisticMessage[],
    OptimisticMessage
  >(messages, (current, newMsg) => [...current, newMsg])

  // ── Socket Listeners ──

  useEffect(() => {
    socket.emit("join-room", roomKey)

    function onChatHistory(history: ChatMessageResponse[]) {
      startTransition(() => setMessages(history))
    }

    function onNewMessage(message: ChatMessageResponse) {
      startTransition(() => {
        setMessages((prev) => {
          if (prev.some((msg) => msg.id === message.id)) {
            return prev
          }
          return [...prev, message]
        })
      })
    }

    function onMessageDeleted(payload: { messageId: number }) {
      startTransition(() => {
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== payload.messageId),
        )
      })
    }

    function onMessagePinned(payload: {
      messageId: number
      isPinned: boolean
    }) {
      startTransition(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === payload.messageId
              ? { ...msg, isPinned: payload.isPinned }
              : msg,
          ),
        )
      })
    }

    function onSocketError(payload: { message: string }) {
      toast.error(payload.message)
    }

    socket.on("chat-history", onChatHistory)
    socket.on("new-message", onNewMessage)
    socket.on("message-deleted", onMessageDeleted)
    socket.on("message-pinned", onMessagePinned)
    socket.on("error", onSocketError)

    return () => {
      socket.emit("leave-room", roomKey)
      socket.off("chat-history", onChatHistory)
      socket.off("new-message", onNewMessage)
      socket.off("message-deleted", onMessageDeleted)
      socket.off("message-pinned", onMessagePinned)
      socket.off("error", onSocketError)
    }
  }, [roomKey])

  // ── Actions ──

  function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed) {
      return
    }

    optimisticIdCounter -= 1
    const tempMsg: OptimisticMessage = {
      id: optimisticIdCounter,
      roomId: 0,
      sessionId: 0,
      senderId: null,
      senderName: "",
      text: trimmed,
      isPinned: false,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      pending: true,
    }

    addOptimistic(tempMsg)

    socket.emit("send-message", { roomKey, text: trimmed }, (response) => {
      if (response.success && response.message) {
        const confirmedMessage = response.message
        setMessages((prev) => {
          if (prev.some((msg) => msg.id === confirmedMessage.id)) {
            return prev
          }
          return [...prev, confirmedMessage]
        })
      } else {
        toast.error(response.error ?? "Failed to send message")
      }
    })
  }

  function deleteMessage(messageId: number) {
    if (!isHost) {
      return
    }
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId))
    socket.emit("delete-message", { messageId, roomKey })
  }

  function pinMessage(messageId: number, isPinned: boolean) {
    if (!isHost) {
      return
    }
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isPinned } : msg,
      ),
    )
    socket.emit("pin-message", { messageId, roomKey, isPinned })
  }

  // ── Derived State ──

  const pinnedMessage =
    optimisticMessages.find((msg) => msg.isPinned && !msg.isDeleted) ?? null

  return {
    messages: optimisticMessages,
    pinnedMessage,
    sendMessage,
    deleteMessage,
    pinMessage,
  }
}
