import Link from "next/link"
import { FormField } from "@/components/shared/form-field"
import { PasswordField } from "@/components/shared/password-field"
import { FormAlert } from "@/components/shared/form-alert"
import { SubmitButton } from "@/components/shared/submit-button"

interface RegisterFormProps {
  action: (formData: FormData) => void
  error: string | null
  fieldErrors: {
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
  }
}

function RegisterForm({ action, error, fieldErrors }: RegisterFormProps) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <FormAlert message={error} />

      <FormField
        id="register-name"
        name="name"
        type="text"
        label="Name"
        placeholder="Your name"
        autoComplete="name"
        error={fieldErrors.name}
        required
      />

      <FormField
        id="register-email"
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        autoComplete="email"
        error={fieldErrors.email}
        required
      />

      <PasswordField
        id="register-password"
        name="password"
        label="Password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={fieldErrors.password}
        required
      />

      <PasswordField
        id="register-confirm-password"
        name="confirmPassword"
        label="Confirm Password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={fieldErrors.confirmPassword}
        required
      />

      <SubmitButton size="lg" pendingText="Creating account…">
        Create Account
      </SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
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

export { RegisterForm }
