"use client"

import InputField from "@/components/auth/InputField"
import SubmitBtn from "@/components/auth/SubmitBtn"
import useAuth from "@/hooks/useAuth"

export default function SignupPage() {
  const { register, errors, submitSignup } = useAuth()

  return (
    <form onSubmit={submitSignup} className="space-y-6">

      <InputField
        id="name"
        label="Full name"
        type="text"
        placeholder="John Doe"
        register={register('name', { required: "Name is required" })}
        error={errors.name}
      />

      <InputField
        id="email"
        label="Email Address"
        type="email"
        placeholder="john@example.com"
        register={register('email', { required: "Email is required" })}
        error={errors.email}
      />

      <InputField
        id="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        register={register('password', { required: "Password is required" })}
        error={errors.password}
      />

      <InputField
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        register={register('confirmPassword', { required: "Confirm password is required" })}
        error={errors.confirmPassword}
      />

      <SubmitBtn label="Create Account" />
    </form>
  )
}
