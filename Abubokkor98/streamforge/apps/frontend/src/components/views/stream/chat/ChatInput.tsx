"use client"

import { useActionState } from "react"
import { SubmitButton } from "@/components/shared/submit-button"
import { PaperPlaneTilt } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

const MAX_MESSAGE_LENGTH = 300

interface ChatInputProps {
  onSend: (text: string) => void
  disabled?: boolean
  slowModeRemaining?: number | null
}

function ChatInput({ onSend, disabled, slowModeRemaining }: ChatInputProps) {
  const [, action, isPending] = useActionState(async (_: null, formData: FormData) => {
    const text = formData.get("text") as string
    if (text?.trim()) {
      onSend(text.trim())
    }
    return null
  }, null)

  const isSlowMode =
    slowModeRemaining !== null &&
    slowModeRemaining !== undefined &&
    slowModeRemaining > 0
  
  const isDisabled = disabled || isSlowMode || isPending

  const placeholderText = isSlowMode
    ? `Slow mode: ${slowModeRemaining}s`
    : "Send a message…"

  return (
    <form
      action={action}
      className="relative flex items-center gap-3 border-t border-border/30 bg-background/60 backdrop-blur-xl px-5 py-4"
    >
      <div className="relative flex-1">
        <input
          name="text"
          type="text"
          autoComplete="off"
          placeholder={placeholderText}
          maxLength={MAX_MESSAGE_LENGTH}
          disabled={isDisabled}
          className={cn(
            "w-full bg-secondary/50 rounded-2xl px-5 py-3 text-[14px] text-foreground placeholder:text-muted-foreground/60",
            "border border-border/40 shadow-inner transition-all duration-300",
            "focus:outline-none focus:ring-1 focus:ring-primary/50 focus:bg-secondary/70",
            "disabled:cursor-not-allowed disabled:opacity-40"
          )}
          aria-label="Chat message input"
        />
      </div>
      <SubmitButton
        size="icon"
        disabled={isDisabled}
        className="size-11 rounded-2xl bg-primary text-primary-foreground shadow-md hover:scale-105 active:scale-95 transition-all"
        aria-label="Send message"
      >
        <PaperPlaneTilt className="size-5" weight="fill" />
      </SubmitButton>
    </form>
  )
}

export { ChatInput }
