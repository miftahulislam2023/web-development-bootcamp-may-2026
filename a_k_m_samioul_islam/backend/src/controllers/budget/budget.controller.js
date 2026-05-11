import { createBudgetService, getBudgetSummaryService, getCurrentBudgetService } from "../../services/budget/budget.service.js";

// Budget creation

export const createBudget = async (req, res) => {
    try {
        const budget = await createBudgetService({
        ...req.body,
        dbUser: req.dbUser
        });

        return res.status(201).json({
            success: true,
            message: "Budget created successfully",
            data: budget
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

// Current budget

export const getCurrentBudget=async(req,res)=>{
    try {
        const budget=await getCurrentBudgetService(req.dbUser);

        return res.status(200).json({
            success: true,
            message: "Current budget fetched successfully",
            data: budget
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
}

// Budget summary

export const getBudgetSummary=async(req,res)=>{
    try {
        const summary=await getBudgetSummaryService(req.dbUser);

        return res.status(200).json({
            success: true,
            message: "Budget summary fetched successfully",
            data: summary
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};