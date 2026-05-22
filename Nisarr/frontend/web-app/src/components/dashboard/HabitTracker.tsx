import { motion } from "framer-motion";
import { Flame, Check, X } from "lucide-react";

interface Habit {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
}

interface HabitTrackerProps {
  habits: Habit[];
  onToggle?: (id: string) => void;
}

export function HabitTracker({ habits, onToggle }: HabitTrackerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Today's Habits</h3>
        <span className="text-xs text-muted-foreground">
          {habits.filter((h) => h.completedToday).length}/{habits.length} done
        </span>
      </div>
      <div className="space-y-3">
        {habits.map((habit, index) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="flex items-center gap-3"
          >
            <button
              onClick={() => onToggle?.(habit.id)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                habit.completedToday
                  ? "bg-success text-success-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              {habit.completedToday ? (
                <Check className="w-4 h-4" />
              ) : (
                <X className="w-4 h-4" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p
                className={`font-medium truncate ${
                  habit.completedToday ? "text-muted-foreground line-through" : ""
                }`}
              >
                {habit.name}
              </p>
            </div>
            <div className="flex items-center gap-1 text-warning">
              <Flame className="w-4 h-4" />
              <span className="text-sm font-medium">{habit.streak}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
