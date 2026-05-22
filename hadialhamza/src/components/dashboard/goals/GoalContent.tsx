"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Target, Calendar, Trash2, Edit3, Heart, Car, Home, ShoppingBag, Plane, Gift } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/currency";
import { Skeleton } from "@/components/ui/Skeleton";
import { customToast } from "@/components/ui/customToast";
import { cn } from "@/lib/utils";
import AddGoalModal from "./AddGoalModal";
import UpdateProgressModal from "./UpdateProgressModal";

interface Goal {
  _id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  deadline?: string;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Home: Home,
  Car: Car,
  Travel: Plane,
  Shopping: ShoppingBag,
  Gift: Gift,
  General: Target,
  Health: Heart,
};

export default function GoalContent() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const fetchGoals = useCallback(async () => {
    try {
      const res = await fetch("/api/goals");
      if (res.ok) {
        setGoals(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch goals", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const init = async () => {
      if (isMounted) await fetchGoals();
    };

    init();
    return () => { isMounted = false; };
  }, [fetchGoals]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;

    try {
      const res = await fetch(`/api/goals/${id}`, { method: "DELETE" });
      if (res.ok) {
        customToast.success("Success", "Goal deleted successfully");
        fetchGoals();
      }
    } catch {
      customToast.error("Error", "Could not delete goal");
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">
            Savings Goals
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Dream big, save smart. Track your future milestones.
          </p>
        </div>

        <Button 
          variant="primary" 
          className="shadow-xl shadow-primary/20"
          icon={<Plus className="w-5 h-5" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add New Goal
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-3xl" />
          ))}
        </div>
      ) : goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {goals.map((goal, index) => {
              const percent = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
              const Icon = CATEGORY_ICONS[goal.category] || Target;
              
              return (
                <motion.div
                  key={goal._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border p-6 rounded-3xl shadow-sm group hover:border-primary/50 transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className={cn(
                        "p-3 rounded-2xl",
                        percent === 100 ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"
                      )}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setEditingGoal(goal)}
                          className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(goal._id)}
                          className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 mb-6">
                      <h3 className="text-xl font-black text-foreground">{goal.title}</h3>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{goal.category}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Saved</p>
                          <p className="text-lg font-black text-foreground">{formatCurrency(goal.currentAmount)}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Target</p>
                          <p className="text-sm font-bold text-muted-foreground">{formatCurrency(goal.targetAmount)}</p>
                        </div>
                      </div>

                      <div className="h-3 w-full bg-muted rounded-full overflow-hidden p-0.5 border border-border">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className={cn(
                            "h-full rounded-full",
                            percent === 100 ? "bg-emerald-500" : "bg-primary"
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className={percent === 100 ? "text-emerald-500" : "text-primary"}>
                          {percent.toFixed(0)}% Achieved
                        </span>
                        {goal.deadline && (
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(goal.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none">
                    <Icon className="w-32 h-32 rotate-12" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-card border border-dashed border-border rounded-3xl">
          <div className="p-4 bg-primary/10 text-primary rounded-2xl mb-4">
            <Target className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-foreground mb-2">No Savings Goals Yet</h3>
          <p className="text-muted-foreground mb-8 text-center max-w-sm">
            Set your first savings goal and start your journey towards financial freedom.
          </p>
          <Button 
            variant="outline" 
            onClick={() => setIsAddModalOpen(true)}
            className="border-2"
          >
            Create Your First Goal
          </Button>
        </div>
      )}

      <AddGoalModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={fetchGoals} 
      />

      <UpdateProgressModal 
        goal={editingGoal} 
        onClose={() => setEditingGoal(null)} 
        onSuccess={fetchGoals} 
      />
    </div>
  );
}
