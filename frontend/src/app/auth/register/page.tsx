"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store";
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

type RegisterFormData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } =
    useAuthStore();

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const {
    register,
    handleSubmit,
  } = useForm<RegisterFormData>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (
    data: RegisterFormData
  ) => {
    try {
      setLoading(true);

      // Required fields check
      if (
        !data.email ||
        !data.firstName ||
        !data.lastName ||
        !data.password ||
        !data.confirmPassword
      ) {
        toast.error(
          "Please fill all required fields"
        );
        return;
      }

      // Password mismatch
      if (
        data.password !==
        data.confirmPassword
      ) {
        toast.error(
          "Passwords do not match"
        );
        return;
      }

      // Password length check
      if (
        data.password.length < 6
      ) {
        toast.error(
          "Password must be at least 6 characters"
        );
        return;
      }

      // Register API call
      const res =
        await registerUser(
          data.email,
          data.firstName,
          data.lastName,
          data.password
        );

      // Success message
      toast.success(
        res?.message ||
          "Account created successfully 🎉"
      );

      // Redirect
      setTimeout(() => {
        router.push(
          "/auth/login"
        );
      }, 1200);
    } catch (error: any) {
      // Backend error message
      const backendMessage =
        error?.response?.data
          ?.error?.message;

      toast.error(
        backendMessage ||
          error?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          Create Account
        </CardTitle>

        <CardDescription>
          Join FinanceApp today
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
          className="space-y-4"
        >
          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>
                First Name
              </Label>

              <Input
                placeholder="John"
                {...register(
                  "firstName"
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>
                Last Name
              </Label>

              <Input
                placeholder="Doe"
                {...register(
                  "lastName"
                )}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>Email</Label>

            <Input
              type="email"
              placeholder="you@example.com"
              {...register(
                "email"
              )}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label>
              Password
            </Label>

            <div className="relative">
              <Input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                className="pr-12"
                placeholder="••••••••"
                {...register(
                  "password"
                )}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff
                    size={18}
                  />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label>
              Confirm Password
            </Label>

            <div className="relative">
              <Input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                className="pr-12"
                placeholder="••••••••"
                {...register(
                  "confirmPassword"
                )}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? (
                  <EyeOff
                    size={18}
                  />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create account"}
          </Button>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an
            account?{" "}
            <Link
              href="/auth/login"
              className="text-primary underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}