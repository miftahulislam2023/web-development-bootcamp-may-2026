"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@socialIO/ui/components/button";
import { Input } from "@socialIO/ui/components/input";
import { Label } from "@socialIO/ui/components/label";
import { authClient } from "@/lib/auth-client";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUpForm({ onSwitchToSignIn }: { onSwitchToSignIn: () => void }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignUpValues) => {
    await authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.name,
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
          toast.success("Account created successfully!");
        },
        onError: (error) => {
          toast.error(error.error.message || error.error.statusText);
        },
      }
    );
  };

  return (
    <div className="w-full">
      <h2 className="mb-1 text-2xl font-bold text-[#27272A] dark:text-[#F4F4F5]">Create Account</h2>
      <p className="mb-6 text-sm text-[#71717A] dark:text-[#A1A1AA]">
        Enter your details below to create your account.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[#27272A] dark:text-[#F4F4F5]">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            className="border-[#E4E4E7] dark:border-[#3F3F46] focus-visible:ring-[#E07A5F]"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-[#E63946]">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#27272A] dark:text-[#F4F4F5]">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="border-[#E4E4E7] dark:border-[#3F3F46] focus-visible:ring-[#E07A5F]"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-[#E63946]">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[#27272A] dark:text-[#F4F4F5]">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="border-[#E4E4E7] dark:border-[#3F3F46] focus-visible:ring-[#E07A5F]"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-[#E63946]">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#E07A5F] hover:bg-[#c96c53] text-white transition-colors duration-200"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-[#71717A] dark:text-[#A1A1AA]">
          Already have an account?{" "}
          <button
            onClick={onSwitchToSignIn}
            className="font-medium text-[#E07A5F] hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
