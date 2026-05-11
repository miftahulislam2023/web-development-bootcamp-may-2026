import { createBudgetService } from "../../services/budget/budget.service.js";

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
