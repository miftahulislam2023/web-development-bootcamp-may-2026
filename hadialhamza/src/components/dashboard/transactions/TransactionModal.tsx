"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import InputGroup from "@/components/ui/InputGroup";
import SelectGroup from "@/components/ui/SelectGroup";
import { customToast } from "@/components/ui/customToast";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { Loader2, Plus, Tag, AlignLeft, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Category, Transaction } from "@/types/dashboard";

const transactionSchema = z.object({
  name: z.string().min(1, "Description is required"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) !== 0, "Invalid amount"),
  categoryId: z.string().min(1, "Please select a category"),
  type: z.enum(["income", "expense"]),
  date: z.string(),
  note: z.string().max(200).optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onOpenAddCategory?: () => void;
  initialData?: Transaction | null;
}

export default function TransactionModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  onOpenAddCategory,
  initialData
}: TransactionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetchingCategories, setFetchingCategories] = useState(false);

  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      date: new Date().toISOString().split("T")[0],
      categoryId: "",
    },
  });

  const selectedType = watch("type");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name,
          amount: initialData.amount.toString(),
          categoryId: initialData.categoryId._id || initialData.categoryId as unknown as string,
          type: initialData.type,
          date: new Date(initialData.date).toISOString().split("T")[0],
          note: initialData.note || "",
        });
      } else {
        reset({
          type: "expense",
          date: new Date().toISOString().split("T")[0],
          categoryId: "",
          name: "",
          amount: "",
          note: "",
        });
      }
    }
  }, [isOpen, initialData, reset]);

  useEffect(() => {
    let isMounted = true;
    if (isOpen) {
      const loadCategories = async () => {
        setFetchingCategories(true);
        try {
          const res = await fetch("/api/categories");
          if (res.ok && isMounted) {
            const data = await res.json();
            setCategories(data);
          }
        } catch {
          console.error("Failed to fetch categories");
        } finally {
          if (isMounted) setFetchingCategories(false);
        }
      };
      loadCategories();
    }
    return () => { isMounted = false; };
  }, [isOpen]);

  const onSubmit = async (data: TransactionFormValues) => {
    setIsLoading(true);
    try {
      const url = isEditing ? `/api/transactions/${initialData?._id}` : "/api/transactions";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          amount: Number(data.amount),
        }),
      });

      if (res.ok) {
        customToast.success(
          isEditing ? "Transaction Updated" : "Transaction Added", 
          isEditing ? "Your changes have been saved." : "Your financial activity has been recorded."
        );
        onSuccess();
        onClose();
      } else {
        const error = await res.json();
        customToast.error("Error", error.message || "Something went wrong");
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
      title={isEditing ? "Edit Transaction" : "Add Transaction"}
      description={isEditing ? "Modify the details of your recorded activity." : "Record a new income or expense to keep your dashboard up to date."}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Type Toggle */}
        <div className="flex p-1 bg-muted rounded-2xl border border-border">
          <button
            type="button"
            onClick={() => {
              setValue("type", "expense");
              setValue("categoryId", ""); 
            }}
            className={cn(
              "flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300",
              selectedType === "expense"
                ? "bg-card text-rose-500 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => {
              setValue("type", "income");
              setValue("categoryId", "");
            }}
            className={cn(
              "flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300",
              selectedType === "income"
                ? "bg-card text-emerald-500 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Income
          </button>
        </div>

        <div className="space-y-4">
          <InputGroup
            label="Amount (BDT)"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("amount")}
            error={errors.amount?.message}
            disabled={isLoading}
          />

          <InputGroup
            label="Description"
            placeholder="e.g. Grocery Shopping, Monthly Salary"
            {...register("name")}
            error={errors.name?.message}
            disabled={isLoading}
          />

          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <SelectGroup
                label="Category"
                placeholder="Select a category"
                value={field.value}
                onChange={field.onChange}
                options={categories
                  .filter((c) => c.type === selectedType || c.type === "both")
                  .map((c) => ({
                    label: c.name,
                    value: c._id,
                    icon: <CategoryIcon name={c.icon} className={cn("w-4 h-4", c.color)} />,
                  }))}
                error={errors.categoryId?.message}
                disabled={isLoading || fetchingCategories}
                icon={<Tag className="w-4 h-4" />}
                className="rounded-2xl"
              />
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <InputGroup
              label="Date"
              type="date"
              {...register("date")}
              error={errors.date?.message}
              disabled={isLoading}
            />
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground ml-1 text-transparent select-none">
                Actions
              </label>
              <Button
                type="button"
                variant="ghost"
                className="w-full h-12 border-2 border-dashed border-border hover:bg-muted/50 text-xs font-black uppercase tracking-widest rounded-xl"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => {
                  if (onOpenAddCategory) {
                    onOpenAddCategory();
                  } else {
                    customToast.info("Info", "Please close this modal and open category settings.");
                  }
                }}
              >
                New Cat
              </Button>
            </div>
          </div>

          <InputGroup
            label="Note (Optional)"
            placeholder="Add a small note..."
            icon={<AlignLeft className="w-4 h-4" />}
            {...register("note")}
            error={errors.note?.message}
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full h-14 text-base shadow-xl shadow-primary/20"
          icon={isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : isEditing ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          disabled={isLoading}
        >
          {isLoading ? (isEditing ? "Updating..." : "Recording...") : (isEditing ? "Update Transaction" : "Record Transaction")}
        </Button>
      </form>
    </Modal>
  );
}
