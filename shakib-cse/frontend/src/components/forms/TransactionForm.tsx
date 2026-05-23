"use client";

import { useForm } from "react-hook-form";
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
      name: "",
      type: "expense",
      amount: "",
      categoryId: "",
      paymentMethod: "cash",
      date: "",
      notes: "",
    },
  });

  // Always fetch all categories for the transaction form so user can pick any
  // category regardless of selected transaction type.
  const { data, isLoading } = useCategories();
  const createMutation = useCreateTransaction();

  let apiError: string | null = null;
  if (createMutation.error) {
    const errorData = createMutation.error as unknown as {
      response?: { data?: { error?: { message?: string } } };
    };
    apiError =
      errorData?.response?.data?.error?.message ||
      "Failed to create transaction";
  }

  const onSubmit = async (payload: Record<string, unknown>) => {
    // normalize 'others' selection
    if (payload.categoryId === "others") {
      delete payload.categoryId;
    }

    // Convert date to ISO datetime format
    if (payload.date && typeof payload.date === "string") {
      // date input gives us YYYY-MM-DD, convert to ISO datetime at midnight
      payload.date = new Date(payload.date + "T00:00:00Z").toISOString();
    }

    // Debug log
    console.log("Transaction payload:", payload);

    try {
      await createMutation.mutateAsync(payload);
      onSuccess?.();
    } catch (error) {
      console.error("Transaction creation error:", error);
    }
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
    <Card className="p-2 ring-0 m-0 shadow-none">
      <CardContent>
        {apiError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            {apiError}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Transaction Name</Label>
            <Input
              placeholder="e.g., Grocery Shopping, Salary Deposit"
              {...register("name")}
            />
          </div>
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
                placeholder="0.00"
                {...register("amount", {
                  required: "Amount is required",
                  valueAsNumber: true,
                })}
              />
              {errors.amount ? (
                <p className="text-xs text-red-500">
                  {String(errors.amount.message)}
                </p>
              ) : null}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select
              value={watch("categoryId")}
              onValueChange={(value) => setValue("categoryId", value)}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoading ? "Loading categories..." : "Select a category"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <div className="px-2 py-1 text-sm text-muted-foreground">
                    Loading categories...
                  </div>
                ) : categories && categories.length > 0 ? (
                  categories.map((category: Record<string, unknown>) => (
                    <SelectItem
                      key={String(category.id)}
                      value={String(category.id)}
                    >
                      {String(category.name)}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-1 text-sm text-muted-foreground">
                    No categories found
                  </div>
                )}
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
            <input
              type="hidden"
              {...register("categoryId", {
                required: "Please select a category",
              })}
            />
            {errors.categoryId ? (
              <p className="text-xs text-red-500">
                {String(errors.categoryId.message)}
              </p>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-4">
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
              <Label>Date *</Label>
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
          </div>
          <div className="space-y-2">
            <Label>Notes / Description</Label>
            <Input
              placeholder="Add any additional details"
              {...register("notes")}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Transaction"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
