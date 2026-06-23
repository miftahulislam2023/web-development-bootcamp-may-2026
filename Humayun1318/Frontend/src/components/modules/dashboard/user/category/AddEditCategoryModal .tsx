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
import {
    useAddCategoryMutation,
  useUpdateCategoryMutation,
} from "@/redux/features/category/category.api";
import { ICategory } from "@/types";


interface AddEditCategoryModalProps {
  open: boolean;
  onClose: () => void;
  editData?: ICategory | null;
}

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const categorySchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50, { message: "Name must be at most 50 characters." }),
  type: z.enum(["income", "expense"], {
    message: "Please select a type.",
  }),
  colorHex: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

// ─── Component ────────────────────────────────────────────────────────────────

export function AddEditCategoryModal({
  open,
  onClose,
  editData,
}: AddEditCategoryModalProps) {
  const isEditMode = !!editData;

  const [createCategory, { isLoading: isCreating }] =
    useAddCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  const isLoading = isCreating || isUpdating;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      type: undefined,
      colorHex: "",
    },
  });

  // Populate form on edit, reset on add
  useEffect(() => {
    if (open) {
      if (editData) {
        form.reset({
          name: editData.name,
          type: editData.type,
          colorHex: editData.colorHex ?? "",
        });
      } else {
        form.reset({
          name: "",
          type: undefined,
          colorHex: "",
        });
      }
    }
  }, [editData, open, form]);


  // ── Submit ──────────────────────────────────────────────────────────────────

  const onSubmit = async (values: CategoryFormValues) => {
    const payload = {
      name: values.name,
      type: values.type,
      ...(values.colorHex ? { colorHex: values.colorHex } : {}),
    };

    console.log(values)

    const toastId = toast.loading(
      isEditMode ? "Updating category..." : "Adding category...", {position: "top-center"}
    );

    try {
      if (isEditMode && editData) {
        const res = await updateCategory({
          categoryId: editData._id,
          categoryData: payload,
        }).unwrap();

        if (res.success) {
          toast.success("Category updated!", { id: toastId, position: "top-center" });
          onClose();
        }
      } else {
        const res = await createCategory(payload).unwrap();

        if (res.success) {
          toast.success("Category added!", { id: toastId, position: "top-center" });
          onClose();
        }
      }
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Something went wrong.", {
        id: toastId,
        position: "top-center"
      });
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Category" : "Add Category"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 py-2"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Food & Drinks" {...field} />
                  </FormControl>
                  <FormDescription className="sr-only">
                    Category display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Type <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="sr-only">
                    Whether this is an income or expense category.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Color (optional) */}
            <FormField
              control={form.control}
              name="colorHex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color (optional)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={field.value || "#6366f1"}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="h-9 w-14 cursor-pointer rounded-md border border-input bg-transparent p-1"
                      />
                      <span className="text-sm text-muted-foreground font-mono">
                        {field.value || "No color selected"}
                      </span>
                      {field.value && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => field.onChange("")}
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription className="sr-only">
                    Optional color for this category.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    : "Adding..."
                  : isEditMode
                  ? "Update Category"
                  : "Add Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}