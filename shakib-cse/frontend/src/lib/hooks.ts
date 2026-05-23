import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useToast } from "@/lib/toast";

export const useTransactions = (
  page = 1,
  pageSize = 20,
  filters?: Record<string, unknown>,
) =>
  useQuery({
    queryKey: ["transactions", page, pageSize, filters],
    queryFn: async () =>
      (await apiClient.getTransactions({ page, pageSize, ...filters })).data,
  });

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      apiClient.createTransaction(payload),
    onError: (error: any) => {
      const status = error.response?.status;
      const message = error.response?.data?.error?.message;

      if (status === 401) {
        // Token is invalid or expired, user needs to login again
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("accessToken");
          window.location.href = "/auth/login";
        }
      }
    },
    onSuccess: async () => {
      // refresh transactions and budgets
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
      await queryClient.invalidateQueries({ queryKey: ["budgets"] });

      // check budgets for limit/threshold breaches and show toast notifications
      try {
        type BudgetData = {
          limitAmount?: number | string;
          limit_amount?: number | string;
          spent?: number | string;
          alertThreshold?: number | string;
          alert_threshold?: number | string;
          name?: string;
        };

        const budgets = queryClient.getQueryData<BudgetData[]>(["budgets"]);
        if (Array.isArray(budgets) && budgets.length > 0) {
          budgets.forEach((b) => {
            const limit = Number(b.limitAmount ?? b.limit_amount ?? 0);
            const spent = Number(b.spent ?? 0);
            const threshold = Number(
              b.alertThreshold ?? b.alert_threshold ?? 0,
            );
            const name = String(b.name ?? "Budget");

            if (limit > 0 && spent >= limit) {
              useToast
                .getState()
                .show("info", `Budget \"${name}\" reached its limit.`);
            } else if (
              threshold > 0 &&
              limit > 0 &&
              spent >= (limit * threshold) / 100
            ) {
              useToast
                .getState()
                .show(
                  "info",
                  `Budget \"${name}\" reached ${threshold}% of its limit.`,
                );
            }
          });
        }
      } catch (err) {
        // swallow errors - don't break normal flow
        console.error("Budget notification check failed", err);
      }
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteTransaction(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });
};

export const useBudgets = () =>
  useQuery({
    queryKey: ["budgets"],
    queryFn: async () => (await apiClient.getBudgets()).data,
  });

export const useCreateBudget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      apiClient.createBudget(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["budgets"] }),
  });
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteBudget(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["budgets"] }),
  });
};

export const useCategories = (type?: string) =>
  useQuery({
    queryKey: ["categories", type],
    queryFn: async () =>
      (await apiClient.getCategories(type ? { type } : undefined)).data,
  });

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      apiClient.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useSavingsGoals = () =>
  useQuery({
    queryKey: ["savings-goals"],
    queryFn: async () => (await apiClient.getSavingsGoals()).data,
  });

export const useCreateSavingsGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      apiClient.createSavingsGoal(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savings-goals"] });
    },
  });
};

export const useDeleteSavingsGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteSavingsGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savings-goals"] });
    },
  });
};
