"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeSlash } from "@phosphor-icons/react"

interface PasswordFieldProps
  extends Omit<React.ComponentProps<typeof Input>, "type"> {
  label: string
  error?: string
  id: string
}

/**
 * Password field with visibility toggle.
 *
 * Eye icon toggles between password/text input types.
 * Error is rendered directly from the prop (managed by useActionState).
 */
function PasswordField({ label, error, id, ...inputProps }: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false)
  const errorId = `${id}-error`

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={isVisible ? "text" : "password"}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className="pr-10"
          {...inputProps}
        />
        <button
          type="button"
          onClick={() => setIsVisible((prev) => !prev)}
          className="absolute right-0 top-0 flex h-full w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
        >
          {isVisible ? (
            <EyeSlash className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

export { PasswordField }
