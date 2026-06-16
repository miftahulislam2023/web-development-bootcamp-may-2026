import type { ChatMessageResponse } from "@/lib/types/socket-events"
import { PushPin } from "@phosphor-icons/react"

interface PinnedMessageProps {
  message: ChatMessageResponse
}

function PinnedMessage({ message }: PinnedMessageProps) {
  return (
    <section
      role="status"
      aria-label="Pinned message"
      className="flex items-center gap-2.5 border-b border-border/30 bg-primary/5 px-4 py-3 backdrop-blur-md"
    >
      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
        <PushPin className="size-3 text-primary" weight="fill" />
      </div>
      <p className="truncate text-[12px] font-medium text-foreground/90">
        <span className="mr-2 font-bold text-primary tracking-tight">
          {message.senderName}
        </span>
        <span className="text-foreground/70">{message.text}</span>
      </p>
    </section>
  )
}

export { PinnedMessage }
