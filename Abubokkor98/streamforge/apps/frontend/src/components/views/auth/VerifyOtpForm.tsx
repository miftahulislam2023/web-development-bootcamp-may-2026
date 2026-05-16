import { FormField } from "@/components/shared/form-field"
import { FormAlert } from "@/components/shared/form-alert"
import { SubmitButton } from "@/components/shared/submit-button"

interface VerifyOtpFormProps {
  action: (formData: FormData) => void
  error: string | null
}

function VerifyOtpForm({ action, error }: VerifyOtpFormProps) {
  return (
    <form action={action} className="flex flex-col gap-6">
      <FormAlert message={error} />

      <FormField
        id="verify-otp"
        name="otp"
        type="text"
        label="Verification Code"
        placeholder="Enter 6-digit code"
        autoComplete="one-time-code"
        inputMode="numeric"
        pattern="[0-9]{6}"
        maxLength={6}
        required
      />

      <SubmitButton size="lg" pendingText="Verifying…">
        Verify Code
      </SubmitButton>
    </form>
  )
}

export { VerifyOtpForm }
