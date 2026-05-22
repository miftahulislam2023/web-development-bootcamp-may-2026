"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import InputGroup from "@/components/ui/InputGroup";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { customToast } from "@/components/ui/customToast";
import { Loader2, Plus, Type } from "lucide-react";
import { cn } from "@/lib/utils";

const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  type: z.enum(["income", "expense", "both"]),
  color: z.string().min(1, "Color is required"),
  icon: z.string().min(1, "Icon is required"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const COLORS = [
  { name: "Emerald", class: "text-emerald-500", bg: "bg-emerald-500/10" },
  { name: "Blue", class: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Rose", class: "text-rose-500", bg: "bg-rose-500/10" },
  { name: "Amber", class: "text-amber-500", bg: "bg-amber-500/10" },
  { name: "Purple", class: "text-purple-500", bg: "bg-purple-500/10" },
  { name: "Indigo", class: "text-indigo-500", bg: "bg-indigo-500/10" },
  { name: "Pink", class: "text-pink-500", bg: "bg-pink-500/10" },
  { name: "Slate", class: "text-slate-500", bg: "bg-slate-500/10" },
];

const ICONS = ["Tag", "ShoppingCart", "Utensils", "Car", "Zap", "HeartPulse", "Play", "Gift", "Briefcase", "Home"];

export default function AddCategoryModal({ isOpen, onClose, onSuccess }: AddCategoryModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      type: "expense",
      color: "text-primary",
      icon: "Tag",
    },
  });

  const selectedType = watch("type");
  const selectedColor = watch("color");
  const selectedIcon = watch("icon");

  const onSubmit = async (data: CategoryFormValues) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        customToast.success("Category Created", `"${data.name}" is now available for your transactions.`);
        reset();
        onSuccess();
        onClose();
      } else {
        const error = await res.json();
        customToast.error("Failed to create", error.message || "Something went wrong");
      }
    } catch {
      customToast.error("Error", "Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Category"
      description="Personalize your expense tracking with custom categories."
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex p-1 bg-muted rounded-2xl border border-border">
          {(["expense", "income", "both"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setValue("type", type)}
              className={cn(
                "flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300",
                selectedType === type
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          <InputGroup
            label="Category Name"
            placeholder="e.g. Subscriptions, Pet Care"
            icon={<Type className="w-4 h-4" />}
            {...register("name")}
            error={errors.name?.message}
            disabled={isLoading}
          />

          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground ml-1">
              Select Color
            </label>
            <div className="grid grid-cols-4 gap-3">
              {COLORS.map((color) => (
                <button
                  key={color.class}
                  type="button"
                  onClick={() => setValue("color", color.class)}
                  className={cn(
                    "h-10 rounded-xl border-2 transition-all duration-200 flex items-center justify-center",
                    selectedColor === color.class
                      ? "border-primary bg-primary/5"
                      : "border-transparent bg-muted hover:bg-muted/80"
                  )}
                >
                  <div className={cn("w-4 h-4 rounded-full bg-current", color.class)} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground ml-1">
              Select Icon
            </label>
            <div className="grid grid-cols-5 gap-3">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setValue("icon", icon)}
                  className={cn(
                    "h-10 rounded-xl border-2 transition-all duration-200 flex items-center justify-center text-muted-foreground",
                    selectedIcon === icon
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent bg-muted hover:bg-muted/80 hover:text-foreground"
                  )}
                >
                  <CategoryIcon name={icon} className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full h-14 text-base shadow-xl shadow-primary/20"
          icon={isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Category"}
        </Button>
      </form>
    </Modal>
  );
}
