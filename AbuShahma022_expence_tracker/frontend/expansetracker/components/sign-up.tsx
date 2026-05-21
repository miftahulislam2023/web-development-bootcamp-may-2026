"use client"
import { useState } from "react"
import { LogoIcon } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAppDispatch } from "@/lib/hook"
import {
  setError,
  setLoading,
  setUser,
} from "@/lib/features/auth/authSlice"

import { registerUserApi } from "@/services/auth.api"

export default function SignupPage() {

   const dispatch = useAppDispatch()

  const router = useRouter()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    image: "",
  })

  const [previewImage, setPreviewImage] =
    useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, files } = e.target

    // Image Handling
    if (
      name === "image" &&
      files &&
      files[0]
    ) {
      const file = files[0]

      const reader = new FileReader()

      reader.readAsDataURL(file)

      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result as string,
        }))

        setPreviewImage(
          reader.result as string
        )
      }

      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    try {
      dispatch(setLoading(true))

      dispatch(setError(null))

      const payload = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        image: formData.image,
      }

      const response =
        await registerUserApi(payload)

      dispatch(setUser(response.data))

      toast.success(
        "Account created successfully"
      )

      router.push("/login")
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Something went wrong"

      dispatch(setError(message))

      toast.error(message)
    } finally {
      dispatch(setLoading(false))
    }
  }





  return (
    <section className="flex min-h-screen items-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950">

      <form
        onSubmit={handleSubmit}
        className="bg-card mx-auto w-full max-w-md rounded-3xl border shadow-xl">

        <div className="p-8">

          {/* Header */}
          <div className="mb-6">

            <Link
              href="/"
              aria-label="Go Home">

              <LogoIcon />

            </Link>

            <h1 className="mt-4 text-2xl font-bold tracking-tight">
              Create Your Account
            </h1>

            <p className="text-muted-foreground mt-2 text-sm">
              Start tracking expenses, managing budgets, and organizing your finances smarter.
            </p>
          </div>

          <div className="space-y-5">

            {/* Profile Image */}
            <div className="space-y-2">

              <Label htmlFor="image">
                Profile Image{" "}

                <span className="text-muted-foreground">
                  (Optional)
                </span>

              </Label>

              <Input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />

              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="size-16 rounded-full object-cover border"
                />
              )}
            </div>

            {/* Name */}
            <div className="grid grid-cols-2 gap-4">

              <div className="space-y-2">

                <Label htmlFor="firstName">
                  First Name
                </Label>

                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">

                <Label htmlFor="lastName">
                  Last Name
                </Label>

                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">

              <Label htmlFor="email">
                Email Address
              </Label>

              <Input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">

              <Label htmlFor="password">
                Password
              </Label>

              <Input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="h-11 w-full rounded-xl text-sm font-medium">

              Create Account

            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-muted/40 rounded-b-3xl border-t px-8 py-4">

          <p className="text-center text-sm text-muted-foreground">

            Already have an account?

            <Button
              asChild
              variant="link"
              className="px-2">

              <Link href="/login">
                Sign In
              </Link>

            </Button>
          </p>
        </div>
      </form>
    </section>
  )
}
