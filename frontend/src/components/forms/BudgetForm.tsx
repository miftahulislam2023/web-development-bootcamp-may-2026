"use client";

import { useForm } from "react-hook-form";
import { useCategories, useCreateBudget } from "@/lib/hooks";
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

// compute stable defaults once at module load to avoid impure calls during render
const DEFAULT_START = new Date().toISOString().slice(0, 10);
const DEFAULT_END = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10);

export default function BudgetForm({ onSuccess }: { onSuccess?: () => void }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      categoryId: "",
      name: "",
      limitAmount: "",
      period: "monthly",
      alertThreshold: 80,
      startDate: DEFAULT_START,
      endDate: DEFAULT_END,
    },
  });
  const { data, isLoading } = useCategories("expense");

  const createMutation = useCreateBudget();

  const onSubmit = async (payload: Record<string, unknown>) => {
    // coerce numeric fields and normalize payload for backend
    const normalized: Record<string, unknown> = { ...payload };
    if (normalized.limitAmount)
      normalized.limitAmount = Number(normalized.limitAmount);
    if (normalized.categoryId === "others") delete normalized.categoryId;
    onSuccess?.();
    await createMutation.mutateAsync(normalized);
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
    <Card>
      <CardHeader>
        <CardTitle>New Budget</CardTitle>
        <CardDescription>Track spending against a limit</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input {...register("name", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select onValueChange={(value) => setValue("categoryId", value)}>
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? "Loading..." : "Select or type category"} />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <div className="px-2 py-1 text-sm text-muted-foreground">Loading categories...</div>
                ) : categories && categories.length > 0 ? (
                  categories.map((category: { id: string; name: string }) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                ) : null}
                {/* Always provide an Others fallback option */}
                <SelectItem value="others">
                  Others
                </SelectItem>
              </SelectContent>
            </Select>
            <input
              type="hidden"
              {...register("categoryId", {
                required: "Please select a category",
              })}
            />
            <p className="text-xs text-muted-foreground">
              Choose a category for this budget. Select &quot;Others&quot; if
              none match.
            </p>
            {errors.categoryId ? (
              <p className="text-xs text-red-500">
                {String(errors.categoryId.message)}
              </p>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Limit Amount</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("limitAmount", {
                  required: "Limit amount is required",
                  min: { value: 0.01, message: "Limit must be greater than 0" },
                })}
              />
              {errors.limitAmount ? (
                <p className="text-xs text-red-500">
                  {String(errors.limitAmount.message)}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label>Period</Label>
              <Select onValueChange={(value) => setValue("period", value)}>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                {...register("startDate", {
                  required: "Start date is required",
                })}
              />
              {errors.startDate ? (
                <p className="text-xs text-red-500">
                  {String(errors.startDate.message)}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                {...register("endDate", { required: "End date is required" })}
              />
              {errors.endDate ? (
                <p className="text-xs text-red-500">
                  {String(errors.endDate.message)}
                </p>
              ) : null}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Alert Threshold (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              {...register("alertThreshold")}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || createMutation.isPending}
          >
            {isSubmitting || createMutation.isPending
              ? "Saving..."
              : "Save Budget"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
