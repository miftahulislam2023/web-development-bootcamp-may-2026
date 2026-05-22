import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export interface UserSettings {
    id: string;
    user_id: string;
    theme: "light" | "dark";
    currency: string;
    language: string;
    notifications_enabled: boolean;
    monthly_budget: number;
}

export function useSettings() {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const userId = user?.id;

    const settingsQuery = useQuery({
        queryKey: ["settings", userId],
        queryFn: async () => {
            if (!userId) return null;
            const result = await apiFetch("/data/settings");
            
            if (!result || result.length === 0) {
                // Create default settings if not exist
                const res = await apiFetch("/data/settings", {
                    method: "POST",
                    body: JSON.stringify({
                        theme: "dark",
                        currency: "BDT",
                        language: "en",
                        notifications_enabled: 1,
                        monthly_budget: 0,
                    })
                });
                return {
                    id: res.id,
                    user_id: userId,
                    theme: "dark" as const,
                    currency: "BDT",
                    language: "en",
                    notifications_enabled: true,
                    monthly_budget: 0,
                };
            }
            const row = result[0];
            return {
                id: row.id as string,
                user_id: row.user_id as string,
                theme: (row.theme as "light" | "dark") || "dark",
                currency: (row.currency as string) || "BDT",
                language: (row.language as string) || "en",
                notifications_enabled: Boolean(row.notifications_enabled),
                monthly_budget: (row.monthly_budget as number) || 0,
            };
        },
        enabled: !!userId,
    });

    const updateSettings = useMutation({
        mutationFn: async (updates: Partial<UserSettings> & { id?: string }) => {
            if (!userId) throw new Error("Not authenticated");
            const body: Record<string, any> = {};

            if (updates.id) body.id = updates.id;
            // if no id is passed, backend generic setup might complain since PUT requires ID.
            // Wait, we need the ID to update. The hook caller doesn't always pass it?
            // Actually they just call updateSettings({ theme: "light" });
            // In the generic handler, it expects `id` in the body.
            // I should fetch the id from the query cache.
            const queryData = queryClient.getQueryData(["settings", userId]) as UserSettings;
            if (queryData?.id) {
                body.id = queryData.id;
            }

            if (updates.theme !== undefined) body.theme = updates.theme;
            if (updates.currency !== undefined) body.currency = updates.currency;
            if (updates.language !== undefined) body.language = updates.language;
            if (updates.notifications_enabled !== undefined) body.notifications_enabled = updates.notifications_enabled ? 1 : 0;
            if (updates.monthly_budget !== undefined) body.monthly_budget = updates.monthly_budget;

            if (Object.keys(body).length > 0 && body.id) {
                await apiFetch("/data/settings", {
                    method: "PUT",
                    body: JSON.stringify(body)
                });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["settings"] });
        },
    });

    return {
        settings: settingsQuery.data,
        isLoading: settingsQuery.isLoading,
        error: settingsQuery.error,
        updateSettings,
    };
}
