import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Password from "@/components/ui/Password";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Info } from "lucide-react";
import { useSetPasswordMutation } from "@/redux/features/user/userApi.api";

// ─── Schema ───────────────────────────────────────────────────────────────────

const setPasswordSchema = z
  .object({
    newPassword: z
      .string({
        error: (issue) =>
          issue.input === undefined ? 'Password is required' : 'Password must be a string',
      })
      .min(8, {
        message: `Password must be at least 8 characters`,
      })
      .max(60, {
        message: `Password cannot exceed 60 characters`,
      })
      .refine((val) => /[a-z]/.test(val), {
        message: 'Password must contain at least one lowercase letter',
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: 'Password must contain at least one uppercase letter',
      })
      .refine((val) => /\d/.test(val), {
        message: 'Password must contain at least one number',
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "Please confirm your password." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SetPasswordValues = z.infer<typeof setPasswordSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

export function SetPasswordForm() {
  const [setPassword, { isLoading }] = useSetPasswordMutation();

  const form = useForm<SetPasswordValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SetPasswordValues) => {
    const toastId = toast.loading("Setting password...", { position: "top-center" });
    try {
      const res = await setPassword({
        password: values.newPassword,
      }).unwrap();

      if (res.success) {
        toast.success(
          "Password set! You can now log in with email & password.",
          {
            id: toastId,
            position: "top-center",
          },
        );
        form.reset();
      }
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to set password.", {
        id: toastId,
        position: "top-center",
      });
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      <div>
        <h3 className="text-base font-semibold">Set a Password</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          You signed up with Google. Set a password to also be able to log in
          with your email and password.
        </p>
      </div>

      {/* Info notice */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
        <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-600 dark:text-blue-400">
          Setting a password does not remove your Google login. Both methods
          will work.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* New Password */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Password className="h-9" {...field} />
                </FormControl>
                <FormDescription className="sr-only">
                  Must be at least 8 characters.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Password className="h-9" {...field} />
                </FormControl>
                <FormDescription className="sr-only">
                  Repeat the password.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Setting..." : "Set Password"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
