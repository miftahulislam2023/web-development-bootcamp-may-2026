// src/components/forms/BudgetForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { useCreateBudget, useUpdateBudget, useCategories } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BudgetFormProps {
  onSuccess?: () => void;
  initialData?: any;
  budgetId?: string;
}

export default function BudgetForm({
  onSuccess,
  initialData,
  budgetId,
}: BudgetFormProps) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: initialData || {
      category: "",
      limitAmount: "",
      period: "monthly",
      alertThreshold: 80,
    },
  });

  const { data: categoriesData } = useCategories("expense");
  const createMutation = useCreateBudget();
  const updateMutation = useUpdateBudget();

  const onSubmit = async (data: any) => {
    try {
      if (budgetId) {
        await updateMutation.mutateAsync({ id: budgetId, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting budget:", error);
    }
  };

  const categories = categoriesData?.data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{budgetId ? "Edit Budget" : "New Budget"}</CardTitle>
        <CardDescription>
          {budgetId
            ? "Update your budget settings"
            : "Create a new budget to track spending"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="limitAmount">Limit Amount</Label>
              <Input
                type="number"
                placeholder="0.00"
                step="0.01"
                {...register("limitAmount", { required: true })}
              />
            </div>

            <div>
              <Label htmlFor="period">Period</Label>
              <Select defaultValue="monthly">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="alertThreshold">Alert Threshold (%)</Label>
            <Input
              type="number"
              placeholder="80"
              min="0"
              max="100"
              {...register("alertThreshold")}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending
              ? "Saving..."
              : "Save Budget"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
