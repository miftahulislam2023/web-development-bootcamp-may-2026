import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarDays,
  Globe,
  Mail,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect } from "react";
import { useUpdateUserStatusMutation } from "@/redux/features/admin/admin.api";
import { AdminUser } from "@/types/admin.types";
import { getInitials } from "@/utils/getInitials";
import { getProviderLabel } from "@/utils/getProviderLabel";
import { formatDate } from "@/utils/formatDate";
import { statusStyles } from "@/utils/statusStyles";

// ─── Schema ───────────────────────────────────────────────────────────────────

const updateUserSchema = z.object({
  status: z.enum(["active", "suspended", "deleted"], {
    message: "Please select a status.",
  }),
});

type UpdateUserValues = z.infer<typeof updateUserSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface UserActionModalProps {
  open: boolean;
  onClose: () => void;
  user: AdminUser | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function UserActionModal({ open, onClose, user }: UserActionModalProps) {
    console.log("UserActionModal rendered with user:", user);
  const [updateUserStatus, { isLoading }] = useUpdateUserStatusMutation();

  const form = useForm<UpdateUserValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: { status: "active" },
  });

  // Sync form when a different user is opened
  useEffect(() => {
    if (user && open) {
      form.reset({ status: user.status });
    }
  }, [user, open, form]);

  const onSubmit = async (values: UpdateUserValues) => {
    console.log("Submitting form with values:", values);
    if (!user) return;
    const toastId = toast.loading("Updating user status...");
    try {
      const res = await updateUserStatus({
        userId: user._id,
        status: values.status,
      }).unwrap();

      if (res.success) {
        toast.success("User status updated.", { id: toastId });
        onClose();
      }
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to update user.", {
        id: toastId,
      });
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage User</DialogTitle>
        </DialogHeader>

        {/* ── User info section ── */}
        <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-4">
          {/* Avatar + name + email */}
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-base">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <p className="font-semibold leading-none">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>

              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {/* Role */}
                <Badge variant="secondary" className="capitalize text-xs">
                  {user.role}
                </Badge>
                {/* Status */}
                <Badge
                  variant="outline"
                  className={`capitalize text-xs ${statusStyles[user.status]}`}
                >
                  {user.status}
                </Badge>
                {/* Verified */}
                {user.isVerified ? (
                  <Badge
                    variant="outline"
                    className="border-blue-500/40 bg-blue-500/10 text-blue-600 text-xs gap-1"
                  >
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-amber-500/40 bg-amber-500/10 text-amber-600 text-xs gap-1"
                  >
                    <ShieldAlert className="h-3 w-3" />
                    Unverified
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Detail rows */}
          <div className="border-t border-border pt-3 grid grid-cols-2 gap-3 text-sm">
            <DetailRow icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={user.email} />
            <DetailRow icon={<Globe className="h-3.5 w-3.5" />} label="Timezone" value={user.timezone} />
            <DetailRow
              icon={<ShieldCheck className="h-3.5 w-3.5" />}
              label="Auth"
              value={getProviderLabel(user.auths)}
            />
            <DetailRow
              icon={<CalendarDays className="h-3.5 w-3.5" />}
              label="Joined"
              value={formatDate(user.createdAt)}
            />
          </div>
        </div>

        {/* ── Update status form ── */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Update Status
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="deleted">Deleted</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// ─── DetailRow ────────────────────────────────────────────────────────────────

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-muted-foreground mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-xs text-foreground break-all">{value}</p>
      </div>
    </div>
  );
}