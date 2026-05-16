interface FormAlertProps {
  message: string | null
  variant?: "error" | "success"
}

const VARIANT_STYLES = {
  error:
    "border-destructive/30 bg-destructive/10 text-destructive",
  success:
    "border-primary/30 bg-primary/10 text-primary",
} as const

/**
 * Form-level alert banner — displays at the top of a form
 * for general errors or success messages.
 */
function FormAlert({ message, variant = "error" }: FormAlertProps) {
  if (!message) return null

  return (
    <div
      role="alert"
      className={`rounded-md border px-4 py-3 text-sm ${VARIANT_STYLES[variant]}`}
    >
      {message}
    </div>
  )
}

export { FormAlert }
