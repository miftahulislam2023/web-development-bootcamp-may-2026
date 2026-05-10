import { Expense } from "../../models/expense/expense.model.js";

// Expense creation

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

// Expense fetch

export const getExpenseDetailsService=async(id)=>{
    const expense= await Expense.findById(id).populate("user", "email");

    if(!expense){
        const error = new Error("Expense not found");
        error.statusCode = 404;
        throw error;
    }

    return expense;
}
