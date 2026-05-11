// src/components/forms/TransactionForm.tsx
"use client";

import { useForm } from "react-hook-form";
import {
  useCreateTransaction,
  useUpdateTransaction,
  useCategories,
} from "@/lib/hooks";
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

interface TransactionFormProps {
  onSuccess?: () => void;
  initialData?: any;
  transactionId?: string;
}

export default function TransactionForm({
  onSuccess,
  initialData,
  transactionId,
}: TransactionFormProps) {
  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: initialData || {
      type: "expense",
      amount: "",
      category: "",
      date: "",
    },
  });

  const { data: categoriesData } = useCategories(watch("type"));
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();

  const onSubmit = async (data: any) => {
    try {
      if (transactionId) {
        await updateMutation.mutateAsync({ id: transactionId, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting transaction:", error);
    }
  };

  const categories = categoriesData?.data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {transactionId ? "Edit Transaction" : "New Transaction"}
        </CardTitle>
        <CardDescription>
          {transactionId
            ? "Update your transaction details"
            : "Add a new income or expense transaction"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select defaultValue={watch("type")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                type="number"
                placeholder="0.00"
                step="0.01"
                {...register("amount", { required: true })}
              />
            </div>
          </div>

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

          <div>
            <Label htmlFor="date">Date</Label>
            <Input type="date" {...register("date", { required: true })} />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              placeholder="Optional description"
              {...register("description")}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending
              ? "Saving..."
              : "Save Transaction"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
