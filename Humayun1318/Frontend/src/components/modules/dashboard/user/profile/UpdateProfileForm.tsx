import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useUpdateProfileMutation } from "@/redux/features/user/userApi.api";

// ─── Schema ───────────────────────────────────────────────────────────────────

const updateProfileSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters." })
    .max(50, { message: "Name must be at most 50 characters." }),
  avatarUrl: z
    .string()
    .url({ message: "Please enter a valid image URL." })
    .optional()
    .or(z.literal("")),
});

type UpdateProfileValues = z.infer<typeof updateProfileSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface UpdateProfileFormProps {
  currentName: string;
  currentAvatarUrl: string | null;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function UpdateProfileForm({
  currentName,
  currentAvatarUrl,
}: UpdateProfileFormProps) {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const form = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: currentName,
      avatarUrl: currentAvatarUrl ?? "",
    },
  });

  const previewUrl = form.watch("avatarUrl");

  const onSubmit = async (values: UpdateProfileValues) => {
    const toastId = toast.loading("Updating profile...");
    try {
      const res = await updateProfile({
        name: values.name,
        avatarUrl: values.avatarUrl || null,
      }).unwrap();

      if (res.success) {
        toast.success("Profile updated!", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to update profile.", {
        id: toastId,
      });
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      <div>
        <h3 className="text-base font-semibold">Edit Profile</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Update your display name and avatar.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    className="h-9"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="sr-only">
                  Your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Avatar URL + preview */}
          <FormField
            control={form.control}
            name="avatarUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar URL (optional)</FormLabel>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarImage
                      src={previewUrl || undefined}
                      alt="Preview"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getInitials(form.watch("name") || currentName)}
                    </AvatarFallback>
                  </Avatar>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/avatar.jpg"
                      className="h-9"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormDescription className="text-xs">
                  Paste a direct image URL. Leave blank to use initials as avatar.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}