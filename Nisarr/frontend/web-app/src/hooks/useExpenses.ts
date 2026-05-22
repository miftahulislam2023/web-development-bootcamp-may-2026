import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export interface Expense {
    id: string;
    amount: number;
    category: string;
    description?: string;
    date: string;
}

export function useExpenses() {
    const queryClient = useQueryClient();

    const expensesQuery = useQuery({
        queryKey: ["expenses"],
        queryFn: async () => {
            return apiFetch("/data/expenses");
        },
    });

    const addExpense = useMutation({
        mutationFn: async (expense: Omit<Expense, "id" | "date">) => {
            const res = await apiFetch("/data/expenses", {
                method: "POST",
                body: JSON.stringify(expense)
            });
            return res.id;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["expenses"] }),
    });

    const deleteExpense = useMutation({
        mutationFn: async (id: string) => {
            await apiFetch(`/data/expenses/${id}`, { method: "DELETE" });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["expenses"] }),
    });

    // Calculate totals by category
    const totalsByCategory = (expensesQuery.data ?? []).reduce(
        (acc, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
            return acc;
        },
        {} as Record<string, number>
    );

    const total = (expensesQuery.data ?? []).reduce((acc, exp) => acc + exp.amount, 0);

    return {
        expenses: expensesQuery.data ?? [],
        isLoading: expensesQuery.isLoading,
        error: expensesQuery.error,
        totalsByCategory,
        total,
        addExpense,
        deleteExpense,
    };
}
