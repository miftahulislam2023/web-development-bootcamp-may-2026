import { createExpenseService, getExpenseDetailsService } from "../../services/expense/expense.service"

// Expense creation

export const createExpense=async(req,res)=>{
    try {
        const expense=await createExpenseService(req.body);

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

export const getExpense=async(req,res)=>{
    try {
        const expense=await getExpenseDetailsService(req.params.id);

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
}