"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCategoryAction } from "@/app/actions/categories";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateCategoryInput, createCategorySchema } from "@/lib/schema";

export default function CreateCategoryModal() {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    mode: "onChange",
    defaultValues: {
      type: "income",
    },
  });

  const isBusy = isSubmitting;
  // console.log("Type ======================>\n",watch("type"));

  async function onSubmit(data: CreateCategoryInput) {
    const formData = new FormData();
    formData.set("name", data.name);
    formData.set("type", data.type);

    const result = await createCategoryAction(formData);
    // console.log("Categort result ========>\n",result);

    if (result.status === "success") {
      toast.success(result.message ?? "Category created");
      reset();
      setOpen(false);
      return;
    }

    toast.error(result.message ?? "Server Error");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Category</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Create a new category for your transactions.
            </DialogDescription>
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
                defaultValue={watch("type")}
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
              {isBusy ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
