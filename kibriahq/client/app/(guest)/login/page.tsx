"use client"

import InputField from "@/components/auth/InputField"
import SubmitBtn from "@/components/auth/SubmitBtn"
import useAuth from "@/hooks/useAuth"


export default function LoginPage() {
  const { register, errors, submitLogin } = useAuth();

  return (
    <form onSubmit={submitLogin} className="space-y-6">
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

      <SubmitBtn label="Sign In" />
    </form>
  )
}
