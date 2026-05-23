"use client";

import { useForm } from "react-hook-form";
import MainLayout from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  useCategories,
  useCreateCategory,
  useDeleteCategory,
} from "@/lib/hooks";
import { Trash2, Tag } from "lucide-react";

export default function CategoriesPage() {
  const { data, isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const deleteMutation = useDeleteCategory();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      type: "expense",
    },
  });

  // Safely extract categories
  const categories = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.data?.data)
        ? data.data.data
        : [];

  const onSubmit = async (payload: Record<string, unknown>) => {
    await createMutation.mutateAsync(payload);
    reset();
  };

  return (
    <MainLayout>
      <div className="space-y-8 p-4 sm:p-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Categories
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Create and manage your income, expense, and transfer categories.
          </p>
        </div>

        {/* Create Category */}
        <Card className="shadow-sm border-0 bg-card">
          <CardHeader className="pb-4">
            <CardTitle>Create New Category</CardTitle>
            <CardDescription>
              Add a category to organize your transactions.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
            >
              {/* Category Name */}
              <div className="space-y-2">
                <Label>Category Name</Label>
                <Input
                  placeholder="e.g. Food, Salary, Shopping"
                  {...register("name", { required: true })}
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label>Category Type</Label>
                <Select
                  value={watch("type")}
                  onValueChange={(value) => setValue("type", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Button */}
              <div className="flex items-end">
                <Button
                  className="w-full md:w-auto"
                  type="submit"
                  disabled={isSubmitting || createMutation.isPending}
                >
                  {isSubmitting || createMutation.isPending
                    ? "Saving..."
                    : "Save Category"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Existing Categories */}
        <Card className="shadow-sm border-0">
          <CardHeader>
            <CardTitle>Existing Categories</CardTitle>
            <CardDescription>
              View and manage all your created categories.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="text-sm text-muted-foreground">
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Tag className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="font-medium">No categories found</h3>
                <p className="text-sm text-muted-foreground">
                  Create your first category to get started.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {categories.map(
                  (category: { id: string; name: string; type: string }) => (
                    <div
                      key={category.id}
                      className="rounded-2xl border bg-background p-5 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-base">
                            {category.name}
                          </h3>

                          <span className="inline-flex mt-2 rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize text-muted-foreground">
                            {category.type}
                          </span>
                        </div>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteMutation.mutate(category.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
