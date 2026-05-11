import { categoryWiseExpenseService, getSummaryService, getTransactionsService } from "../../services/summary/summary.service.js";

// Dashboard summary fetch

export const getSummary=async(req,res)=>{
    try {
        const summary=await getSummaryService(req.dbUser);

        return res.status(200).json({
            success: true,
            message: "Summary fetched successfully",
            data:summary
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

// Last 7 days category wise expense

export const categoryWiseExpense=async(req,res)=>{
    try {
        const expense=await categoryWiseExpenseService(req.dbUser);

        return res.status(200).json({
            success: true,
            message: "Expenses fetched successfully",
            data: expense
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

// Income vs Expense

export const getTransactions=async(req,res)=>{
    try {
        const transactions=await getTransactionsService(req.dbUser);

        return res.status(200).json({
            success: true,
            message: "Transactions fetched successfully",
            data: transactions
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};