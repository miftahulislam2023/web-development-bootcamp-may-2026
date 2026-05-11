// src/app/auth/register/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, login } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setError,
  } = useForm({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });
  const [generalError, setGeneralError] = useState("");

  const onSubmit = async (data: any) => {
    try {
      setGeneralError("");

      if (data.password !== data.confirmPassword) {
        setGeneralError("Passwords do not match");
        return;
      }

      await registerUser(
        data.email,
        data.firstName,
        data.lastName,
        data.password,
      );
      // Auto-login after registration
      await login(data.email, data.password);
      router.push("/auth/login");
    } catch (error: any) {
      setGeneralError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>Join FinanceApp today</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {generalError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {generalError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                placeholder="John"
                {...register("firstName", {
                  required: "First name is required",
                })}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                placeholder="Doe"
                {...register("lastName", { required: "Last name is required" })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword", {
                required: "Please confirm your password",
              })}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>

          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
