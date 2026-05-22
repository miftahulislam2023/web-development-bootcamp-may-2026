import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useFinance } from "./useFinance";

export interface Budget {
    id: string;
    user_id: string;
    name: string;
    type: "budget" | "savings";
    target_amount: number;
    current_amount: number;
    period: "monthly" | "weekly" | "yearly" | null;
    category: string | null;
    start_date: string | null;
    is_special?: boolean;
    created_at: string;
}

export interface SavingsTransaction {
    id: string;
    savings_id: string;
    user_id: string;
    type: "deposit" | "withdraw";
    amount: number;
    description: string | null;
    date: string;
    created_at: string;
}

export function useBudget() {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const userId = user?.id;
    const { expenses } = useFinance();

    const budgetQuery = useQuery({
        queryKey: ["budgets", userId],
        queryFn: async () => {
            if (!userId) return [];
            return await apiFetch("/data/budgets");
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 2,
    });

    // Query savings transactions
    const savingsTransactionsQuery = useQuery({
        queryKey: ["savings_transactions", userId],
        queryFn: async () => {
            if (!userId) return [];
            return await apiFetch("/data/savings_transactions");
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 2,
    });

    const addBudget = useMutation({
        mutationFn: async (budget: {
            name: string;
            type: "budget" | "savings";
            target_amount: number;
            period?: "monthly" | "weekly" | "yearly" | null;
            category?: string | null;
            start_date?: string | null;
            is_special?: boolean;
        }) => {
            if (!userId) throw new Error("Not authenticated");
            const res = await apiFetch("/data/budgets", {
                method: "POST",
                body: JSON.stringify({
                    name: budget.name,
                    type: budget.type,
                    target_amount: budget.target_amount,
                    current_amount: 0,
                    period: budget.period || null,
                    category: budget.category || null,
                    start_date: budget.start_date || null,
                    is_special: budget.is_special ? 1 : 0
                })
            });
            return res.id;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["budgets"] }),
    });

    const updateBudget = useMutation({
        mutationFn: async (budget: {
            id: string;
            name?: string;
            target_amount?: number;
            current_amount?: number;
            period?: "monthly" | "weekly" | "yearly" | null;
            category?: string | null;
            start_date?: string | null;
            is_special?: boolean;
        }) => {
            const body: Record<string, any> = { id: budget.id };

            if (budget.name) body.name = budget.name;
            if (budget.target_amount !== undefined) body.target_amount = budget.target_amount;
            if (budget.current_amount !== undefined) body.current_amount = budget.current_amount;
            if (budget.period !== undefined) body.period = budget.period;
            if (budget.category !== undefined) body.category = budget.category;
            if (budget.start_date !== undefined) body.start_date = budget.start_date;
            if (budget.is_special !== undefined) body.is_special = budget.is_special ? 1 : 0;

            if (Object.keys(body).length > 1) {
                await apiFetch("/data/budgets", {
                    method: "PUT",
                    body: JSON.stringify(body)
                });
            }
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["budgets"] }),
    });

    // Add to savings and record transaction
    const addToSavings = useMutation({
        mutationFn: async ({ id, amount, description }: { id: string; amount: number; description?: string }) => {
            if (!userId) throw new Error("Not authenticated");

            await apiFetch("/data/budgets/savings/add", {
                method: "POST",
                body: JSON.stringify({ id, amount, description })
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgets"] });
            queryClient.invalidateQueries({ queryKey: ["savings_transactions"] });
        },
    });

    const deleteSavingsTransaction = useMutation({
        mutationFn: async ({ id, savingsId, amount, type }: { id: string; savingsId: string; amount: number; type: "deposit" | "withdraw" }) => {
            await apiFetch(`/data/budgets/savings/tx/${id}`, {
                method: "DELETE",
                body: JSON.stringify({ id, savingsId, amount, type })
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgets"] });
            queryClient.invalidateQueries({ queryKey: ["savings_transactions"] });
        },
    });

    // Update savings transaction (for editing)
    const updateSavingsTransaction = useMutation({
        mutationFn: async ({
            id,
            savingsId,
            oldAmount,
            oldType,
            newAmount,
            newType,
            newDate,
            newDescription
        }: {
            id: string;
            savingsId: string;
            oldAmount: number;
            oldType: "deposit" | "withdraw";
            newAmount: number;
            newType: "deposit" | "withdraw";
            newDate: string;
            newDescription?: string;
        }) => {
            await apiFetch(`/data/budgets/savings/tx/${id}`, {
                method: "PUT",
                body: JSON.stringify({
                    id, savingsId, oldAmount, oldType, newAmount, newType, newDate, newDescription
                })
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgets"] });
            queryClient.invalidateQueries({ queryKey: ["savings_transactions"] });
        },
    });

    const deleteBudget = useMutation({
        mutationFn: async (id: string) => {
            await apiFetch(`/data/budgets/${id}`, { method: "DELETE" });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["budgets"] }),
    });

    const budgets = budgetQuery.data ?? [];

    // Separate regular and special budgets
    const regularBudgets = budgets.filter(b => !b.is_special);
    const specialBudgets = budgets.filter(b => b.is_special);

    // Regular goals
    const savingsGoals = regularBudgets.filter(b => b.type === "savings");
    const budgetGoals = regularBudgets.filter(b => b.type === "budget");

    // Special goals
    const specialSavingsGoals = specialBudgets.filter(b => b.type === "savings");
    const specialBudgetGoals = specialBudgets.filter(b => b.type === "budget");

    const savingsTransactions = savingsTransactionsQuery.data ?? [];

    // Calculate total savings (regular only)
    const totalSavings = savingsGoals.reduce((sum, s) => sum + s.current_amount, 0);

    // Calculate special savings
    const totalSpecialSavings = specialSavingsGoals.reduce((sum, s) => sum + s.current_amount, 0);

    // Calculate budget remaining for a specific budget
    const getBudgetRemaining = (budget: Budget): number => {
        if (budget.type !== "budget") return 0;

        const now = new Date();
        let startDate: Date;
        let endDate: Date;

        // Use start_date if provided (user selected specific month/year)
        if (budget.start_date) {
            // Parse YYYY-MM-DD without timezone issues
            const [year, month] = budget.start_date.split('-').map(Number);
            const budgetStart = new Date(year, month - 1, 1); // month is 0-indexed

            switch (budget.period) {
                case "weekly": {
                    startDate = budgetStart;
                    endDate = new Date(budgetStart);
                    endDate.setDate(endDate.getDate() + 6);
                    break;
                }
                case "monthly": {
                    startDate = new Date(year, month - 1, 1);
                    endDate = new Date(year, month, 0, 23, 59, 59); // Last day of month
                    break;
                }
                case "yearly": {
                    startDate = new Date(year, 0, 1);
                    endDate = new Date(year, 11, 31, 23, 59, 59);
                    break;
                }
                default:
                    startDate = budgetStart;
                    endDate = now;
            }
        } else {
            // Default behavior: current period
            endDate = now;
            switch (budget.period) {
                case "weekly": {
                    const dayOfWeek = now.getDay();
                    const daysFromSaturday = (dayOfWeek + 1) % 7;
                    startDate = new Date(now);
                    startDate.setDate(now.getDate() - daysFromSaturday);
                    startDate.setHours(0, 0, 0, 0);
                    break;
                }
                case "monthly": {
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    break;
                }
                case "yearly": {
                    startDate = new Date(now.getFullYear(), 0, 1);
                    break;
                }
                default:
                    startDate = new Date(0);
            }
        }

        // Filter expenses for this period and category
        const periodExpenses = expenses.filter(e => {
            const expenseDate = new Date(e.date);
            if (expenseDate < startDate || expenseDate > endDate) return false;
            if (budget.category && e.category !== budget.category) return false;
            return true;
        });

        const spent = periodExpenses.reduce((sum, e) => sum + e.amount, 0);
        return budget.target_amount - spent;
    };

    // Get the monthly budget for the current month
    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const primaryBudget = budgetGoals.find(b => b.period === "monthly" && b.start_date?.startsWith(currentMonthStr))
        || budgetGoals.find(b => b.period === "monthly" && !b.start_date)
        || budgetGoals.find(b => b.period === "monthly")
        || budgetGoals[0];
    const budgetRemaining = primaryBudget ? getBudgetRemaining(primaryBudget) : 0;

    return {
        budgets,
        regularBudgets,
        specialBudgets,
        savingsGoals,
        budgetGoals,
        specialSavingsGoals,
        specialBudgetGoals,
        totalSavings,
        totalSpecialSavings,
        budgetRemaining,
        primaryBudget,
        getBudgetRemaining,
        isLoading: budgetQuery.isLoading,
        error: budgetQuery.error,
        addBudget,
        updateBudget,
        addToSavings,
        deleteBudget,
        savingsTransactions,
        deleteSavingsTransaction,
        updateSavingsTransaction,
    };
}
