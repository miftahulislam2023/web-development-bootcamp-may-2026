"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import { X, Target, Save, Home, Car, Plane, ShoppingBag, Gift, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import InputGroup from "@/components/ui/InputGroup";
import SelectGroup from "@/components/ui/SelectGroup";
import { customToast } from "@/components/ui/customToast";

const goalSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  targetAmount: z.number().min(1, "Target must be at least 1"),
  currentAmount: z.number().min(0),
  category: z.string().min(1, "Please select a category"),
  deadline: z.string().optional(),
});

type GoalFormValues = z.infer<typeof goalSchema>;

const CATEGORY_OPTIONS = [
  { label: "Home", value: "Home", icon: <Home className="w-4 h-4" /> },
  { label: "Car", value: "Car", icon: <Car className="w-4 h-4" /> },
  { label: "Travel", value: "Travel", icon: <Plane className="w-4 h-4" /> },
  { label: "Shopping", value: "Shopping", icon: <ShoppingBag className="w-4 h-4" /> },
  { label: "Gift", value: "Gift", icon: <Gift className="w-4 h-4" /> },
  { label: "Health", value: "Health", icon: <Heart className="w-4 h-4" /> },
  { label: "General", value: "General", icon: <Target className="w-4 h-4" /> },
];

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddGoalModal({ isOpen, onClose, onSuccess }: AddGoalModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: "",
      targetAmount: 0,
      currentAmount: 0,
      category: "General",
      deadline: "",
    },
  });

  const selectedCategory = watch("category");

  const onSubmit = async (data: GoalFormValues) => {
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        customToast.success("Success", "Goal created successfully");
        reset();
        onSuccess();
        onClose();
      } else {
        throw new Error();
      }
    } catch {
      customToast.error("Error", "Could not create goal");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-foreground tracking-tight">New Savings Goal</h3>
                  <p className="text-xs font-medium text-muted-foreground">What are you dreaming of today?</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
              <InputGroup
                label="Goal Title"
                placeholder="e.g. New Electric Guitar"
                error={errors.title?.message}
                {...register("title")}
              />

              <div className="grid grid-cols-2 gap-4">
                <InputGroup
                  label="Target Amount"
                  type="number"
                  placeholder="5000"
                  error={errors.targetAmount?.message}
                  {...register("targetAmount", { valueAsNumber: true })}
                />
                <InputGroup
                  label="Initial Amount"
                  type="number"
                  placeholder="0"
                  error={errors.currentAmount?.message}
                  {...register("currentAmount", { valueAsNumber: true })}
                />
              </div>

              <div className="w-full">
                <SelectGroup
                  label="Category"
                  value={selectedCategory}
                  onChange={(val) => setValue("category", val as string)}
                  options={CATEGORY_OPTIONS}
                  error={errors.category?.message}
                />
              </div>

              <InputGroup
                label="Deadline (Optional)"
                type="date"
                error={errors.deadline?.message}
                {...register("deadline")}
              />

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1 border-2" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="flex-1 shadow-lg shadow-primary/20"
                  isLoading={isSubmitting}
                  icon={<Save className="w-4 h-4" />}
                >
                  Create Goal
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
