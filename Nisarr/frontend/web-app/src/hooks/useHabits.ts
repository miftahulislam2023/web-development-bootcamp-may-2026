import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export const HABIT_CATEGORIES = [
    { value: "general", label: "General", emoji: "📌" },
    { value: "health", label: "Health", emoji: "💪" },
    { value: "learning", label: "Learning", emoji: "📚" },
    { value: "productivity", label: "Productivity", emoji: "⚡" },
    { value: "mindfulness", label: "Mindfulness", emoji: "🧘" },
    { value: "social", label: "Social", emoji: "👥" },
    { value: "creative", label: "Creative", emoji: "🎨" },
] as const;

export type HabitCategory = typeof HABIT_CATEGORIES[number]["value"];

export interface Habit {
    id: string;
    user_id: string;
    habit_name: string;
    streak_count: number;
    last_completed_date?: string;
    category: HabitCategory;
}

export function useHabits() {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const userId = user?.id;

    const habitsQuery = useQuery({
        queryKey: ["habits", userId],
        queryFn: async () => {
            if (!userId) return [];
            const result = await apiFetch("/data/habits");
            return (result as Habit[]).map(h => ({
                ...h,
                category: h.category || "general",
            }));
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 2,
    });

    const addHabit = useMutation({
        mutationFn: async ({ name, category }: { name: string; category?: HabitCategory }) => {
            if (!userId) throw new Error("Not authenticated");
            const res = await apiFetch("/data/habits", {
                method: "POST",
                body: JSON.stringify({ habit_name: name, category: category || "general", streak_count: 0 })
            });
            return res.id;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
    });

    const updateHabit = useMutation({
        mutationFn: async ({ id, name, category }: { id: string; name?: string; category?: HabitCategory }) => {
            const body: Record<string, any> = { id };
            if (name !== undefined) body.habit_name = name;
            if (category !== undefined) body.category = category;
            if (Object.keys(body).length === 1) return;
            
            await apiFetch("/data/habits", {
                method: "PUT",
                body: JSON.stringify(body),
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
    });

    const completeHabit = useMutation({
        mutationFn: async ({ habit, date }: { habit: Habit; date?: string }) => {
            await apiFetch("/data/habits/complete", {
                method: "POST",
                body: JSON.stringify({ habit, date }),
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
    });

    const deleteHabit = useMutation({
        mutationFn: async (id: string) => {
            await apiFetch(`/data/habits/${id}`, { method: "DELETE" });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
    });

    const deleteAllHabits = useMutation({
        mutationFn: async () => {
            if (!userId) throw new Error("Not authenticated");
            await apiFetch("/data/habits/all", { method: "DELETE" });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
    });

    return {
        habits: habitsQuery.data ?? [],
        isLoading: habitsQuery.isLoading,
        error: habitsQuery.error,
        addHabit,
        updateHabit,
        completeHabit,
        deleteHabit,
        deleteAllHabits,
    };
}
