"use client"

import { useId, useState } from "react"

import Link from "next/link"

import { useRouter } from "next/navigation"

import { toast } from "sonner"

import { LogoIcon } from "@/components/logo"

import { Button } from "@/components/ui/button"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import { Label } from "@/components/ui/label"

import { useAppDispatch } from "@/lib/hook"

import {
  setError,
  setLoading,
} from "@/lib/features/auth/authSlice"

import { verifyOtpApi } from "@/services/auth.api"

const OtpInput = () => {
  const id = useId()

  const router = useRouter()

  const dispatch = useAppDispatch()

  const [otp, setOtp] = useState("")

  const email =
    typeof window !== "undefined"
      ? localStorage.getItem(
          "resetEmail"
        )
      : null

  const handleVerifyOtp = async () => {
    try {
      dispatch(setLoading(true))

      dispatch(setError(null))

      const response =
        await verifyOtpApi({
          email: email || "",
          otp,
        })

      toast.success(
        response.message ||
          "OTP verified successfully"
      )

      router.push("/newpassword")
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Invalid OTP"

      dispatch(setError(message))

      toast.error(message)
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">

      <div className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">

        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">

          {/* Header */}
          <div>

            <Link
              href="/"
              aria-label="go home">

              <LogoIcon />

            </Link>

            <h1 className="mb-1 mt-4 text-xl font-semibold">
              Verify OTP
            </h1>

            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code sent to your email.
            </p>
          </div>

          {/* OTP */}
          <div className="mt-6 flex flex-col items-center space-y-6">

            <div className="space-y-3">

              <Label
                htmlFor={id}
                className="block text-center text-sm">

                Verification Code

              </Label>

              <InputOTP
                id={id}
                maxLength={6}
                value={otp}
                onChange={(value) =>
                  setOtp(value)
                }>

                <InputOTPGroup className="gap-2">

                  <InputOTPSlot
                    index={0}
                    className="size-12 rounded-xl border bg-background text-base font-semibold shadow-sm"
                  />

                  <InputOTPSlot
                    index={1}
                    className="size-12 rounded-xl border bg-background text-base font-semibold shadow-sm"
                  />

                  <InputOTPSlot
                    index={2}
                    className="size-12 rounded-xl border bg-background text-base font-semibold shadow-sm"
                  />
                </InputOTPGroup>

                <InputOTPSeparator className="mx-2 text-muted-foreground" />

                <InputOTPGroup className="gap-2">

                  <InputOTPSlot
                    index={3}
                    className="size-12 rounded-xl border bg-background text-base font-semibold shadow-sm"
                  />

                  <InputOTPSlot
                    index={4}
                    className="size-12 rounded-xl border bg-background text-base font-semibold shadow-sm"
                  />

                  <InputOTPSlot
                    index={5}
                    className="size-12 rounded-xl border bg-background text-base font-semibold shadow-sm"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              onClick={handleVerifyOtp}
              className="w-full">

              Verify OTP

            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3">

          <p className="text-accent-foreground text-center text-sm">

            Back to login?

            <Button
              asChild
              variant="link"
              className="px-2">

              <Link href="/login">
                Log in
              </Link>

            </Button>
          </p>
        </div>
      </div>
    </section>
  )
}

export default OtpInput