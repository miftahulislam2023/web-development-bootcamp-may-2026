"use client"

import { useState } from "react"

import Link from "next/link"

import { useRouter } from "next/navigation"

import { toast } from "sonner"

import { LogoIcon } from "@/components/logo"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useAppDispatch } from "@/lib/hook"

import { setError, setLoading } from "@/lib/features/auth/authSlice"

import { sendOtpApi } from "@/services/auth.api"

export default function ForgotPasswordPage() {
  const dispatch = useAppDispatch()

  const router = useRouter()

  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      dispatch(setLoading(true))

      dispatch(setError(null))

      const response = await sendOtpApi({ email })

      toast.success(response.message || "OTP sent successfully")
      localStorage.setItem("resetEmail", email)

      router.push("/otp")
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to send OTP"

      dispatch(setError(message))

      toast.error(message)
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        onSubmit={handleSubmit}
        className="m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border bg-muted shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="-m-px rounded-[calc(var(--radius)+.125rem)] border bg-card p-8 pb-6">
          {/* Header */}
          <div>
            <Link href="/" aria-label="go home">
              <LogoIcon />
            </Link>

            <h1 className="mt-4 mb-1 text-xl font-semibold">
              Recover Password
            </h1>

            <p className="text-sm">Enter your email to receive OTP</p>
          </div>

          {/* Form */}
          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">
                Email
              </Label>

              <Input
                type="email"
                required
                name="email"
                id="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full">
              Send OTP
            </Button>
          </div>

          {/* Bottom Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              We&apos;ll send you an OTP to verify your email.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3">
          <p className="text-center text-sm text-accent-foreground">
            Remembered your password?
            <Button asChild variant="link" className="px-2">
              <Link href="/login">Log in</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  )
}
