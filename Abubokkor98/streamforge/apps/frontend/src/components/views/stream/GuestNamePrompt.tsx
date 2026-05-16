"use client"

import { useActionState } from "react"
import { User } from "@phosphor-icons/react"
import { FormField } from "@/components/shared/form-field"
import { SubmitButton } from "@/components/shared/submit-button"

const GUEST_NAME_MIN_LENGTH = 2
const GUEST_NAME_MAX_LENGTH = 30

interface GuestNamePromptProps {
  roomTitle: string
  onSubmit: (guestName: string) => void
}

interface GuestNameState {
  error: string | null
}

const INITIAL_STATE: GuestNameState = { error: null }

function GuestNamePrompt({ roomTitle, onSubmit }: GuestNamePromptProps) {
  function handleAction(
    _prevState: GuestNameState,
    formData: FormData,
  ): GuestNameState {
    const rawName = formData.get("guestName")
    const name = typeof rawName === "string" ? rawName.trim() : ""

    if (name.length < GUEST_NAME_MIN_LENGTH) {
      return { error: `Name must be at least ${GUEST_NAME_MIN_LENGTH} characters.` }
    }

    if (name.length > GUEST_NAME_MAX_LENGTH) {
      return { error: `Name must not exceed ${GUEST_NAME_MAX_LENGTH} characters.` }
    }

    onSubmit(name)
    return INITIAL_STATE
  }

  const [state, action] = useActionState(handleAction, INITIAL_STATE)

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 p-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="rounded-full bg-primary/10 p-3">
          <User className="size-6 text-primary" weight="bold" />
        </div>
        <h1 className="text-lg font-semibold text-foreground">
          Join as Guest
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Enter a display name to watch &ldquo;{roomTitle}&rdquo;
        </p>
      </div>
      <form action={action} className="flex w-full max-w-xs flex-col gap-3">
        <FormField
          id="guestName"
          name="guestName"
          label="Display Name"
          placeholder="Your name"
          maxLength={GUEST_NAME_MAX_LENGTH}
          error={state.error ?? undefined}
          autoFocus
        />
        <SubmitButton pendingText="Joining…">Join Stream</SubmitButton>
      </form>
    </main>
  )
}

export { GuestNamePrompt }
