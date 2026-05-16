interface FloatingReactionProps {
  emoji: string
  horizontalOffset: number
}

function FloatingReaction({ emoji, horizontalOffset }: FloatingReactionProps) {
  return (
    <span
      className="pointer-events-none absolute bottom-0 animate-float-reaction text-2xl"
      style={{ left: `${horizontalOffset}%` }}
      aria-hidden="true"
    >
      {emoji}
    </span>
  )
}

export { FloatingReaction }
