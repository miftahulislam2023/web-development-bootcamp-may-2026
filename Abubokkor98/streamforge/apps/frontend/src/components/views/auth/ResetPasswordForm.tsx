import { PasswordField } from "@/components/shared/password-field"
import { FormAlert } from "@/components/shared/form-alert"
import { SubmitButton } from "@/components/shared/submit-button"

interface ResetPasswordFormProps {
  action: (formData: FormData) => void
  error: string | null
  fieldErrors: {
    newPassword?: string
    confirmPassword?: string
  }
}

function ResetPasswordForm({
  action,
  error,
  fieldErrors,
}: ResetPasswordFormProps) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <FormAlert message={error} />

      <PasswordField
        id="reset-new-password"
        name="newPassword"
        label="New Password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={fieldErrors.newPassword}
        required
      />

      <PasswordField
        id="reset-confirm-password"
        name="confirmPassword"
        label="Confirm New Password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={fieldErrors.confirmPassword}
        required
      />

      <SubmitButton size="lg" pendingText="Resetting…">
        Reset Password
      </SubmitButton>
    </form>
  )
}

export { ResetPasswordForm }
