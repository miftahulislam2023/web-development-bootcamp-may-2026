"use client"

import { useVerifyOtpAction } from "@/hooks/useVerifyOtpAction"
import { VerifyOtpForm } from "@/components/views/auth/VerifyOtpForm"

export default function VerifyOtpPage() {
  const { state, action } = useVerifyOtpAction()

  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <section className="w-full max-w-sm space-y-6">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code we sent to your email
          </p>
        </header>
        <VerifyOtpForm action={action} error={state.error} />
      </section>
    </main>
  )
}
