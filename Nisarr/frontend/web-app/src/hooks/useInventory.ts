import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export interface InventoryItem {
    id: string;
    user_id: string;
    item_name: string;
    category?: string;
    quantity: number;
    cost?: number;
    purchase_date?: string;
    store?: string;
    notes?: string;
    status: "active" | "sold" | "disposed" | "lost";
    warranty_expiry?: string;
    finance_entry_id?: string;
}

export function useInventory() {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const userId = user?.id;

    const inventoryQuery = useQuery({
        queryKey: ["inventory", userId],
        queryFn: async () => {
            if (!userId) return [];
            return await apiFetch("/data/inventory");
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 2,
    });

    const addItem = useMutation({
        mutationFn: async (item: Omit<InventoryItem, "id" | "user_id" | "finance_entry_id"> & { record_purchase?: boolean, finance_category?: string }) => {
            if (!userId) throw new Error("Not authenticated");
            let financeId = null;

            // Auto-create finance expense if requested
            if (item.record_purchase && item.cost && item.cost > 0) {
                const finRes = await apiFetch("/data/finance", {
                    method: "POST",
                    body: JSON.stringify({
                        type: 'expense',
                        amount: item.cost,
                        category: item.finance_category || "Shopping",
                        description: `Purchase: ${item.item_name}`,
                        date: item.purchase_date || new Date().toISOString()
                    })
                });
                financeId = finRes.id;
            }

            const res = await apiFetch("/data/inventory", {
                method: "POST",
                body: JSON.stringify({
                    item_name: item.item_name,
                    category: item.category || null,
                    quantity: item.quantity || 1,
                    cost: item.cost || null,
                    purchase_date: item.purchase_date || null,
                    store: item.store || null,
                    notes: item.notes || null,
                    status: item.status || 'active',
                    warranty_expiry: item.warranty_expiry || null,
                    finance_entry_id: financeId
                })
            });
            return res.id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inventory"] });
            queryClient.invalidateQueries({ queryKey: ["finance"] }); // Refresh finance too
        },
    });

    const updateItem = useMutation({
        mutationFn: async (item: InventoryItem) => {
            await apiFetch("/data/inventory", {
                method: "PUT",
                body: JSON.stringify({
                    id: item.id,
                    item_name: item.item_name,
                    category: item.category || null,
                    quantity: item.quantity,
                    cost: item.cost || null,
                    purchase_date: item.purchase_date || null,
                    store: item.store || null,
                    notes: item.notes || null,
                    status: item.status,
                    warranty_expiry: item.warranty_expiry || null
                })
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] }),
    });

    const markAsSold = useMutation({
        mutationFn: async ({ id, salePrice, saleDate }: { id: string, salePrice: number, saleDate: string }) => {
            if (!userId) throw new Error("Not authenticated");

            // 1. Update Inventory Item
            await apiFetch("/data/inventory", {
                method: "PUT",
                body: JSON.stringify({ id, status: 'sold' })
            });

            // 2. Add Income Entry to Finance
            if (salePrice > 0) {
                const item = inventoryQuery.data?.find((i: any) => i.id === id);
                const description = item ? `Sold: ${item.item_name}` : "Sold Inventory Item";

                await apiFetch("/data/finance", {
                    method: "POST",
                    body: JSON.stringify({
                        type: 'income',
                        amount: salePrice,
                        category: 'Sales',
                        description,
                        date: saleDate
                    })
                });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inventory"] });
            queryClient.invalidateQueries({ queryKey: ["finance"] });
        },
    });

    const deleteItem = useMutation({
        mutationFn: async (id: string) => {
            await apiFetch(`/data/inventory/${id}`, { method: "DELETE" });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] }),
    });

    const totalValue = (inventoryQuery.data ?? []).reduce((sum, item) => sum + (item.cost || 0), 0);

    return {
        items: inventoryQuery.data ?? [],
        totalValue,
        isLoading: inventoryQuery.isLoading,
        error: inventoryQuery.error,
        addItem,
        updateItem,
        deleteItem,
        markAsSold,
    };
}
