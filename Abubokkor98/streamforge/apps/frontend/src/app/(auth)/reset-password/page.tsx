"use client"

import { useResetPasswordAction } from "@/hooks/useResetPasswordAction"
import { ResetPasswordForm } from "@/components/views/auth/ResetPasswordForm"

export default function ResetPasswordPage() {
  const { state, action } = useResetPasswordAction()

  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <section className="w-full max-w-sm space-y-6">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Reset your password
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose a new password for your account
          </p>
        </header>
        <ResetPasswordForm
          action={action}
          error={state.error}
          fieldErrors={state.fieldErrors}
        />
      </section>
    </main>
  )
}
