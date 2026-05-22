"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import { X, Save, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import InputGroup from "@/components/ui/InputGroup";
import { customToast } from "@/components/ui/customToast";
import { useEffect } from "react";

const budgetSchema = z.object({
  amount: z.number().min(1, "Budget must be at least 1"),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

interface SetBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentBudget: number;
}

export default function SetBudgetModal({
  isOpen,
  onClose,
  onSuccess,
  currentBudget,
}: SetBudgetModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      amount: currentBudget || 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ amount: currentBudget || 0 });
    }
  }, [isOpen, currentBudget, reset]);

  const onSubmit = async (data: BudgetFormValues) => {
    try {
      const now = new Date();
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: data.amount,
          month: now.getMonth(),
          year: now.getFullYear(),
        }),
      });

      if (res.ok) {
        customToast.success("Success", "Budget updated successfully");
        onSuccess();
        onClose();
      } else {
        throw new Error();
      }
    } catch {
      customToast.error("Error", "Could not update budget");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-foreground">Set Monthly Budget</h3>
                  <p className="text-xs font-medium text-muted-foreground">Define your spending limit for this month</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
              <InputGroup
                label="Budget Amount"
                type="number"
                placeholder="Enter amount (e.g. 5000)"
                error={errors.amount?.message}
                {...register("amount", { valueAsNumber: true })}
                icon={<Wallet className="w-4 h-4" />}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-2 border-border"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 shadow-lg shadow-primary/20"
                  isLoading={isSubmitting}
                  icon={<Save className="w-4 h-4" />}
                >
                  Save Budget
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
