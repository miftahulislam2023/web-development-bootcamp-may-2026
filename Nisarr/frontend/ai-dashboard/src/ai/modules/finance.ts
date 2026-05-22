// Finance AI Module - handles expense, income, budget, savings actions

import { AIModule, FinanceHooks } from '../core/types';

export const FINANCE_ACTIONS = [
    "ADD_EXPENSE",
    "ADD_INCOME",
    "DELETE_EXPENSE",
    "EDIT_EXPENSE",
    "EDIT_INCOME",
    "ADD_BUDGET",
    "UPDATE_BUDGET",
    "DELETE_BUDGET",
    "ADD_SAVINGS",
    "ADD_TO_SAVINGS",
    "WITHDRAW_FROM_SAVINGS",
    "UPDATE_SAVINGS",
    "DELETE_SAVINGS",
    "ADD_SPECIAL_EXPENSE",
    "ADD_SPECIAL_INCOME",
    "ADD_SPECIAL_BUDGET",
    "ADD_SPECIAL_SAVINGS",
    "TOGGLE_SPECIAL",
];

export const FINANCE_PROMPT = `IMPORTANT RULES FOR FINANCE:
- When user mentions money/amount without specifying "income" or "expense", ASK which type it is in a friendly way.
- When adding expense or income, ALWAYS ask for category if not specified.
- Common expense categories: Food, Transport, Entertainment, Shopping, Bills, Health, Education, Other
- Common income categories: Salary, Freelance, Gift, Investment, Other
- For dates, use ISO format (YYYY-MM-DD). Parse dates like "1 feb" as the current year.

For ADD_EXPENSE/ADD_INCOME, data must include: amount (number), category (string), description (optional), date (optional YYYY-MM-DD format).
For EDIT_EXPENSE/EDIT_INCOME, data must include: id (string), and any fields to update: amount, category, description, date.

SPECIAL ITEMS RULES:
- When user says "special expense", "special income", "special budget", or "special savings", use the corresponding SPECIAL action.
- Special items are one-time or unusual transactions tracked separately (emergency, gifts, windfalls, large purchases).
- ADD_SPECIAL_EXPENSE/ADD_SPECIAL_INCOME: same as regular but marked as special
- ADD_SPECIAL_BUDGET/ADD_SPECIAL_SAVINGS: same as regular but marked as special
- TOGGLE_SPECIAL: data must include id (string) to toggle an entry's special status

Special Examples:
- "add special expense 5000 birthday party" → ADD_SPECIAL_EXPENSE with amount 5000, category "Other", description "birthday party"
- "special income 10000 bonus" → ADD_SPECIAL_INCOME with amount 10000, category "Gift", description "bonus"
- "create special budget 50000 for wedding" → ADD_SPECIAL_BUDGET with name "Wedding", target_amount 50000

BUDGET/SAVINGS RULES:
For ADD_BUDGET, data must include: name (string), target_amount (number), period ('weekly'/'monthly'/'yearly'), category (optional), start_date (optional, YYYY-MM-DD for future budgets)
For UPDATE_BUDGET, data must include: name (string to find budget), and any of: target_amount, period, category, start_date to update
For ADD_SAVINGS, data must include: name (string), target_amount (number)
For UPDATE_SAVINGS, data must include: name (string to find savings), and any of: target_amount, current_amount to update
For ADD_TO_SAVINGS, data must include: id or name (string), amount (number to add)
For WITHDRAW_FROM_SAVINGS, data must include: name (string to find savings), amount (number to withdraw). This ALSO creates an expense entry in finance history.

Budget/Savings Examples:
- "set monthly budget 10000" → ADD_BUDGET with name "Monthly Budget", target_amount 10000, period "monthly"
- "set budget for march 15000" → ADD_BUDGET with name "March Budget", target_amount 15000, period "monthly", start_date "2026-03-01"
- "change budget to 8000" → UPDATE_BUDGET with name (current budget name), target_amount 8000
- "create savings goal for laptop 50000" → ADD_SAVINGS with name "Laptop", target_amount 50000
- "update laptop savings goal to 60000" → UPDATE_SAVINGS with name "Laptop", target_amount 60000
- "add 5000 to laptop savings" → ADD_TO_SAVINGS with name "Laptop", amount 5000
- "used 200 from emergency savings" → WITHDRAW_FROM_SAVINGS with name "Emergency", amount 200
- "take 1000 from laptop savings" → WITHDRAW_FROM_SAVINGS with name "Laptop", amount 1000`;

