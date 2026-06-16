import { Button } from "@/components/ui/button"

const REACTION_EMOJIS = ["🔥", "❤️", "👏", "😂", "😮"] as const

interface ReactionBarProps {
  onReaction: (emoji: string) => void
  disabled?: boolean
}

function ReactionBar({ onReaction, disabled }: ReactionBarProps) {
  return (
    <nav className="flex items-center gap-1.5" aria-label="Reactions">
      {REACTION_EMOJIS.map((emoji) => (
        <Button
          key={emoji}
          variant="ghost"
          size="icon-sm"
          onClick={() => onReaction(emoji)}
          disabled={disabled}
          className="rounded-full bg-white/5 text-base backdrop-blur-md transition-transform hover:scale-110 hover:bg-white/10 disabled:opacity-30"
          aria-label={`React with ${emoji}`}
        >
          {emoji}
        </Button>
      ))}
    </nav>
  )
}

export { ReactionBar }
