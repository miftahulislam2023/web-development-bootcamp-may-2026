import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export interface FinanceEntry {
    id: string;
    user_id: string;
    type: "income" | "expense";
    amount: number;
    category: string;
    description?: string;
    date: string;
    is_special?: boolean;
}

export function useFinance() {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const userId = user?.id;

    const financeQuery = useQuery({
        queryKey: ["finance", userId],
        queryFn: async () => {
            if (!userId) return [];
            return await apiFetch("/data/finance");
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 2, // 2 min — useAppData pre-populates this cache
    });

    const addEntry = useMutation({
        mutationFn: async (entry: { type: "income" | "expense"; amount: number; category: string; description?: string; date?: string; is_special?: boolean }) => {
            if (!userId) throw new Error("Not authenticated");
            let date: string;
            if (entry.date) {
                if (/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) {
                    date = new Date(entry.date + "T12:00:00").toISOString();
                } else {
                    date = new Date(entry.date).toISOString();
                }
            } else {
                date = new Date().toISOString();
            }
            
            const res = await apiFetch("/data/finance", {
                method: "POST",
                body: JSON.stringify({
                    type: entry.type,
                    amount: entry.amount,
                    category: entry.category,
                    description: entry.description || null,
                    date,
                    is_special: entry.is_special ? 1 : 0
                })
            });
            return res.id;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["finance", userId] }),
    });

    const deleteEntry = useMutation({
        mutationFn: async (id: string) => {
            await apiFetch(`/data/finance/${id}`, { method: "DELETE" });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["finance", userId] }),
    });

    const updateEntry = useMutation({
        mutationFn: async (entry: { id: string; type?: "income" | "expense"; amount?: number; category?: string; description?: string; date?: string; is_special?: boolean }) => {
            const body: Record<string, any> = { id: entry.id };
            if (entry.type) body.type = entry.type;
            if (entry.amount !== undefined) body.amount = entry.amount;
            if (entry.category) body.category = entry.category;
            if (entry.description !== undefined) body.description = entry.description || null;
            if (entry.date) {
                if (/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) {
                    body.date = new Date(entry.date + "T12:00:00").toISOString();
                } else {
                    body.date = new Date(entry.date).toISOString();
                }
            }
            if (entry.is_special !== undefined) body.is_special = entry.is_special ? 1 : 0;
            
            if (Object.keys(body).length > 1) {
                await apiFetch("/data/finance", {
                    method: "PUT",
                    body: JSON.stringify(body)
                });
            }
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["finance", userId] }),
    });

    const entries = financeQuery.data ?? [];

    // Separate regular and special entries
    const regularEntries = entries.filter((e) => !e.is_special);
    const specialEntries = entries.filter((e) => e.is_special);

    // Regular entries calculations
    const expenses = regularEntries.filter((e) => e.type === "expense");
    const incomes = regularEntries.filter((e) => e.type === "income");
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = incomes.reduce((sum, e) => sum + e.amount, 0);
    const balance = totalIncome - totalExpenses;

    // Special entries calculations
    const specialExpenses = specialEntries.filter((e) => e.type === "expense");
    const specialIncomes = specialEntries.filter((e) => e.type === "income");
    const totalSpecialExpenses = specialExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalSpecialIncome = specialIncomes.reduce((sum, e) => sum + e.amount, 0);
    const specialBalance = totalSpecialIncome - totalSpecialExpenses;

    const expensesByCategory = expenses.reduce(
        (acc, e) => {
            acc[e.category] = (acc[e.category] || 0) + e.amount;
            return acc;
        },
        {} as Record<string, number>
    );

    return {
        entries,
        regularEntries,
        specialEntries,
        expenses,
        incomes,
        specialExpenses,
        specialIncomes,
        totalExpenses,
        totalIncome,
        totalSpecialExpenses,
        totalSpecialIncome,
        balance,
        specialBalance,
        expensesByCategory,
        isLoading: financeQuery.isLoading,
        error: financeQuery.error,
        addEntry,
        deleteEntry,
        updateEntry,
    };
}
