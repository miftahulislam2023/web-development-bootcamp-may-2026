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

import {
  setError,
  setLoading,
} from "@/lib/features/auth/authSlice"

import { resetPasswordApi } from "@/services/auth.api"

function NewPassword() {
  const dispatch = useAppDispatch()

  const router = useRouter()

  const [formData, setFormData] =
    useState({
      password: "",
      confirmPassword: "",
    })

  const email =
    typeof window !== "undefined"
      ? localStorage.getItem(
          "resetEmail"
        )
      : null
console.log("Reset Email:", email)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      toast.error(
        "Passwords do not match"
      )

      return
    }

    try {
      dispatch(setLoading(true))

      dispatch(setError(null))

      const response =
        await resetPasswordApi({
          email: email || "",
          password:
            formData.password,
        })

      toast.success(
        response.message ||
          "Password reset successful"
      )

      localStorage.removeItem(
        "resetEmail"
      )

      router.push("/login")
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Failed to reset password"

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
        className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">

        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">

          {/* Header */}
          <div>

            <Link
              href="/"
              aria-label="go home">

              <LogoIcon />

            </Link>

            <h1 className="mb-1 mt-4 text-xl font-semibold">
              Create New Password
            </h1>

            <p className="text-sm text-muted-foreground">
              Your new password must be different from previous passwords.
            </p>
          </div>

          {/* Form */}
          <div className="mt-6 space-y-6">

            {/* New Password */}
            <div className="space-y-2">

              <Label
                htmlFor="password"
                className="block text-sm">

                New Password

              </Label>

              <Input
                type="password"
                required
                name="password"
                id="password"
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">

              <Label
                htmlFor="confirmPassword"
                className="block text-sm">

                Confirm Password

              </Label>

              <Input
                type="password"
                required
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={
                  formData.confirmPassword
                }
                onChange={handleChange}
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full">

              Reset Password

            </Button>
          </div>

          {/* Bottom Text */}
          <div className="mt-6 text-center">

            <p className="text-muted-foreground text-sm">
              Make sure your password is strong and secure.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3">

          <p className="text-accent-foreground text-center text-sm">

            Remembered your password?

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
      </form>
    </section>
  )
}

export default NewPassword