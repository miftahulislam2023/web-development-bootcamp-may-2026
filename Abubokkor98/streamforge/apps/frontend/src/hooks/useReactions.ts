"use client"

import { useState, useEffect, useRef } from "react"
import { socket } from "@/lib/socket"
import type { ReactionBroadcast } from "@/lib/types/socket-events"

const REACTION_COOLDOWN_MS = 2_000
const REACTION_ANIMATION_DURATION_MS = 2_500

interface ActiveReaction extends ReactionBroadcast {
  horizontalOffset: number
}

interface UseReactionsOptions {
  roomKey: string
}

interface UseReactionsReturn {
  activeReactions: ActiveReaction[]
  sendReaction: (emoji: string) => void
  isCooldown: boolean
}

export function useReactions({
  roomKey,
}: UseReactionsOptions): UseReactionsReturn {
  const [activeReactions, setActiveReactions] = useState<ActiveReaction[]>([])
  const [isCooldown, setIsCooldown] = useState(false)
  const timerIdsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())

  useEffect(() => {
    function onReaction(payload: ReactionBroadcast) {
      const reaction: ActiveReaction = {
        ...payload,
        horizontalOffset: Math.random() * 80 + 10,
      }

      setActiveReactions((prev) => [...prev, reaction])

      // Auto-remove after animation completes
      const timerId = setTimeout(() => {
        timerIdsRef.current.delete(timerId)
        setActiveReactions((prev) =>
          prev.filter((r) => r.id !== reaction.id),
        )
      }, REACTION_ANIMATION_DURATION_MS)
      timerIdsRef.current.add(timerId)
    }

    socket.on("reaction", onReaction)

    return () => {
      socket.off("reaction", onReaction)
      for (const id of timerIdsRef.current) {
        clearTimeout(id)
      }
      timerIdsRef.current.clear()
    }
  }, [])

  function sendReaction(emoji: string) {
    if (isCooldown) {
      return
    }

    socket.emit("send-reaction", { roomKey, emoji })

    setIsCooldown(true)
    setTimeout(() => setIsCooldown(false), REACTION_COOLDOWN_MS)
  }

  return { activeReactions, sendReaction, isCooldown }
}
