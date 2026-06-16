"use client"

import { useLoginAction } from "@/hooks/useLoginAction"
import { LoginForm } from "@/components/views/auth/LoginForm"

export default function LoginPage() {
  const { state, action } = useLoginAction()

  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <section className="w-full max-w-sm space-y-6">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your StreamForge account
          </p>
        </header>
        <LoginForm action={action} error={state.error} />
      </section>
    </main>
  )
}
