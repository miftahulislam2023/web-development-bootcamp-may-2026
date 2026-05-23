// src/app/(dashboard)/transactions/page.tsx
"use client";

import { useState } from "react";
import { useTransactions, useDeleteTransaction } from "@/lib/hooks";
import MainLayout from "@/components/layout/MainLayout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import TransactionRow from "@/components/cards/TransactionRow";
import TransactionForm from "@/components/forms/TransactionForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: transactionsData, isLoading } = useTransactions(
    page,
    20,
    filters,
  );

  const deleteMutation = useDeleteTransaction();

  const transactions = transactionsData?.data || [];
  const meta = transactionsData?.meta?.pagination;

  // Show category column only if transactions contain category
  const showCategory = transactions.some(
    (t: any) => Boolean(t.category) || Boolean(t.categoryId),
  );

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Transactions</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage all your financial transactions
            </p>
          </div>

          {/* Add Transaction Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus size={20} className="mr-2" />
                New Transaction
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Transaction</DialogTitle>
                <DialogDescription className="pb-4">
                  Create a new transaction entry
                </DialogDescription>
              </DialogHeader>

              <TransactionForm
                onSuccess={() => {
                  setIsDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Filters</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Type Filter */}
              <div>
                <Label htmlFor="type">Type</Label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  value={filters.type || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      type: e.target.value,
                    })
                  }
                >
                  <option value="">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  type="date"
                  value={filters.startDate || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>

              {/* End Date */}
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  type="date"
                  value={filters.endDate || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading transactions...
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No transactions found
              </div>
            ) : (
              <>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 border-b border-border">
                        {showCategory && (
                          <>
                            <TableHead className="w-12 border-r border-border text-center">
                              #
                            </TableHead>
                            <TableHead className="border-r border-border">
                              Category
                            </TableHead>
                          </>
                        )}

                        <TableHead className="border-r border-border">
                          Date & Type
                        </TableHead>

                        <TableHead className="border-r border-border">
                          Amount
                        </TableHead>

                        <TableHead className="w-16 text-center">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {transactions.map((transaction: any) => (
                        <TableRow
                          key={transaction.id}
                          className="border-b border-border hover:bg-muted/40 transition-colors"
                        >
                          <TransactionRow
                            id={transaction.id}
                            type={transaction.type}
                            amount={transaction.amount}
                            category={
                              transaction.category ?? transaction.categoryId
                            }
                            date={transaction.date}
                            description={
                              transaction.notes ??
                              transaction.description ??
                              transaction.name
                            }
                            showCategory={showCategory}
                          />

                          {/* Delete Button */}
                          <td className="p-4 border-l border-border text-center">
                            <button
                              onClick={() => handleDelete(transaction.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                    <div className="text-sm text-muted-foreground">
                      Page {meta.page} of {meta.totalPages}
                    </div>

                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() =>
                          setPage(Math.min(meta.totalPages, page + 1))
                        }
                        disabled={page === meta.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
