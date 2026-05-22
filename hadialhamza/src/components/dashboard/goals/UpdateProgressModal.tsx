"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import { X, TrendingUp, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import InputGroup from "@/components/ui/InputGroup";
import { customToast } from "@/components/ui/customToast";
import { useEffect } from "react";

const progressSchema = z.object({
  currentAmount: z.number().min(0, "Amount must be at least 0"),
});

type ProgressFormValues = z.infer<typeof progressSchema>;

interface Goal {
  _id: string;
  title: string;
  currentAmount: number;
}

interface UpdateProgressModalProps {
  goal: Goal | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpdateProgressModal({ goal, onClose, onSuccess }: UpdateProgressModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProgressFormValues>({
    resolver: zodResolver(progressSchema),
  });

  useEffect(() => {
    if (goal) {
      reset({ currentAmount: goal.currentAmount });
    }
  }, [goal, reset]);

  const onSubmit = async (data: ProgressFormValues) => {
    if (!goal) return;

    try {
      const res = await fetch(`/api/goals/${goal._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        customToast.success("Success", "Progress updated successfully");
        onSuccess();
        onClose();
      } else {
        throw new Error();
      }
    } catch {
      customToast.error("Error", "Could not update progress");
    }
  };

  return (
    <AnimatePresence>
      {goal && (
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
            className="relative w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-foreground">Update Progress</h3>
                  <p className="text-xs font-medium text-muted-foreground">{goal.title}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
              <InputGroup
                label="Total Saved Amount"
                type="number"
                placeholder="Enter current total"
                error={errors.currentAmount?.message}
                {...register("currentAmount", { valueAsNumber: true })}
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
                  Update
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
