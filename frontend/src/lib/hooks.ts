// src/lib/hooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api";

// Transaction hooks
export const useTransactions = (
  page: number = 1,
  pageSize: number = 20,
  filters?: Record<string, any>,
) => {
  return useQuery({
    queryKey: ["transactions", page, pageSize, filters],
    queryFn: () => apiClient.getTransactions(page, pageSize, filters),
  });
};

export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: ["transaction", id],
    queryFn: () => apiClient.getTransaction(id),
    enabled: !!id,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, any>) =>
      apiClient.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, any> }) =>
      apiClient.updateTransaction(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transaction", id] });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useTransactionSummary = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ["transactionSummary", startDate, endDate],
    queryFn: () => apiClient.getTransactionSummary(startDate, endDate),
  });
};

// Category hooks
export const useCategories = (type?: string) => {
  return useQuery({
    queryKey: ["categories", type],
    queryFn: () => apiClient.getCategories(type),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, any>) => apiClient.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

// Budget hooks
export const useBudgets = () => {
  return useQuery({
    queryKey: ["budgets"],
    queryFn: () => apiClient.getBudgets(),
  });
};

export const useBudget = (id: string) => {
  return useQuery({
    queryKey: ["budget", id],
    queryFn: () => apiClient.getBudget(id),
    enabled: !!id,
  });
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, any>) => apiClient.createBudget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, any> }) =>
      apiClient.updateBudget(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["budget", id] });
    },
  });
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
};
