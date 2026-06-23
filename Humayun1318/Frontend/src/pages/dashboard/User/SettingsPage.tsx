import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useDeleteAccountMutation } from "@/redux/features/user/userApi.api";

// ─── Component ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { user: userData, isLoading } = useUser();
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();

  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");

  // User must type both email + password
  const isConfirmed =
    confirmEmail.trim() === userData?.email && password.trim().length > 0;

  const handleDeleteAccount = async () => {
    console.log("delete", password)
    const toastId = toast.loading("Deleting your account...", {
      position: "top-center",
    });

    try {
      const res = await deleteAccount({
        password,
      }).unwrap();

      if (res.success) {
        toast.success("Account deleted. Goodbye!", {
          id: toastId,
          position: "top-center",
        });

        navigate("/login");
      }
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to delete account.", {
        id: toastId,
        position: "top-center",
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-5 py-8 space-y-6">
      {isLoading ? (
        <div className="py-12 text-center text-muted-foreground text-sm">
          Loading…
        </div>
      ) : !userData ? (
        <div className="py-12 text-center text-muted-foreground text-sm">
          Unable to load data.
        </div>
      ) : (
        <>
          <div>
            <h1 className="text-xl font-semibold">Settings</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage your account settings.
            </p>
          </div>

          {/* Danger Zone */}
          <div className="rounded-xl border border-destructive/30 bg-card p-6 space-y-4">
            <div className="flex items-start gap-3">
              <TriangleAlert className="h-5 w-5 text-destructive mt-0.5 shrink-0" />

              <div>
                <h3 className="text-base font-semibold text-destructive">
                  Delete Account
                </h3>

                <p className="text-sm text-muted-foreground mt-1">
                  Permanently delete your account and all associated data —
                  including all transactions, categories, and recurring
                  schedules. This action is <strong>irreversible</strong> and
                  cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="destructive"
                onClick={() => setDialogOpen(true)}
                className="shrink-0"
              >
                Delete My Account
              </Button>
            </div>
          </div>

          {/* Confirmation Dialog */}
          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogContent className="sm:max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-destructive">
                  Are you absolutely sure?
                </AlertDialogTitle>

                <AlertDialogDescription className="space-y-3">
                  <span className="block">
                    This will permanently delete your account and all your data.
                    There is no way to recover it.
                  </span>

                  <span className="block">
                    To confirm, type your email address{" "}
                    <strong className="text-foreground">
                      {userData?.email}
                    </strong>{" "}
                    and your password below:
                  </span>
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-3">
                <Input
                  placeholder={userData?.email}
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  className="h-9"
                />

                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-9"
                />
              </div>

              <AlertDialogFooter className="mt-2">
                <AlertDialogCancel
                  disabled={isDeleting}
                  onClick={() => {
                    setConfirmEmail("");
                    setPassword("");
                  }}
                >
                  Cancel
                </AlertDialogCancel>

                <Button
                  variant="destructive"
                  disabled={!isConfirmed || isDeleting}
                  onClick={handleDeleteAccount}
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete My Account"}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
