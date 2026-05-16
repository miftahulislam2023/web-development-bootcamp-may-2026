"use client"

import { useFormStatus } from "react-dom"
import { SpinnerGap } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import type { VariantProps } from "class-variance-authority"
import { buttonVariants } from "@/components/ui/button"

interface SubmitButtonProps
  extends Omit<React.ComponentProps<"button">, "type">,
    VariantProps<typeof buttonVariants> {
  pendingText?: string
}

/**
 * Form submit button that automatically shows loading state
 * via React 19's useFormStatus — no prop-drilling needed.
 *
 * Must be used inside a <form> with an action.
 */
function SubmitButton({
  children,
  pendingText,
  disabled,
  variant = "default",
  size = "default",
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      disabled={pending || disabled}
      aria-busy={pending}
      {...props}
    >
      {pending ? (
        <>
          <SpinnerGap className="size-4 animate-spin" aria-hidden="true" />
          {pendingText ?? children}
        </>
      ) : (
        children
      )}
    </Button>
  )
}

export { SubmitButton }
