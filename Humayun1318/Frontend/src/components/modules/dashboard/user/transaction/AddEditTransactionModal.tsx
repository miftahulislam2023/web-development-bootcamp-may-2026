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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useGetAllCategoriesQuery } from "@/redux/features/category/category.api";
import {
  ICategory,
  ITransaction,
  PAYMENT_METHOD,
  TRANSACTION_TYPE,
} from "@/types";
import {
  useAddTransactionMutation,
  useUpdateTransactionMutation,
} from "@/redux/features/transactions/transactions.api";
import { useAddRecurringTransactionMutation } from "@/redux/features/recurring/recurring.api";
import { RecurringForm } from "../recurring/RecurringForm";
import {
  TransactionFormValues,
  transactionSchemaRefined,
} from "@/utils/transaction.schema";

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddEditTransactionModalProps {
  open: boolean;
  onClose: () => void;
  editData?: ITransaction | null;
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

export function AddEditTransactionModal({
  open,
  onClose,
  editData,
}: AddEditTransactionModalProps) {
  const isEditMode = !!editData;

  const [createTransaction, { isLoading: isCreating }] =
    useAddTransactionMutation();
  const [updateTransaction, { isLoading: isUpdating }] =
    useUpdateTransactionMutation();
  const [createRecurrence, { isLoading: isCreatingRecurrence }] =
    useAddRecurringTransactionMutation();

  const isLoading = isCreating || isUpdating || isCreatingRecurrence;

  // Fetch categories for dropdown
  const { data: categoriesData } = useGetAllCategoriesQuery({
    page: 1,
    limit: 100,
  });
  const categories: ICategory[] = Array.isArray(categoriesData?.data)
    ? categoriesData.data
    : [];

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchemaRefined),
    defaultValues: {
      categoryId: "",
      type: undefined,
      amount: undefined,
      description: "",
      paymentMethod: PAYMENT_METHOD.CASH,
      tags: "",
      date: toDateInput(new Date().toISOString()),
      referenceNote: "",
      isRecurring: false,
      recurring: {
        frequency: undefined,
        interval: 1,
        nextDueDate: "",
        endDate: "",
      },
    },
  });

  const isRecurring = form.watch("isRecurring");
  const selectedType = form.watch("type");

  // Populate form on edit / reset on add
  useEffect(() => {
    if (open) {
      if (editData) {
        console.log("Editing transaction:", editData);
        form.reset({
          categoryId: editData.categoryId,
          type: editData.type,
          amount: editData.amount,
          description: editData.description ?? "",
          paymentMethod: editData.paymentMethod ?? "",
          tags: editData.tags?.join(", ") ?? "",
          date: toDateInput(editData.date),
          referenceNote: editData.referenceNote ?? "",
          isRecurring: editData.isRecurring ?? false,
          recurring: {
            frequency: undefined,
            interval: 1,
            nextDueDate: "",
            endDate: "",
          },
        });
      } else {
        form.reset({
          categoryId: "",
          type: undefined,
          amount: undefined,
          description: "",
          paymentMethod: PAYMENT_METHOD.CASH,
          tags: "",
          date: toDateInput(new Date().toISOString()),
          referenceNote: "",
          isRecurring: false,
          recurring: {
            frequency: undefined,
            interval: 1,
            nextDueDate: "",
            endDate: "",
          },
        });
      }
    }
  }, [editData, open, form]);

  // ── Submit ──────────────────────────────────────────────────────────────────

  const onSubmit = async (values: TransactionFormValues) => {
    console.log("Form values:", values);
    const toastId = toast.loading(
      isEditMode ? "Updating transaction..." : "Adding transaction...",
    );

    const transactionPayload = {
      categoryId: values.categoryId,
      type: values.type,
      amount: values.amount,
      date: values.date,
      paymentMethod: values.paymentMethod,
      isRecurring: values.isRecurring,
      ...(values.description ? { description: values.description } : {}),
      ...(values.referenceNote ? { referenceNote: values.referenceNote } : {}),
      tags: values.tags
        ? values.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    };

    try {
      if (isEditMode && editData) {
        const res = await updateTransaction({
          transactionId: editData._id,
          transactionData: transactionPayload,
        }).unwrap();

        if (res.success) {
          toast.success("Transaction updated!", { id: toastId });
          onClose();
        } else {
          toast.error("Failed to update transaction.", { id: toastId });
        }
      } else {
        const txRes = await createTransaction(transactionPayload).unwrap();

        if (!txRes.success) {
          toast.error("Failed to create transaction.", { id: toastId });
          return;
        }

        // If recurring, create recurrence
        if (values.isRecurring && values.recurring) {
          const recurringPayload = {
            transactionId: txRes.data?._id,
            categoryId: values.categoryId,
            type: values.type,
            amount: values.amount,
            paymentMethod: values.paymentMethod,
            frequency: values.recurring.frequency!,
            interval: values.recurring.interval ?? 1,
            startDate: values.recurring.nextDueDate,
            ...(values.description ? { description: values.description } : {}),
            ...(values.recurring.endDate
              ? { endDate: values.recurring.endDate }
              : {}),
          };

          await createRecurrence(recurringPayload).unwrap();
        }

        toast.success(
          values.isRecurring
            ? "Transaction & recurrence created!"
            : "Transaction added!",
          { id: toastId },
        );
        onClose();
      }
    } catch (err: any) {
      if (err?.data?.message.trim() === "Zod Error") {
        toast.error("End date must be after start date", {
          id: toastId,
          position: "top-center",
        });
      } else {
        toast.error(err?.data?.message ?? "Something went wrong.", {
          id: toastId,
        });
      }
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
            {isEditMode ? "Edit Transaction" : "Add Transaction"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 py-2"
          >
            {/* 2-Column Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
                        <SelectItem value={TRANSACTION_TYPE.INCOME}>
                          Income
                        </SelectItem>
                        <SelectItem value={TRANSACTION_TYPE.EXPENSE}>
                          Expense
                        </SelectItem>
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
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mb-2">
                      Date <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
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
                    <FormLabel className="mb-2">Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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

              {/* Tags */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mb-2">Tags (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. groceries, urgent" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Reference Note */}
              <FormField
                control={form.control}
                name="referenceNote"
                render={({ field }) => (
                  <FormItem className="flex flex-col md:col-span-2">
                    <FormLabel className="mb-2">
                      Reference Note (optional)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Invoice #, receipt ID…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description - full width */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="mb-2">Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Short description…"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Is Recurring toggle — hidden in edit mode */}
            {!isEditMode && (
              <FormField
                control={form.control}
                name="isRecurring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-md border border-muted p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">
                        Make this a recurring transaction
                      </FormLabel>
                      <FormDescription>
                        Set up automatic repetition on a schedule.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            )}

            {/* Recurring sub-form — shown only when isRecurring = true */}
            {isRecurring && !isEditMode && (
              <RecurringForm
                control={form.control}
                frequencyField="recurring.frequency"
                intervalField="recurring.interval"
                startDateField="recurring.nextDueDate"
                endDateField="recurring.endDate"
              />
            )}

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
                    : isRecurring
                      ? "Saving & Scheduling..."
                      : "Adding..."
                  : isEditMode
                    ? "Update Transaction"
                    : "Add Transaction"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
