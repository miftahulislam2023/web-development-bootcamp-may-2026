import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export interface Task {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    status: "todo" | "in-progress" | "done";
    priority: "low" | "medium" | "high" | "urgent";
    due_date?: string;
    created_at: string;
    completed_at?: string;
    context_type?: "general" | "study" | "finance" | "habit" | "project" | "inventory";
    context_id?: string;
    budget_id?: string;
    expected_cost?: number;
    finance_type?: "income" | "expense";
    start_time?: string;
    end_time?: string;
    estimated_duration?: number;
    actual_duration?: number;
    recurrence_rule?: string;
    parent_task_id?: string;
    order_index?: number;
    labels?: string;
    reminder_time?: string;
    is_pinned?: boolean;
}

const ALL_TASK_FIELDS = [
    "title", "description", "status", "priority", "due_date", "completed_at",
    "context_type", "context_id", "budget_id", "expected_cost", "finance_type",
    "start_time", "end_time", "estimated_duration", "actual_duration",
    "recurrence_rule", "parent_task_id", "order_index", "labels",
    "reminder_time", "is_pinned"
];

export function useTasks() {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const userId = user?.id;

    const tasksQuery = useQuery({
        queryKey: ["tasks", userId],
        queryFn: async () => {
            if (!userId) return [];
            return apiFetch("/data/tasks");
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 2, // 2 min — useAppData pre-populates this cache
    });

    const addTask = useMutation({
        mutationFn: async (task: Partial<Omit<Task, "id" | "user_id" | "created_at">>) => {
            if (!userId) throw new Error("Not authenticated");
            const res = await apiFetch("/data/tasks", {
                method: "POST",
                body: JSON.stringify(task)
            });
            return res.id;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });

    const updateTask = useMutation({
        mutationFn: async (task: Partial<Task> & { id: string }) => {
            await apiFetch("/data/tasks", {
                method: "PUT",
                body: JSON.stringify(task)
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["study"] }); // Sync study page
        },
    });

    const deleteTask = useMutation({
        mutationFn: async (id: string) => {
            await apiFetch(`/data/tasks/${id}`, { method: "DELETE" });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });

    const completeTask = useMutation({
        mutationFn: async (id: string) => {
            await apiFetch("/data/tasks/complete", {
                method: "POST",
                body: JSON.stringify({ id })
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["finance"] }); // Also refresh finance data
            queryClient.invalidateQueries({ queryKey: ["budgets"] }); // Also refresh budgets/savings
            queryClient.invalidateQueries({ queryKey: ["study"] }); // Sync study page
        },
    });

    // Get tasks by context (e.g., all tasks linked to a study chapter)
    const getTasksByContext = async (contextType: string, contextId: string) => {
        if (!userId) return [];
        return apiFetch(`/data/tasks/context?type=${contextType}&id=${contextId}`);
    };

    // Get subtasks for a parent task
    const getSubtasks = async (parentTaskId: string) => {
        if (!userId) return [];
        return apiFetch(`/data/tasks/subtasks?parentId=${parentTaskId}`);
    };

    return {
        tasks: tasksQuery.data ?? [],
        isLoading: tasksQuery.isLoading,
        error: tasksQuery.error,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        getTasksByContext,
        getSubtasks,
    };
}

