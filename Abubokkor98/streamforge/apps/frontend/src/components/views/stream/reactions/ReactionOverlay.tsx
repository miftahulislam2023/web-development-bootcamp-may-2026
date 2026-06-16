import { FloatingReaction } from "@/components/views/stream/reactions/FloatingReaction"
import type { ReactionBroadcast } from "@/lib/types/socket-events"

interface ReactionOverlayProps {
  reactions: (ReactionBroadcast & { horizontalOffset: number })[]
}

function ReactionOverlay({ reactions }: ReactionOverlayProps) {
  if (reactions.length === 0) {
    return null
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
      aria-hidden="true"
    >
      {reactions.map((reaction) => (
        <FloatingReaction
          key={reaction.id}
          emoji={reaction.emoji}
          horizontalOffset={reaction.horizontalOffset}
        />
      ))}
    </div>
  )
}

export { ReactionOverlay }
