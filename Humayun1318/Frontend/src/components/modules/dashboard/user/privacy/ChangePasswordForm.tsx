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
import { useChangePasswordMutation } from "@/redux/features/user/userApi.api";

// ─── Schema ───────────────────────────────────────────────────────────────────

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required." }),
    newPassword: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Password is required"
            : "Password must be a string",
      })
      .min(8, {
        message: `Password must be at least 8 characters`,
      })
      .max(60, {
        message: `Password cannot exceed 60 characters`,
      })
      .refine((val) => /[a-z]/.test(val), {
        message: "Password must contain at least one lowercase letter",
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((val) => /\d/.test(val), {
        message: "Password must contain at least one number",
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "Please confirm your new password." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

export function ChangePasswordForm() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ChangePasswordValues) => {
    const toastId = toast.loading("Updating password...", { position: "top-center" });
    try {
      const res = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();

      if (res.success) {
        toast.success("Password updated successfully.", { id: toastId, position: "top-center" });
        form.reset();
      }
    } catch (err: any) {
      const status = err?.status;
      if (status === 401) {
        toast.error("Current password does not match, try again!.", { id: toastId, position: "top-center" });
      }else if(status === 400) {
        toast.error("New password must be different from the current password", { id: toastId, position: "top-center" });
      } else {
        toast.error(err?.data?.message ?? "Failed to update password.", {
          id: toastId,
          position: "top-center"
        });
      }
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      <div>
        <h3 className="text-base font-semibold">Change Password</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Update your current password. Choose a strong password with at least 8
          characters.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Current Password */}
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Password className="h-9" {...field} />
                </FormControl>
                <FormDescription className="sr-only">
                  Your existing password.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Password className="h-9" {...field} />
                </FormControl>
                <FormDescription className="sr-only">
                  Repeat the new password.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
