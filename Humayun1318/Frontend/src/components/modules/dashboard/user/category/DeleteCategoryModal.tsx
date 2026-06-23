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
import { toast } from "sonner";
import { useRemoveCategoryMutation } from "@/redux/features/category/category.api";

interface DeleteCategoryModalProps {
  open: boolean;
  onClose: () => void;
  categoryId: string | null;
  categoryName?: string;
}

export function DeleteCategoryModal({
  open,
  onClose,
  categoryId,
  categoryName,
}: DeleteCategoryModalProps) {
  const [removeCategory, { isLoading }] = useRemoveCategoryMutation();

  // handle delete category 
  const handleDelete = async () => {
    if (!categoryId) return;
    const toastId = toast.loading("Removing...", {position: "top-center"});
    try {
      const res = await removeCategory(categoryId).unwrap();
      if (res.success) {
        toast.success("Category removed.", { id: toastId, position: "top-center" });
        onClose();
      }
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to remove category.", {
        id: toastId,
        position: "top-center"
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {categoryName ?? "this category"}
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
