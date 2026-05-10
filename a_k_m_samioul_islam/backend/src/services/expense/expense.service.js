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

// Expense details update

export const updateExpenseDetailsService=async(expenseData)=>{
    const {id,amount,note}=expenseData;

    const expense=await Expense.findById(id);

    if (!expense) {
        const error = new Error("Expense not found");
        error.statusCode = 404;
        throw error;
    }

    if (!amount && !note) {
        const error = new Error("At least one field is required to update profile");
        error.statusCode = 400;
        throw error;
    }

    if(amount)
        expense.amount=amount;

    if(note)
        expense.note=note;

    await expense.save();

    return expense;
}

// Expense delete

export const deleteExpenseService=async(id)=>{
    const expense=await Expense.findByIdAndDelete(id);

    if (!expense) {
        const error = new Error("Expense not found");
        error.statusCode = 404;
        throw error;
    }

    return expense;
}

export const getExpensesService=async(id)=>{
    
}