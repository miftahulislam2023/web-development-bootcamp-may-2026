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
import { useRemoveTransactionMutation } from "@/redux/features/transactions/transactions.api";
import { toast } from "sonner";

interface DeleteTransactionModalProps {
  open: boolean;
  onClose: () => void;
  transactionId: string | null;
  transactionTitle?: string;
}

export function DeleteTransactionModal({
  open,
  onClose,
  transactionId,
  transactionTitle,
}: DeleteTransactionModalProps) {
  const [removeTransaction, { isLoading }] = useRemoveTransactionMutation();

  // handle delete transaction 
  const handleDelete = async () => {
    if (!transactionId) return;
    const toastId = toast.loading("Removing...", {position: "top-center"});
    try {
      const res = await removeTransaction(transactionId).unwrap();
      if (res.success) {
        toast.success("Transaction removed.", { id: toastId, position: "top-center" });
        onClose();
      }
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to remove transaction.", {
        id: toastId,
        position: "top-center"
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {transactionTitle ?? "this transaction"}
            </span>
            ? This action cannot be undone.
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