// components/modules/dashboard/user/recurring/AddEditRecurringModal.tsx
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useGetAllCategoriesQuery } from "@/redux/features/category/category.api";
import { ICategory, IRecurrence, PAYMENT_METHOD, RECURRENCE_FREQUENCY, TRANSACTION_TYPE } from "@/types";
import { useAddRecurringTransactionMutation, useUpdateRecurringTransactionMutation } from "@/redux/features/recurring/recurring.api";
import { recurringSchema } from "@/utils/transaction.schema";

type RecurringFormValues = z.infer<typeof recurringSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────
interface AddEditRecurringModalProps {
  open: boolean;
  onClose: () => void;
  editData?: IRecurrence | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const toDateInput = (iso?: string) =>
  iso ? new Date(iso).toISOString().split("T")[0] : "";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  card: "Card",
  bank_transfer: "Bank Transfer",
  mobile_banking: "Mobile Banking",
  other: "Other",
};

// ─── Component ────────────────────────────────────────────────────────────────
export function AddEditRecurringModal({
  open,
  onClose,
  editData,
}: AddEditRecurringModalProps) {
  const isEditMode = !!editData;

  const [createRecurring, { isLoading: isCreating }] = useAddRecurringTransactionMutation();
  const [updateRecurring, { isLoading: isUpdating }] = useUpdateRecurringTransactionMutation();

  const isLoading = isCreating || isUpdating;

  // Fetch categories for dropdown
  const { data: categoriesData } = useGetAllCategoriesQuery({
    page: 1,
    limit: 100,
  });
  const categories: ICategory[] = Array.isArray(categoriesData?.data) ? categoriesData.data : [];

  const form = useForm<RecurringFormValues>({
    resolver: zodResolver(recurringSchema),
    defaultValues: {
      description: "",
      categoryId: "",
      type: undefined,
      amount: undefined,
      paymentMethod: undefined,
      frequency: undefined,
      interval: 1,
      nextDueDate: "",
      endDate: "",
      isActive: true,
    },
  });

  const selectedType = form.watch("type");

  // Populate form on edit / reset on add
  useEffect(() => {
    if (open) {
      if (editData) {
        form.reset({
          description: editData.description ?? "",
          categoryId: editData.categoryId,
          type: editData.type,
          amount: editData.amount,
          paymentMethod: editData.paymentMethod,
          frequency: editData.frequency,
          interval: editData.interval,
          nextDueDate: toDateInput(editData.nextDueDate),
          endDate: editData.endDate ? toDateInput(editData.endDate) : "",
          isActive: editData.isActive,
        });
      } else {
        form.reset({
          description: "",
          categoryId: "",
          type: undefined,
          amount: undefined,
          paymentMethod: undefined,
          frequency: undefined,
          interval: 1,
          nextDueDate: "",
          endDate: "",
          isActive: true,
        });
      }
    }
  }, [editData, open, form]);

  // ── Submit ──────────────────────────────────────────────────────────────────
  const onSubmit = async (values: RecurringFormValues) => {
    const toastId = toast.loading(
      isEditMode ? "Updating recurring transaction..." : "Creating recurring transaction..."
    );

    const payload: any = {
      description: values.description,
      categoryId: values.categoryId,
      type: values.type,
      amount: values.amount,
      frequency: values.frequency,
      interval: values.interval,
      startDate: values.nextDueDate,
      isActive: values.isActive,
      ...(values.paymentMethod ? { paymentMethod: values.paymentMethod } : {}),
      ...(values.endDate ? { endDate: values.endDate } : {}),
    };

    try {
      if (isEditMode && editData) {
        const res = await updateRecurring({
          recurringId: editData._id,
          recurringData: payload,
        }).unwrap();

        if (res.success) {
          toast.success("Recurring transaction updated!", { id: toastId, position: "top-center" });
          onClose();
        } else {
          toast.error("Failed to update recurring transaction.", { id: toastId, position: "top-center" });
        }
      } else {
        const res = await createRecurring(payload).unwrap();

        if (res.success) {
          toast.success("Recurring transaction created!", { id: toastId, position: "top-center" });
          onClose();
        } else {
          toast.error("Failed to create recurring transaction.", { id: toastId, position: "top-center" });
        }
      }
    } catch (err: any) {
      console.error("Submit error:", err);
      toast.error(err?.data?.message ?? "Something went wrong.", {
        id: toastId,
        position: "top-center"
      });
    }
  };

  // Filter categories by selected type
  const filteredCategories = selectedType
    ? categories.filter((c) => c.type === selectedType)
    : categories;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Recurring Transaction" : "Add Recurring Transaction"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-2">
            {/* 2-Column Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Description - Full width */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-col md:col-span-2">
                    <FormLabel className="mb-2">
                      Description <span className="">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Monthly Salary, Netflix Subscription, Rent Payment..."
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mb-2">
                      Type <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        form.setValue("categoryId", "");
                      }}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Income or Expense?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={TRANSACTION_TYPE.INCOME}>Income</SelectItem>
                        <SelectItem value={TRANSACTION_TYPE.EXPENSE}>Expense</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mb-2">
                      Category <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={filteredCategories.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              !selectedType
                                ? "Select type first"
                                : "Select category"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredCategories.map((cat) => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Amount */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mb-2">
                      Amount <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0.01}
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? undefined : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Frequency */}
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mb-2">
                      Frequency <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={RECURRENCE_FREQUENCY.DAILY}>Daily</SelectItem>
                        <SelectItem value={RECURRENCE_FREQUENCY.WEEKLY}>Weekly</SelectItem>
                        <SelectItem value={RECURRENCE_FREQUENCY.MONTHLY}>Monthly</SelectItem>
                        <SelectItem value={RECURRENCE_FREQUENCY.YEARLY}>Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Interval */}
              <FormField
                control={form.control}
                name="interval"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mb-2">Interval</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={365}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Every {field.value || 1} period(s)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Next Due Date */}
              <FormField
                control={form.control}
                name="nextDueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mb-2">
                      Next Due Date <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Date */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mb-2">End Date (optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormDescription>Leave blank to repeat indefinitely</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Method */}
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mb-2">Payment Method <span className="text-destructive">*</span></FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(PAYMENT_METHOD).map(([, value]) => (
                          <SelectItem key={value} value={value}>
                            {PAYMENT_METHOD_LABELS[value]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status - Only in edit mode */}
              {isEditMode && (
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="mb-2">Status</FormLabel>
                      <Select 
                        onValueChange={(val) => field.onChange(val === "true")} 
                        value={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update Recurring Transaction"
                  : "Create Recurring Transaction"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}