import type { ChatMessageResponse } from "@/lib/types/socket-events"
import { Button } from "@/components/ui/button"
import { Trash, PushPin, Crown } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface ChatMessageItemProps {
  message: ChatMessageResponse & { pending?: boolean }
  isHost: boolean
  isSenderHost?: boolean
  isOwnMessage: boolean
  onDelete: (messageId: number) => void
  onPin: (messageId: number, isPinned: boolean) => void
}

function ChatMessageItem({
  message,
  isHost,
  isSenderHost,
  isOwnMessage,
  onDelete,
  onPin,
}: ChatMessageItemProps) {
  const isPending = !!message.pending

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-1.5 px-4 py-3 mx-2 my-1.5 rounded-2xl transition-all duration-300",
        "bg-secondary/40 border border-border/30 backdrop-blur-md",
        isOwnMessage && !isSenderHost && "border-l-2 border-l-primary",
        isPending && "animate-pulse opacity-50"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          {/* Host Badge */}
          {isSenderHost && (
            <div className="flex items-center gap-1 rounded bg-yellow-500/10 px-1.5 py-0.5 border border-yellow-500/20">
              <Crown className="size-2.5 text-yellow-600 dark:text-yellow-400" weight="fill" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400">
                Host
              </span>
            </div>
          )}

          <span
            className={cn(
              "truncate text-[11px] font-bold tracking-tight transition-colors duration-200",
              isSenderHost 
                ? "text-yellow-600 dark:text-yellow-400" 
                : "text-foreground/70 group-hover:text-primary"
            )}
          >
            {message.senderName || "Guest"}
          </span>
        </div>

        {/* Moderation Controls */}
        {isHost && !isPending && (
          <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onPin(message.id, !message.isPinned)}
              className={cn(
                "h-6 w-6 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary focus:outline-none",
                message.isPinned 
                  ? "bg-primary/20 text-primary hover:bg-primary/30" 
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <PushPin className="size-3" weight={message.isPinned ? "fill" : "regular"} />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onDelete(message.id)}
              className="h-6 w-6 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors focus-visible:ring-2 focus-visible:ring-destructive focus:outline-none"
            >
              <Trash className="size-3" />
            </Button>
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="wrap-break-word text-[13px] leading-relaxed text-foreground transition-colors duration-200 group-hover:text-foreground/90">
          {message.text}
        </p>
      </div>
    </article>
  )
}

export { ChatMessageItem }
