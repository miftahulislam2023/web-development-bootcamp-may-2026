// useAppData.ts — Single unified data fetcher
// Fetches ALL user data in ONE API call and distributes to React Query cache

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export interface AppData {
    tasks: any[];
    finance: any[];
    budgets: any[];
    savings_transactions: any[];
    habits: any[];
    notes: any[];
    inventory: any[];
    study_subjects: any[];
    study_chapters_v2: any[];
    study_parts: any[];
    study_common_presets: any[];
}

export function useAppData() {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const userId = user?.id;

    const appDataQuery = useQuery<AppData>({
        queryKey: ["appData", userId],
        queryFn: async () => {
            if (!userId) throw new Error("Not authenticated");
            return await apiFetch("/data/all");
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 2,  // Data is fresh for 2 minutes — reduces unnecessary re-fetches on page switches
        gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
    });

    // When appData arrives, distribute it into individual query caches
    // This way all existing hooks (useTasks, useFinance, etc.) get their data
    // without making separate API calls
    useEffect(() => {
        if (appDataQuery.data) {
            const d = appDataQuery.data;
            queryClient.setQueryData(["tasks", userId], d.tasks);
            queryClient.setQueryData(["finance", userId], d.finance);
            queryClient.setQueryData(["budgets", userId], d.budgets);
            queryClient.setQueryData(["savings_transactions", userId], d.savings_transactions);
            queryClient.setQueryData(["habits", userId], d.habits);
            queryClient.setQueryData(["notes", userId], d.notes);
            queryClient.setQueryData(["inventory", userId], d.inventory);
            queryClient.setQueryData(["study_subjects", userId], d.study_subjects);
            queryClient.setQueryData(["study_chapters", userId], d.study_chapters_v2);
            queryClient.setQueryData(["study_parts", userId], d.study_parts);
            queryClient.setQueryData(["study_common_presets", userId], d.study_common_presets);
        }
    }, [appDataQuery.data, userId, queryClient]);

    return {
        isLoading: appDataQuery.isLoading,
        error: appDataQuery.error,
        refetch: appDataQuery.refetch,
    };
}
