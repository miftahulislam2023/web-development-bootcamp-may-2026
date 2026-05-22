import { motion } from "framer-motion";
import { Circle, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: string;
}

interface TaskListProps {
  tasks: Task[];
  onToggle?: (id: string) => void;
}

const priorityColors = {
  low: "text-muted-foreground",
  medium: "text-warning",
  high: "text-destructive",
};

export function TaskList({ tasks, onToggle }: TaskListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Due Today</h3>
        <span className="text-xs text-muted-foreground">
          {tasks.filter((t) => t.status === "done").length}/{tasks.length}{" "}
          complete
        </span>
      </div>
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No tasks due today! 🎉
          </p>
        ) : (
          tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-secondary/50 ${task.status === "done" ? "opacity-60" : ""
                }`}
            >
              <span className="text-xs text-muted-foreground font-mono w-5 shrink-0">{index + 1}.</span>
              <button
                onClick={() => onToggle?.(task.id)}
                className="shrink-0"
              >
                {task.status === "done" ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium truncate ${task.status === "done" ? "line-through text-muted-foreground" : ""
                    }`}
                >
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {task.description}
                  </p>
                )}
                {task.dueDate && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {task.dueDate}
                  </p>
                )}
              </div>
              <div className={priorityColors[task.priority]}>
                {task.priority === "high" && (
                  <AlertTriangle className="w-4 h-4" />
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
