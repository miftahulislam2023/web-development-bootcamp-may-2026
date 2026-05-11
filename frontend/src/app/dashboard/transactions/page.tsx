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

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-muted-foreground">
              Manage all your financial transactions
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={20} />
                New Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Transaction</DialogTitle>
                <DialogDescription>
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
              <div>
                <Label htmlFor="type">Type</Label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md"
                  value={filters.type || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, type: e.target.value })
                  }
                >
                  <option value="">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  type="date"
                  value={filters.startDate || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, startDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  type="date"
                  value={filters.endDate || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, endDate: e.target.value })
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Date & Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction: any) => (
                      <TableRow key={transaction.id}>
                        <TransactionRow
                          id={transaction.id}
                          type={transaction.type}
                          amount={transaction.amount}
                          category={transaction.category}
                          date={transaction.date}
                          description={transaction.description}
                        />
                        <td className="p-4">
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="text-red-500 hover:text-red-700"
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

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
