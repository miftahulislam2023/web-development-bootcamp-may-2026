import { createExpenseService, deleteExpenseService, getExpenseDetailsService, getExpensesService, updateExpenseDetailsService, } from "../../services/expense/expense.service.js";

// Expense creation

export const createExpense = async (req, res) => {
    try {
        const expense = await createExpenseService(req.body, req.dbUser);

        return res.status(201).json({
            success: true,
            message: "Expense created successfully",
            data: expense
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

// Expense fetch

export const getExpenseDetails = async (req, res) => {
    try {
        const expense = await getExpenseDetailsService(req.params.id, req.dbUser);

        return res.status(200).json({
            success: true,
            message: "Expense details fetched successfully",
            data: expense
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

// Expense update

export const updateExpenseDetails = async (req, res) => {
    try {
        const expense = await updateExpenseDetailsService({
            ...req.body, 
            id: req.params.id
        }, req.dbUser);

        return res.status(200).json({
            success: true,
            message: "Expense details updated successfully",
            data: expense
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

// Expense deletion

export const deleteExpense = async (req, res) => {
    try {
        const expense = await deleteExpenseService(req.params.id, req.dbUser);

        return res.status(200).json({
            success: true,
            message: "Expense deleted successfully"
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

// Users expenses

export const getExpenses = async (req, res) => {
    try {
        const expenses = await getExpensesService({
            dbUser: req.dbUser,
            ...req.query
        });

        return res.status(200).json({
            success: true,
            message: "Expenses fetched successfully",
            data:expenses
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};
