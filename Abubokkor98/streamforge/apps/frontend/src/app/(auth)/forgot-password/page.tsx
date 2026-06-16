"use client"

import { useForgotPasswordAction } from "@/hooks/useForgotPasswordAction"
import { ForgotPasswordForm } from "@/components/views/auth/ForgotPasswordForm"

export default function ForgotPasswordPage() {
  const { state, action } = useForgotPasswordAction()

  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <section className="w-full max-w-sm space-y-6">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Forgot password?
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a reset code
          </p>
        </header>
        <ForgotPasswordForm action={action} error={state.error} />
      </section>
    </main>
  )
}
