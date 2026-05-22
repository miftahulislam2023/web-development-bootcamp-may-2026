"use client";

import { useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { IManageCategoriesProps } from "@/interfaces/interfaces";
import { Pencil, Trash2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import UpdateCategoryModal from "./update-category-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteCategoryAction } from "@/app/actions/categories";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CategoriesTable({
  categories,
  pagination,
}: IManageCategoriesProps) {
  const { totalPages, currentPage } = pagination;
  const [dialogOpenId, setDialogOpenId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const buildSortHref = (
    field: string,
    direction: "asc" | "desc",
  ) => {
    return `/dashboard/categories?page=1&orderBy=${field}&orderDir=${direction}`;
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    const formData = new FormData();
    formData.set("id", id);
    const result = await deleteCategoryAction(formData);
    setIsDeleting(false);

    if (result.status === "success") {
      toast.success(result.message ?? "Category deleted");
      setDialogOpenId(null);
      return;
    }

    toast.error(result.message ?? "Server Error");
  };

  return (
    <div>
      {categories && categories.length > 0 ? (
        <Table className="min-w-[720px] rounded-2xl border border-border/60 bg-card/80 shadow-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">
                <div className="flex items-center gap-1">
                  Name
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        aria-label="Sort name"
                      >
                        <ChevronDown className="size-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem asChild>
                        <Link href={buildSortHref("name", "asc")}>
                          Sort A-Z
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={buildSortHref("name", "desc")}>
                          Sort Z-A
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">
                <div className="flex items-center gap-1">
                  Type
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        aria-label="Sort type"
                      >
                        <ChevronDown className="size-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem asChild>
                        <Link href={buildSortHref("type", "asc")}>
                          Income first
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={buildSortHref("type", "desc")}>
                          Expense first
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">
                <div className="flex items-center gap-1">
                  Created
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        aria-label="Sort date"
                      >
                        <ChevronDown className="size-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem asChild>
                        <Link href={buildSortHref("created_at", "desc")}>
                          Newest first
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={buildSortHref("created_at", "asc")}>
                          Oldest first
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead className="text-right text-xs font-semibold uppercase tracking-wide">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => {
              const typeLabel = category.type.toLowerCase();
              const typeClasses =
                typeLabel === "income"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                  : typeLabel === "expense"
                    ? "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
                    : "bg-muted text-muted-foreground";

              return (
                <TableRow key={category.id} className="h-16 bg-background/60">
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex min-w-[96px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${typeClasses}`}
                    >
                      {typeLabel}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(category.created_at), "MM/dd/yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <UpdateCategoryModal
                        category={category}
                        modalTrigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <Dialog
                        open={dialogOpenId === category.id}
                        onOpenChange={(value) =>
                          setDialogOpenId(value ? category.id : null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            aria-label="Delete category"
                          >
                            <Trash2 />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-sm">
                          <DialogHeader>
                            <DialogTitle>Delete category</DialogTitle>
                            <DialogDescription>
                              This will permanently remove the category.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setDialogOpenId(null)}
                              disabled={isDeleting}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDelete(category.id)}
                              disabled={isDeleting}
                            >
                              {isDeleting ? "Deleting..." : "Delete"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div className="flex h-[200px] items-center justify-center text-muted-foreground">
          No category added yet.
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            {currentPage > 1 ? (
              <Link
                className="rounded-md border border-border/60 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
                href={`/dashboard/categories?page=${currentPage - 1}`}
              >
                Previous
              </Link>
            ) : (
              <span className="rounded-md border border-border/40 px-3 py-1.5 text-sm font-medium opacity-50">
                Previous
              </span>
            )}
            {currentPage < totalPages ? (
              <Link
                className="rounded-md border border-border/60 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
                href={`/dashboard/categories?page=${currentPage + 1}`}
              >
                Next
              </Link>
            ) : (
              <span className="rounded-md border border-border/40 px-3 py-1.5 text-sm font-medium opacity-50">
                Next
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