export async function executeFinanceAction(
    action: string,
    data: Record<string, unknown>,
    hooks: FinanceHooks
): Promise<void> {
    switch (action) {
        case "ADD_EXPENSE":
            await hooks.addEntry.mutateAsync({
                type: "expense",
                amount: Number(data.amount),
                category: String(data.category),
                description: data.description ? String(data.description) : "",
                date: data.date ? String(data.date) : new Date().toISOString().split("T")[0],
            });
            break;

        case "ADD_INCOME":
            await hooks.addEntry.mutateAsync({
                type: "income",
                amount: Number(data.amount),
                category: String(data.category),
                description: data.description ? String(data.description) : "",
                date: data.date ? String(data.date) : new Date().toISOString().split("T")[0],
            });
            break;

        case "DELETE_EXPENSE":
            await hooks.deleteEntry.mutateAsync(String(data.id));
            break;

        case "EDIT_EXPENSE":
        case "EDIT_INCOME":
            await hooks.updateEntry.mutateAsync({
                id: String(data.id),
                amount: data.amount ? Number(data.amount) : undefined,
                category: data.category ? String(data.category) : undefined,
                description: data.description ? String(data.description) : undefined,
                date: data.date ? String(data.date) : undefined,
            });
            break;

        case "ADD_BUDGET":
            await hooks.addBudget.mutateAsync({
                name: String(data.name),
                type: "budget",
                target_amount: Number(data.target_amount),
                period: data.period as "monthly" | "weekly" | "yearly",
                category: data.category ? String(data.category) : null,
                start_date: data.start_date ? String(data.start_date) : null,
            });
            break;

        case "UPDATE_BUDGET": {
            const budgetToUpdate = hooks.budgets?.find(b =>
                b.type === "budget" && b.name.toLowerCase().includes((data.name as string || "").toLowerCase())
            );
            if (budgetToUpdate) {
                await hooks.updateBudget.mutateAsync({
                    id: budgetToUpdate.id,
                    target_amount: data.target_amount ? Number(data.target_amount) : undefined,
                    period: data.period as "monthly" | "weekly" | "yearly" | undefined,
                    category: data.category ? String(data.category) : undefined,
                    start_date: data.start_date ? String(data.start_date) : undefined,
                });
            }
            break;
        }

        case "DELETE_BUDGET": {
            const budgetToDelete = hooks.budgets?.find(b =>
                b.type === "budget" && b.name.toLowerCase().includes((data.name as string || "").toLowerCase())
            );
            if (budgetToDelete) await hooks.deleteBudget.mutateAsync(budgetToDelete.id);
            break;
        }

        case "ADD_SAVINGS":
            await hooks.addBudget.mutateAsync({
                name: String(data.name),
                type: "savings",
                target_amount: Number(data.target_amount),
                period: null,
                category: null,
            });
            break;

        case "ADD_TO_SAVINGS": {
            const savings = hooks.savingsGoals?.find(s =>
                s.name.toLowerCase().includes((data.name as string || "").toLowerCase())
            );
            if (savings) {
                await hooks.addToSavings.mutateAsync({
                    id: savings.id,
                    amount: Number(data.amount),
                });
            }
            break;
        }

        case "UPDATE_SAVINGS": {
            const savingsToUpdate = hooks.savingsGoals?.find(s =>
                s.name.toLowerCase().includes((data.name as string || "").toLowerCase())
            );
            if (savingsToUpdate) {
                await hooks.updateBudget.mutateAsync({
                    id: savingsToUpdate.id,
                    target_amount: data.target_amount ? Number(data.target_amount) : undefined,
                    current_amount: data.current_amount ? Number(data.current_amount) : undefined,
                });
            }
            break;
        }

        case "DELETE_SAVINGS": {
            const savingsToDelete = hooks.savingsGoals?.find(s =>
                s.name.toLowerCase().includes((data.name as string || "").toLowerCase())
            );
            if (savingsToDelete) await hooks.deleteBudget.mutateAsync(savingsToDelete.id);
            break;
        }

        // Special Item Actions
        case "ADD_SPECIAL_EXPENSE":
            await hooks.addEntry.mutateAsync({
                type: "expense",
                amount: Number(data.amount),
                category: String(data.category || "Other"),
                description: data.description ? String(data.description) : "",
                date: data.date ? String(data.date) : new Date().toISOString().split("T")[0],
                is_special: true,
            });
            break;

        case "ADD_SPECIAL_INCOME":
            await hooks.addEntry.mutateAsync({
                type: "income",
                amount: Number(data.amount),
                category: String(data.category || "Other"),
                description: data.description ? String(data.description) : "",
                date: data.date ? String(data.date) : new Date().toISOString().split("T")[0],
                is_special: true,
            });
            break;

        case "ADD_SPECIAL_BUDGET":
            await hooks.addBudget.mutateAsync({
                name: String(data.name),
                type: "budget",
                target_amount: Number(data.target_amount),
                period: data.period as "monthly" | "weekly" | "yearly" || "monthly",
                category: data.category ? String(data.category) : null,
                start_date: data.start_date ? String(data.start_date) : null,
                is_special: true,
            });
            break;

        case "ADD_SPECIAL_SAVINGS":
            await hooks.addBudget.mutateAsync({
                name: String(data.name),
                type: "savings",
                target_amount: Number(data.target_amount),
                period: null,
                category: null,
                is_special: true,
            });
            break;

        case "TOGGLE_SPECIAL": {
            // Find the entry and toggle its special status
            const entry = hooks.entries?.find(e => e.id === data.id);
            if (entry) {
                await hooks.updateEntry.mutateAsync({
                    id: String(data.id),
                    is_special: !entry.is_special,
                });
            }
            break;
        }
    }
}

export const financeModule: AIModule = {
    name: "finance",
    actions: FINANCE_ACTIONS,
    prompt: FINANCE_PROMPT,
    execute: executeFinanceAction as AIModule['execute'],
};
