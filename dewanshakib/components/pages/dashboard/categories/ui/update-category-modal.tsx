"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCategoryInput, createCategorySchema } from "@/lib/schema";
import { updateCategoryAction } from "@/app/actions/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ICategoryRow } from "@/interfaces/interfaces";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UpdateCategoryModal({
  category,
  modalTrigger,
}: {
  category: ICategoryRow;
  modalTrigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    mode: "onChange",
    defaultValues: {
      name: category.name,
      type: category.type as "income" | "expense",
    },
  });

  const isBusy = isSubmitting;

  async function onSubmit(data: CreateCategoryInput) {
    const formData = new FormData();
    formData.set("id", category.id);
    formData.set("name", data.name);
    formData.set("type", data.type);

    const result = await updateCategoryAction(formData);

    if (result.status === "success") {
      toast.success(result.message ?? "Category updated");
      setOpen(false);
      return;
    }

    toast.error(result.message ?? "Server Error");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{modalTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Update Category</DialogTitle>
            <DialogDescription>Update your category details.</DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g. Salary, Food, Rent"
                {...register("name")}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <span className="text-xs text-destructive">
                  {errors.name.message}
                </span>
              )}
            </Field>

            <Field>
              <Label htmlFor="type">Type</Label>
              <Select
                defaultValue={category.type}
                onValueChange={(value) => {
                  setValue("type", value as "income" | "expense", {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  void trigger("type");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <span className="text-xs text-destructive">
                  {errors.type.message}
                </span>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isBusy}>
              {isBusy ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
