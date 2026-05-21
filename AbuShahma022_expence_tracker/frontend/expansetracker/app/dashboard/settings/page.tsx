"use client"

import {
  useState,
} from "react"

import Image from "next/image"

import { toast } from "sonner"

import {
  Camera,
  Save,
} from "lucide-react"

import {
  useAppDispatch,
  useAppSelector,
} from "@/lib/hook"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import { setUser } from "@/lib/features/auth/authSlice"

import {
  updateProfileApi,
} from "@/services/auth.api"

export default function SettingPage() {

  const dispatch =
    useAppDispatch()

  const user =
    useAppSelector(
      (state) => state.auth.user
    )

  const [loading, setLoading] =
    useState(false)

  const [formData, setFormData] =
    useState({
      name:
        user?.name || "",

      email:
        user?.email || "",

      image:
        user?.image || "",
    })

  // input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,

      [e.target.name]:
        e.target.value,
    }))
  }

  // image upload
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0]

    if (!file) return

    const reader =
      new FileReader()

    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,

        image:
          reader.result as string,
      }))
    }

    reader.readAsDataURL(file)
  }

  // submit
  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault()

      try {
        setLoading(true)

        const response =
          await updateProfileApi(
            formData
          )

        dispatch(
          setUser(
            response.data
          )
        )

        toast.success(
          "Profile updated"
        )
      } catch (error) {
        console.log(error)

        toast.error(
          "Failed to update profile"
        )
      } finally {
        setLoading(false)
      }
    }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>

        <h1 className="text-4xl font-bold tracking-tight">
          Settings
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage your account settings and profile.
        </p>
      </div>

      {/* Card */}
      <div className="bg-card rounded-3xl border p-8 shadow-sm">

        <form
          onSubmit={handleSubmit}
          className="space-y-8">

          {/* Profile */}
          <div className="flex flex-col items-center gap-5 sm:flex-row">

            <div className="relative">

              <div className="relative size-28 overflow-hidden rounded-full border">

                {formData.image ? (
                  <Image
                    src={formData.image}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-3xl font-bold">

                    {formData.name?.charAt(0)}

                  </div>
                )}
              </div>

              <label className="absolute bottom-0 right-0 flex size-10 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">

                <Camera className="size-4" />

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={
                    handleImageChange
                  }
                />
              </label>
            </div>

            <div>

              <h2 className="text-2xl font-semibold">

                {formData.name}

              </h2>

              <p className="text-muted-foreground">
                {formData.email}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="grid gap-6">

            {/* Name */}
            <div className="space-y-2">

              <Label>
                Full Name
              </Label>

              <Input
                name="name"
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">

              <Label>
                Email Address
              </Label>

              <Input
                type="email"
                name="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                placeholder="Email address"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">

            <Button
              type="submit"
              disabled={loading}
              className="h-12 rounded-2xl px-6">

              <Save className="mr-2 size-4" />

              {loading
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}