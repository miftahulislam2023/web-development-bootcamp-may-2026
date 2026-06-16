import Link from "next/link"
import { FormField } from "@/components/shared/form-field"
import { FormAlert } from "@/components/shared/form-alert"
import { SubmitButton } from "@/components/shared/submit-button"

interface ForgotPasswordFormProps {
  action: (formData: FormData) => void
  error: string | null
}

function ForgotPasswordForm({ action, error }: ForgotPasswordFormProps) {
  return (
    <form action={action} className="flex flex-col gap-6">
      <FormAlert message={error} />

      <FormField
        id="forgot-email"
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        autoComplete="email"
        required
      />

      <SubmitButton size="lg" pendingText="Sending code…">
        Send Reset Code
      </SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}

export { ForgotPasswordForm }
