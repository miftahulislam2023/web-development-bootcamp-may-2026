// src/app/(dashboard)/budgets/page.tsx
"use client";

import { useState } from "react";
import { useBudgets, useDeleteBudget } from "@/lib/hooks";
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
import BudgetCard from "@/components/cards/BudgetCard";
import BudgetForm from "@/components/forms/BudgetForm";
import { Plus, Trash2, Edit2 } from "lucide-react";

export default function BudgetsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: budgetsData, isLoading } = useBudgets();
  const deleteMutation = useDeleteBudget();

  const budgets = budgetsData?.data || [];

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this budget?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Budgets</h1>
            <p className="text-muted-foreground">
              Manage your spending budgets
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingId(null)}>
                <Plus size={20} />
                New Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit Budget" : "Create Budget"}
                </DialogTitle>
                <DialogDescription>
                  {editingId
                    ? "Update your budget settings"
                    : "Set up a new spending budget"}
                </DialogDescription>
              </DialogHeader>
              <BudgetForm
                budgetId={editingId || undefined}
                onSuccess={() => {
                  setIsDialogOpen(false);
                  setEditingId(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Budgets Grid */}
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading budgets...
          </div>
        ) : budgets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No budgets created yet. Create one to start tracking!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget: any) => (
              <div key={budget.id} className="relative">
                <BudgetCard
                  title={budget.category}
                  spent={budget.spent || 0}
                  limit={budget.limitAmount}
                  period={budget.period === "monthly" ? "Monthly" : "Yearly"}
                />
                <div className="absolute top-4 right-4 space-x-2 flex">
                  <button
                    onClick={() => {
                      setEditingId(budget.id);
                      setIsDialogOpen(true);
                    }}
                    className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-80 transition"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:opacity-80 transition"
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
