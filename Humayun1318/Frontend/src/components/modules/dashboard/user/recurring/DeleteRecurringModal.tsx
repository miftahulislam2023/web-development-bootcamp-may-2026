// components/modules/dashboard/user/recurring/DeleteRecurringModal.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRemoveRecurringTransactionMutation } from "@/redux/features/recurring/recurring.api";
import { toast } from "sonner";

interface DeleteRecurringModalProps {
  open: boolean;
  onClose: () => void;
  recurringId: string | null;
  recurringTitle?: string;
}

export function DeleteRecurringModal({
  open,
  onClose,
  recurringId,
  recurringTitle,
}: DeleteRecurringModalProps) {
  const [deleteRecurring, { isLoading }] = useRemoveRecurringTransactionMutation()

  const handleDelete = async () => {
    if (!recurringId) return;
    const toastId = toast.loading("Deleting recurring transaction...", { position: "top-center" });
    try {
      const res = await deleteRecurring(recurringId).unwrap();
      if (res.success) {
        toast.success("Recurring transaction deleted.", { id: toastId, position: "top-center" });
        onClose();
      } else {
        toast.error("Failed to delete recurring transaction.", { id: toastId, position: "top-center" });
      }
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to delete recurring transaction.", {
        id: toastId,
        position: "top-center"
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Recurring Transaction</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {recurringTitle ?? "this recurring transaction"}
            </span>
            ? This action cannot be undone. All future scheduled transactions will also be cancelled.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}