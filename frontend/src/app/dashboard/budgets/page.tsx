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
import { Plus, Trash2 } from "lucide-react";

export default function BudgetsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
              <Button>
                <Plus size={20} />
                New Budget
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Budget</DialogTitle>
                <DialogDescription>
                  Set up a new spending budget
                </DialogDescription>
              </DialogHeader>

              <BudgetForm
                onSuccess={() => {
                  setIsDialogOpen(false);
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
                  title={budget.name}
                  spent={budget.spent || 0}
                  limit={budget.limitAmount}
                  period={budget.period === "monthly" ? "Monthly" : "Yearly"}
                  category={budget.category?.name ?? budget.category}
                />

                <div className="absolute top-4 right-4 flex">
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
