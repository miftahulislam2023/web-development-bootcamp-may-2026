"use client";

import { useState } from "react";
import { deleteCategoryAction } from "@/app/actions/categories";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function DeleteCategoryButton({
  id,
}: {
  id: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    setIsDeleting(true);
    const formData = new FormData();
    formData.set("id", id);

    const result = await deleteCategoryAction(formData);

    if (result.status === "success") {
      toast.success(result.message ?? "Category deleted");
      window.location.reload();
      return;
    }

    toast.error(result.message ?? "Server Error");
    setIsDeleting(false);
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
}