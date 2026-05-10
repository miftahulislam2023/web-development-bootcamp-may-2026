import { Expense } from "../../models/expense/expense.model.js";

export const createExpenseService = async (expenseData) => {
    const { title, amount, user, category, note } = expenseData;

    if (!title || !amount || !category) {
        const error = new Error("All fields required");
        error.statusCode = 400;
        throw error;
    }

    const expense = await Expense.create(expenseData);

    return expense;
};
