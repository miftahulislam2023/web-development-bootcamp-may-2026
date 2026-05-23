"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
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

// stable defaults
const DEFAULT_START = new Date().toISOString().slice(0, 10);
const DEFAULT_END = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10);

export default function BudgetForm({ onSuccess }: { onSuccess?: () => void }) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
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

  const { data, isLoading } = useCategories();
  const createMutation = useCreateBudget();

  const onSubmit = async (payload: Record<string, unknown>) => {
    const normalized: Record<string, unknown> = { ...payload };

    if (typeof normalized.limitAmount === "string" && normalized.limitAmount) {
      normalized.limitAmount = Number(normalized.limitAmount);
    }

    if (normalized.categoryId === "others") {
      delete normalized.categoryId;
    }

    await createMutation.mutateAsync(normalized);
    onSuccess?.();
  };

  // safer category parsing
  const categories = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.data?.data)
        ? data.data.data
        : [];

  const period = useWatch({
    control,
    name: "period",
  });

  return (
    <Card className="p-2 ring-0 m-0 shadow-none">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* NAME */}
          <div className="space-y-2">
            <Label>Name</Label>
            <Input {...register("name", { required: true })} />
          </div>

          {/* CATEGORY */}
          <div className="space-y-2">
            <Label>Category</Label>

            <Controller
              name="categoryId"
              control={control}
              rules={{ required: "Please select a category" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full z-50">
                    <SelectValue
                      placeholder={isLoading ? "Loading..." : "Select category"}
                    />
                  </SelectTrigger>

                  <SelectContent className="z-50">
                    {isLoading ? (
                      <div className="px-2 py-2 text-sm text-muted-foreground">
                        Loading categories...
                      </div>
                    ) : categories.length > 0 ? (
                      categories.map(
                        (category: { id: string; name: string }) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ),
                      )
                    ) : null}

                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            {errors.categoryId && (
              <p className="text-xs text-red-500">
                {String(errors.categoryId.message)}
              </p>
            )}
          </div>

          {/* AMOUNT + PERIOD */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Limit Amount</Label>
              <Input
                type="number"
                step="0.01"
                {...register("limitAmount", {
                  required: "Limit amount is required",
                  min: { value: 0.01, message: "Must be greater than 0" },
                })}
              />
              {errors.limitAmount && (
                <p className="text-xs text-red-500">
                  {String(errors.limitAmount.message)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Period</Label>
              <Select
                value={period}
                onValueChange={(value) => setValue("period", value)}
              >
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

          {/* DATES */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                {...register("startDate", {
                  required: "Start date is required",
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                {...register("endDate", {
                  required: "End date is required",
                })}
              />
            </div>
          </div>

          {/* ALERT */}
          <div className="space-y-2">
            <Label>Alert Threshold (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              {...register("alertThreshold")}
            />
          </div>

          {/* SUBMIT */}
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
