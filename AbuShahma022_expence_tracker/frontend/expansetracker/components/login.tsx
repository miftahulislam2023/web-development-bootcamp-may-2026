"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { toast } from "sonner"

import { LogoIcon } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useAppDispatch } from "@/lib/hook"

import {
  setError,
  setLoading,
  setUser,
} from "@/lib/features/auth/authSlice"

import { loginUserApi } from "@/services/auth.api"


export default function LoginPage() {
  const dispatch = useAppDispatch()

  const router = useRouter()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

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

    try {
      dispatch(setLoading(true))

      dispatch(setError(null))

      const response =
        await loginUserApi(formData)

      dispatch(setUser(response.data))

      toast.success("Login successful")

      router.push("/dashboard")
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Invalid credentials"

      dispatch(setError(message))

      toast.error(message)
    } finally {
      dispatch(setLoading(false))
    }
  }


  const handleDemoLogin =
  async () => {

    try {

      dispatch(setLoading(true))

      dispatch(setError(null))

      const response =
        await loginUserApi({
          email:
            "waker1@gmail.com",

          password:
            "123456",
        })

      dispatch(
        setUser(response.data)
      )

      toast.success(
        "Demo login successful"
      )

      router.push("/dashboard")

    } catch (error: any) {

      const message =
        error?.response?.data?.message ||
        "Demo login failed"

      toast.error(message)
    } finally {

      dispatch(setLoading(false))
    }
  }



return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">

      <form
        onSubmit={handleSubmit}
        className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">

        <div className="p-8 pb-6">

          {/* Header */}
          <div>

            <Link
              href="/"
              aria-label="go home">

              <LogoIcon />

            </Link>

            <h1 className="mb-1 mt-4 text-xl font-semibold">
              Sign In to Expense Tracker
            </h1>

            <p className="text-sm text-muted-foreground">
              Welcome back! Sign in to continue managing your finances.
            </p>
          </div>

          <hr className="my-4 border-dashed" />

          <div className="space-y-6">

            {/* Email */}
            <div className="space-y-2">

              <Label
                htmlFor="email"
                className="block text-sm">

                Email Address

              </Label>

              <Input
                type="email"
                required
                name="email"
                id="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="space-y-0.5">

              <div className="flex items-center justify-between">

                <Label
                  htmlFor="password"
                  className="text-sm">

                  Password

                </Label>

                <Button
                  asChild
                  variant="link"
                  size="sm">

                  <Link
                    href="/forgetpassword"
                    className="text-sm">

                    Forgot Password?

                  </Link>

                </Button>
              </div>

              <Input
                type="password"
                required
                name="password"
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="input sz-md variant-mixed"
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full cursor-pointer">

              Sign In

            </Button>

            <Button
            type="button"
          variant="outline"
           onClick={handleDemoLogin}
            className="w-full cursor-pointer">

            Demo Login

          </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-muted rounded-(--radius) border p-3">

          <p className="text-accent-foreground text-center text-sm">

            Don&apos;t have an account?

            <Button
              asChild
              variant="link"
              className="px-2">

              <Link href="/signup">
                Create account
              </Link>

            </Button>
          </p>
        </div>
      </form>
    </section>
  )
}
