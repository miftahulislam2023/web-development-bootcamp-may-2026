import { createExpenseService } from "../../services/expense/expense.service"

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
}