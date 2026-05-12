"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useCategories, useCreateTransaction } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TransactionForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      type: "expense",
      amount: "",
      categoryId: "",
      paymentMethod: "cash",
      date: "",
      notes: "",
    },
  });

  const transactionType = watch("type");
  const { data, isLoading } = useCategories(transactionType);
  const createMutation = useCreateTransaction();

  const onSubmit = async (payload: Record<string, unknown>) => {
    // normalize 'others' selection
    if (payload.categoryId === "others") {
      // @ts-ignore
      delete payload.categoryId;
    }
    await createMutation.mutateAsync(payload);
    onSuccess?.();
  };

  // Safely extract categories from response - handle both array and nested response
  const categories = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.data?.data)
        ? data.data.data
        : [];

  return (
    <Card className="p-0 m-0 border-0 ring-0 shadow-none">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={watch("type")}
                onValueChange={(value) => setValue("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                step="0.01"
                {...register("amount", { required: "Amount is required" })}
              />
              {errors.amount ? (
                <p className="text-xs text-red-500">
                  {String(errors.amount.message)}
                </p>
              ) : null}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select onValueChange={(value) => setValue("categoryId", value)}>
              <SelectTrigger>
                <SelectValue
                  placeholder={isLoading ? "Loading..." : "Select category"}
                />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <div className="px-2 py-1 text-sm text-muted-foreground">
                    Loading categories...
                  </div>
                ) : categories && categories.length > 0 ? (
                  categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                ) : null}
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
            <input
              type="hidden"
              {...register("categoryId", {
                required: "Please select a category",
              })}
            />
            <p className="text-xs text-muted-foreground">
              Pick a category for this transaction. Choose "Others" if none
              match.
            </p>
            {errors.categoryId ? (
              <p className="text-xs text-red-500">
                {String(errors.categoryId.message)}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select
              value={watch("paymentMethod")}
              onValueChange={(value) => setValue("paymentMethod", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              {...register("date", { required: "Date is required" })}
            />
            {errors.date ? (
              <p className="text-xs text-red-500">
                {String(errors.date.message)}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input placeholder="Optional description" {...register("notes")} />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Transaction"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
