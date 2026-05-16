"use client"

import { useRegisterAction } from "@/hooks/useRegisterAction"
import { RegisterForm } from "@/components/views/auth/RegisterForm"

export default function RegisterPage() {
  const { state, action } = useRegisterAction()

  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <section className="w-full max-w-sm space-y-6">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Start streaming on StreamForge
          </p>
        </header>
        <RegisterForm
          action={action}
          error={state.error}
          fieldErrors={state.fieldErrors}
        />
      </section>
    </main>
  )
}
