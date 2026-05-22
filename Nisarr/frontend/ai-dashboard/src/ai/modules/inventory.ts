// Inventory AI Module - handles inventory item actions

import { AIModule, InventoryHooks } from '../core/types';

export const INVENTORY_ACTIONS = [
    "ADD_INVENTORY",
    "UPDATE_INVENTORY",
    "DELETE_INVENTORY",
];

export const INVENTORY_PROMPT = `INVENTORY RULES:
For ADD_INVENTORY, data must include: item_name (string), quantity (number, default 1), category (string), cost (number, optional), store (string, optional).
For UPDATE_INVENTORY, data must include: item_name (to identify), and any fields to update (quantity, status, notes, warranty_expiry, category).
For DELETE_INVENTORY, data must include: item_name.

IMPORTANT:
- Always use specific item names.
- "bought 5 pens" -> ADD_INVENTORY { item_name: "Pens", quantity: 5 }
- "sold my old phone" -> UPDATE_INVENTORY { item_name: "Phone", status: "sold" }
- "update macbook warranty to 2026-01-01" -> UPDATE_INVENTORY { item_name: "Macbook", warranty_expiry: "2026-01-01" }`;

export async function executeInventoryAction(
    action: string,
    data: Record<string, unknown>,
    hooks: InventoryHooks
): Promise<void> {
    switch (action) {
        case "ADD_INVENTORY":
            await hooks.addItem.mutateAsync({
                item_name: String(data.item_name),
                quantity: data.quantity ? Number(data.quantity) : 1,
                category: data.category ? String(data.category) : "General",
                cost: data.cost ? Number(data.cost) : undefined,
                store: data.store ? String(data.store) : undefined,
            });
            break;

        case "UPDATE_INVENTORY": {
            const itemToUpdate = hooks.items?.find(i =>
                i.item_name.toLowerCase().includes((data.item_name as string || "").toLowerCase())
            );
            if (itemToUpdate && hooks.updateItem) {
                await hooks.updateItem.mutateAsync({
                    ...itemToUpdate,
                    ...data,
                    id: itemToUpdate.id, // Ensure ID is preserved
                });
            }
            break;
        }

        case "DELETE_INVENTORY": {
            const itemToDelete = hooks.items?.find(i =>
                i.item_name.toLowerCase().includes((data.item_name as string || "").toLowerCase())
            );
            if (itemToDelete) await hooks.deleteItem.mutateAsync(itemToDelete.id);
            break;
        }
    }
}

export const inventoryModule: AIModule = {
    name: "inventory",
    actions: INVENTORY_ACTIONS,
    prompt: INVENTORY_PROMPT,
    execute: executeInventoryAction as AIModule['execute'],
};
