"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ChevronDown, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { deleteTransactionAction } from "@/app/actions/transactions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { ITransactionsTableProps } from "@/interfaces/interfaces";

export default function TransactionsTable({
  transactions,
  limit,
}: ITransactionsTableProps) {
  const [dialogOpenId, setDialogOpenId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    const formData = new FormData();
    formData.set("id", id);
    const result = await deleteTransactionAction(formData);
    setIsDeleting(false);

    if (result.status === "success") {
      toast.success(result.message ?? "Transaction deleted");
      setDialogOpenId(null);
      return;
    }

    toast.error(result.message ?? "Server Error");
  };

  const buildSortHref = (field: string, direction: "asc" | "desc") => {
    return `/dashboard/transactions?page=1&limit=${limit}&orderBy=${field}&orderDir=${direction}`;
  };

  return (
    <Table className="min-w-[720px] rounded-2xl border border-border/60 bg-card/80 shadow-sm">
      <TableHeader>
        <TableRow className="">
          <TableHead className="text-xs font-semibold uppercase tracking-wide">
            <div className="flex items-center gap-1">
              Category
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6"
                    aria-label="Sort category"
                  >
                    <ChevronDown className="size-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem asChild>
                    <Link href={buildSortHref("category", "asc")}>
                      Sort A-Z
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={buildSortHref("category", "desc")}>
                      Sort Z-A
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wide">
            Description
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wide">
            <div className="flex items-center gap-1">
              Date
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
                    <Link href={buildSortHref("date", "asc")}>
                      Oldest first
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={buildSortHref("date", "desc")}>
                      Newest first
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
                    <Link href={buildSortHref("type", "desc")}>
                      Income first
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={buildSortHref("type", "asc")}>
                      Expense first
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wide">
            <div className="flex items-center gap-1">
              Amount
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6"
                    aria-label="Sort amount"
                  >
                    <ChevronDown className="size-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem asChild>
                    <Link href={buildSortHref("amount", "asc")}>
                      Lowest first
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={buildSortHref("amount", "desc")}>
                      Highest first
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
        {transactions.map((transaction) => {
          const typeLabel = transaction.type.toLowerCase();
          const typeClasses =
            typeLabel === "income"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
              : typeLabel === "expense"
                ? "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
                : "bg-muted text-muted-foreground";

          return (
            <TableRow key={transaction.id} className="h-16 bg-background/60">
              <TableCell className="font-medium">
                {transaction.category_name}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {transaction.description ?? "-"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(transaction.created_at), "MM/dd/yyyy")}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex min-w-[96px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${typeClasses}`}
                >
                  {typeLabel}
                </span>
              </TableCell>
              <TableCell>
                <span className="inline-flex min-w-[120px] items-center justify-center rounded-md bg-muted px-4 py-1 font-semibold tabular-nums">
                  ${transaction.amount.toFixed(2)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Dialog
                  open={dialogOpenId === transaction.id}
                  onOpenChange={(value) =>
                    setDialogOpenId(value ? transaction.id : null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      aria-label="Delete transaction"
                    >
                      <Trash2 />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Delete transaction</DialogTitle>
                      <DialogDescription>
                        This will permanently remove the transaction.
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
                        onClick={() => handleDelete(transaction.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
