import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FormFieldProps extends React.ComponentProps<typeof Input> {
  label: string
  error?: string
  id: string
}

/**
 * Reusable form field — composes Label + Input + inline error.
 *
 * Uncontrolled by default (uses `name` attribute for FormData).
 * Sets aria-invalid and aria-describedby automatically when an error is present.
 */
function FormField({ label, error, id, ...inputProps }: FormFieldProps) {
  const errorId = `${id}-error`

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {error && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

export { FormField }
export type { FormFieldProps }
